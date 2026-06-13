'use client';
import useSWR from 'swr';
import type { IStandup } from '@/types/standup';
import type { ApiResponse } from '@/types/api';

const fetcher = (url: string) => fetch(url).then(r => r.json()) as Promise<ApiResponse<IStandup[]>>;

export function useBlockers(teamCode: string | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<IStandup[]>>(
    teamCode ? `/api/standups/blockers?teamCode=${teamCode}` : null,
    fetcher
  );
  return {
    blockers: data?.success ? data.data : [],
    error: data?.success === false ? data.error : error?.message,
    isLoading,
  };
}
