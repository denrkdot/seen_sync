import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function GET(req: NextRequest) {
  try {
    const teamCode = req.nextUrl.searchParams.get('teamCode');
    const date = req.nextUrl.searchParams.get('date');
    if (!teamCode || !date) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode and date are required' },
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

    const { data: standups, error } = await db
      .from('standups')
      .select('*')
      .eq('team_id', team.id)
      .eq('date', date)
      .order('created_at');

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to fetch history' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup[]>>({
      success: true,
      data: standups ?? [],
    });
  } catch (err) {
    console.error('[GET /api/standups/history]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
