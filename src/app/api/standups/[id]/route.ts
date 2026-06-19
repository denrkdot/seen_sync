import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getSessionUser, getMemberForTeam } from '@/lib/auth';
import { getPHTDateString } from '@/lib/utils';
import { updateStandupSchema } from '@/validators/standup.schema';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

// PATCH /api/standups/[id] — edit today's standup
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json() as unknown;
    const parsed = updateStandupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { mood, finished, today, blocker, teamCode } = parsed.data;
    const db = await createServerClient();

    // Fetch the standup to verify ownership
    const { data: standup, error: fetchErr } = await db
      .from('standups')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !standup) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Standup not found' },
        { status: 404 }
      );
    }

    // Verify the user is a member of this team and owns this standup
    const membership = await getMemberForTeam(user.id, teamCode);
    if (!membership || membership.member.id !== standup.member_id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You can only edit your own standup' },
        { status: 403 }
      );
    }

    // Only allow editing today's standup
    const today_date = getPHTDateString();
    if (standup.date !== today_date) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You can only edit today\'s standup' },
        { status: 403 }
      );
    }

    const { data: updated, error: updateErr } = await db
      .from('standups')
      .update({
        mood: mood ?? null,
        finished,
        today,
        blocker: blocker || null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateErr || !updated) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to update standup' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup>>({
      success: true,
      data: updated as IStandup,
    });
  } catch (err) {
    console.error('[PATCH /api/standups/:id]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/standups/[id] — delete today's standup
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json() as unknown;
    const { teamCode } = (body as { teamCode?: string }) ?? {};
    if (!teamCode || typeof teamCode !== 'string') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode is required' },
        { status: 400 }
      );
    }

    const db = await createServerClient();

    // Fetch standup to verify ownership
    const { data: standup, error: fetchErr } = await db
      .from('standups')
      .select('member_id, date')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !standup) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Standup not found' },
        { status: 404 }
      );
    }

    // Verify membership and ownership
    const membership = await getMemberForTeam(user.id, teamCode);
    if (!membership || membership.member.id !== standup.member_id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You can only delete your own standup' },
        { status: 403 }
      );
    }

    // Only allow deleting today's standup
    const today_date = getPHTDateString();
    if (standup.date !== today_date) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You can only delete today\'s standup' },
        { status: 403 }
      );
    }

    const { error: deleteErr } = await db
      .from('standups')
      .delete()
      .eq('id', params.id);

    if (deleteErr) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to delete standup' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (err) {
    console.error('[DELETE /api/standups/:id]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
