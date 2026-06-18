import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { joinTeamSchema } from '@/validators/team.schema';
import { getSessionUser } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { IMember } from '@/types/team';

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
    const parsed = joinTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { code, memberName } = parsed.data;
    const db = await createServerClient();

    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found. Check your team code.' },
        { status: 404 }
      );
    }

    const { data: existing } = await db
      .from('members')
      .select('id')
      .eq('team_id', team.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "You're already on this team" },
        { status: 409 }
      );
    }

    const { data: member, error } = await db
      .from('members')
      .insert({ team_id: team.id, name: memberName, user_id: user.id })
      .select()
      .single();

    if (error || !member) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to join team' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IMember>>(
      { success: true, data: member as IMember },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/members]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
