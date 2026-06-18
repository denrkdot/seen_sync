import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, assertTeamMember } from '@/lib/auth';
import type { ApiResponse } from '@/types/api';
import type { IMember } from '@/types/team';

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await assertTeamMember(user.id, params.code);
    if (!result) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    return NextResponse.json<ApiResponse<IMember>>({
      success: true,
      data: result.member,
    });
  } catch (err) {
    console.error('[GET /api/teams/:code/member]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
