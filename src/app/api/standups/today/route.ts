import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getPHTDateString } from '@/lib/utils';
import { getSessionUser, assertTeamMember } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/standup';
import type { IMember } from '@/types/team';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const teamCode = req.nextUrl.searchParams.get('teamCode');
    if (!teamCode) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode is required' },
        { status: 400 }
      );
    }

    const membership = await assertTeamMember(user.id, teamCode);
    if (!membership) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    const db = await createServerClient();
    const date = getPHTDateString();

    const [{ data: members }, { data: standups }] = await Promise.all([
      db.from('members').select('*').eq('team_id', membership.team.id).order('joined_at'),
      db.from('standups').select('*').eq('team_id', membership.team.id).eq('date', date).order('created_at'),
    ]);

    const submittedIds = new Set((standups ?? []).map(s => s.member_id));
    const pending: IMember[] = (members ?? []).filter(m => !submittedIds.has(m.id)) as IMember[];

    return NextResponse.json<ApiResponse<BoardData>>({
      success: true,
      data: {
        submitted: standups ?? [],
        pending,
        date,
      },
    });
  } catch (err) {
    console.error('[GET /api/standups/today]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
