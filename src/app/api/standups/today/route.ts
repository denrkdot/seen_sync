import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/standup';
import type { IMember } from '@/types/team';

export async function GET(req: NextRequest) {
  try {
    const teamCode = req.nextUrl.searchParams.get('teamCode');
    if (!teamCode) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode is required' },
        { status: 400 }
      );
    }
    const db = createServerClient();

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

    const date = getPHTDateString();

    const [{ data: members }, { data: standups }] = await Promise.all([
      db.from('members').select('*').eq('team_id', team.id).order('joined_at'),
      db.from('standups').select('*').eq('team_id', team.id).eq('date', date).order('created_at'),
    ]);

    const submittedIds = new Set((standups ?? []).map(s => s.member_id));
    const pending: IMember[] = (members ?? []).filter(m => !submittedIds.has(m.id));

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
