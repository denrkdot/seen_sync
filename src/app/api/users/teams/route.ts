import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getSessionUser } from '@/lib/auth';
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

    const teams: IUserTeam[] = (members ?? []).map(m => {
      const { teams: team, ...member } = m as typeof m & { teams: IUserTeam['team'] };
      return { team, member: member as IUserTeam['member'] };
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
