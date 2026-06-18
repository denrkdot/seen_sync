'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { BoardGrid } from '@/components/standup/BoardGrid';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateLabel, getPHTDateList, cn } from '@/lib/utils';
import { HISTORY_DAYS } from '@/lib/constants';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';
import type { IMember } from '@/types/team';

const fetcher = (url: string) => fetch(url).then(r => r.json()) as Promise<ApiResponse<IStandup[]>>;

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

  // Build a mock BoardData with no pending (history doesn't have member list)
  const boardData = {
    submitted: standups,
    pending: [] as IMember[],
    date: selectedDate,
  };

  return (
    <div className="dot-grid min-h-screen">
      <Header teamCode={code} />

      <PageWrapper>
        {/* Pill navigation */}
        <nav className="flex gap-2 p-1 bg-surface-subtle rounded-xl w-fit mb-6" aria-label="Team navigation">
          <Link
            href={`/team/${code}`}
            id="nav-board"
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 text-ink-muted hover:text-ink"
          >
            Board
          </Link>
          <Link
            href={`/team/${code}/blockers`}
            id="nav-blockers"
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 text-ink-muted hover:text-ink"
          >
            Blockers
          </Link>
          <Link
            href={`/team/${code}/history`}
            id="nav-history"
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 bg-white text-ink shadow-sm"
            aria-current="page"
          >
            History
          </Link>
        </nav>

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
      </PageWrapper>
    </div>
  );
}
