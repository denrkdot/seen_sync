'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import type { ApiResponse } from '@/types/api';
import type { IMember } from '@/types/team';

const fetcher = (url: string) =>
  fetch(url).then(r => r.json()) as Promise<ApiResponse<IMember>>;

export function useTeamMember(teamCode: string) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<IMember>>(
    teamCode ? `/api/teams/${teamCode}/member` : null,
    fetcher
  );

  useEffect(() => {
    if (data && !data.success && data.error?.includes('not a member')) {
      router.push('/dashboard?error=not-member');
    }
  }, [data, router]);

  const member = data?.success ? data.data : null;

  return { member, isLoading, error: error ?? (!data?.success ? data?.error : null), refresh: mutate };
}
