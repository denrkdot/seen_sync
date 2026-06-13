import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import type { ITeamWithMembers } from '@/types/team';

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const db = createServerClient();
    const { data: team, error } = await db
      .from('teams')
      .select('*, members(*)')
      .eq('code', params.code.toUpperCase())
      .single();

    if (error || !team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ITeamWithMembers>>({
      success: true,
      data: team as ITeamWithMembers,
    });
  } catch (err) {
    console.error('[GET /api/teams/:code]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
