'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { BoardGrid } from '@/components/standup/BoardGrid';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateLabel, getPHTDateList } from '@/lib/utils';
import { HISTORY_DAYS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';
import type { IMember } from '@/types/team';

const fetcher = (url: string) =>
  fetch(url).then(r => r.json()) as Promise<ApiResponse<IStandup[]>>;

export default function HistoryPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';
  const dates = getPHTDateList(HISTORY_DAYS);
  const [selectedDate, setSelectedDate] = useState(dates[1] ?? dates[0]); // default to yesterday

  const { data, isLoading, error } = useSWR<ApiResponse<IStandup[]>>(
    code && selectedDate
      ? `/api/standups/history?teamCode=${code}&date=${selectedDate}`
      : null,
    fetcher
  );

  const standups: IStandup[] = data?.success ? data.data : [];

  // Build a mock BoardData with no pending (history doesn't track pending)
  const boardData = {
    submitted: standups,
    pending: [] as IMember[],
    date: selectedDate,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 pb-safe">
      <h1 className="text-xl font-semibold tracking-tight text-ink mb-4">Past standups</h1>

      {/* Date selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {dates.slice(1).map(date => (
          <button
            key={date}
            id={`date-${date}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 min-h-[36px]',
              selectedDate === date
                ? 'bg-brand text-white'
                : 'bg-white border border-surface-border text-ink-muted hover:text-ink'
            )}
          >
            {formatDateLabel(date)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && <LoadingGrid />}
      {error && !isLoading && (
        <EmptyState message="Couldn't load history." subMessage={String(error)} />
      )}
      {!isLoading && !error && data?.success === false && (
        <EmptyState message="Couldn't load history." subMessage={data.error} />
      )}
      {!isLoading && standups.length === 0 && data?.success && (
        <EmptyState
          message={`No standups on ${formatDateLabel(selectedDate)}.`}
          subMessage="The team was quiet that day."
        />
      )}
      {!isLoading && standups.length > 0 && (
        <BoardGrid board={boardData} />
      )}
    </div>
  );
}
