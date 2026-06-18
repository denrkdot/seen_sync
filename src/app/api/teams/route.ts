import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateTeamCode } from '@/lib/utils';
import { createTeamSchema } from '@/validators/team.schema';
import { getSessionUser } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { ITeam, IMember } from '@/types/team';

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
    const parsed = createTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { teamName, memberName } = parsed.data;
    const db = await createServerClient();

    let code = generateTeamCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data } = await db.from('teams').select('id').eq('code', code).maybeSingle();
      if (!data) break;
      code = generateTeamCode();
      attempts++;
    }

    const { data: team, error: teamErr } = await db
      .from('teams')
      .insert({ name: teamName, code })
      .select()
      .single();

    if (teamErr || !team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to create team' },
        { status: 500 }
      );
    }

    const { data: member, error: memberErr } = await db
      .from('members')
      .insert({ team_id: team.id, name: memberName, user_id: user.id })
      .select()
      .single();

    if (memberErr || !member) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to create member' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ team: ITeam; member: IMember }>>(
      { success: true, data: { team: team as ITeam, member: member as IMember } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/teams]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
