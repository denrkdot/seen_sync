'use client';
import useSWR from 'swr';
import { POLL_INTERVAL } from '@/lib/constants';
import type { BoardData } from '@/types/standup';
import type { ApiResponse } from '@/types/api';

const fetcher = (url: string) => fetch(url).then(r => r.json()) as Promise<ApiResponse<BoardData>>;

export function useTeamBoard(teamCode: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<BoardData>>(
    teamCode ? `/api/standups/today?teamCode=${teamCode}` : null,
    fetcher,
    { refreshInterval: POLL_INTERVAL }
  );
  return {
    board: data?.success ? data.data : null,
    error: data?.success === false ? data.error : error?.message,
    isLoading,
    refresh: mutate,
  };
}
