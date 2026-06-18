import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { standupFormSchema } from '@/validators/standup.schema';
import { getPHTDateString } from '@/lib/utils';
import { getSessionUser, assertTeamMember } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json() as unknown;
    const parsed = standupFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { mood, finished, today, blocker, teamCode } = parsed.data;

    const membership = await assertTeamMember(user.id, teamCode);
    if (!membership) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    const { member } = membership;
    const db = await createServerClient();
    const date = getPHTDateString();

    const { data: existing } = await db
      .from('standups')
      .select('id')
      .eq('member_id', member.id)
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You have already submitted your standup today' },
        { status: 409 }
      );
    }

    const { data: standup, error } = await db
      .from('standups')
      .insert({
        team_id: membership.team.id,
        member_id: member.id,
        member_name: member.name,
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
      { success: true, data: standup as IStandup },
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
