import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getSessionUser } from '@/lib/auth';
import { getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { IUserTeam } from '@/types/team';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await createServerClient();
    const { data: members, error } = await db
      .from('members')
      .select('*, teams(*)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to fetch teams' },
        { status: 500 }
      );
    }

    const teamIds = (members ?? []).map(m => m.team_id).filter(Boolean);

    const statsMap = new Map<string, {
      memberCount: number;
      todayStandupsCount: number;
      activeBlockersCount: number;
      todayCheckedIn: { memberName: string; mood?: string | null }[];
    }>();

    if (teamIds.length > 0) {
      const todayStr = getPHTDateString();

      // Parallel retrieval of member lists and today's standups for stats
      const [membersResult, standupsResult] = await Promise.all([
        db.from('members').select('id, team_id, name').in('team_id', teamIds),
        db.from('standups').select('id, team_id, member_name, mood, blocker').eq('date', todayStr).in('team_id', teamIds),
      ]);

      for (const teamId of teamIds) {
        statsMap.set(teamId, {
          memberCount: 0,
          todayStandupsCount: 0,
          activeBlockersCount: 0,
          todayCheckedIn: [],
        });
      }

      if (membersResult.data) {
        for (const m of membersResult.data) {
          const stats = statsMap.get(m.team_id);
          if (stats) {
            stats.memberCount += 1;
          }
        }
      }

      if (standupsResult.data) {
        for (const s of standupsResult.data) {
          const stats = statsMap.get(s.team_id);
          if (stats) {
            stats.todayStandupsCount += 1;
            if (s.blocker && s.blocker.trim() !== '') {
              stats.activeBlockersCount += 1;
            }
            stats.todayCheckedIn.push({
              memberName: s.member_name,
              mood: s.mood,
            });
          }
        }
      }
    }

    const teams: IUserTeam[] = (members ?? []).map(m => {
      const { teams: team, ...member } = m as typeof m & { teams: IUserTeam['team'] };
      return {
        team,
        member: member as IUserTeam['member'],
        stats: statsMap.get(team.id),
      };
    });

    return NextResponse.json<ApiResponse<IUserTeam[]>>({
      success: true,
      data: teams,
    });
  } catch (err) {
    console.error('[GET /api/users/teams]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
