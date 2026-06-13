import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { standupSchema } from '@/validators/standup.schema';
import { getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = standupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { mood, finished, today, blocker, memberName, teamCode, memberId } = parsed.data;
    const db = createServerClient();
    const date = getPHTDateString();

    // Check for duplicate submission (one standup per member per day)
    const { data: existing } = await db
      .from('standups')
      .select('id')
      .eq('member_id', memberId)
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You have already submitted your standup today' },
        { status: 409 }
      );
    }

    // Get team id from code
    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', teamCode.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    const { data: standup, error } = await db
      .from('standups')
      .insert({
        team_id: team.id,
        member_id: memberId,
        member_name: memberName,
        mood: mood ?? null,
        finished,
        today,
        blocker: blocker || null,
        date,
      })
      .select()
      .single();

    if (error || !standup) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to submit standup' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup>>(
      { success: true, data: standup },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/standups]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
