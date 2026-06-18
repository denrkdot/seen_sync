import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getSessionUser, assertTeamMember } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: blockers, error } = await db
      .from('standups')
      .select('*')
      .eq('team_id', membership.team.id)
      .not('blocker', 'is', null)
      .neq('blocker', '')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to fetch blockers' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup[]>>({
      success: true,
      data: (blockers ?? []) as IStandup[],
    });
  } catch (err) {
    console.error('[GET /api/standups/blockers]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
