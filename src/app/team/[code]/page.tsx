'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { BoardGrid } from '@/components/standup/BoardGrid';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { StandupForm } from '@/components/standup/StandupForm';
import { useTeamBoard } from '@/hooks/useTeamBoard';
import { useMember } from '@/hooks/useMember';
import { formatDateLabel, cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { ITeam } from '@/types/team';

export default function TeamBoardPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';
  const { board, isLoading, error, refresh } = useTeamBoard(code);
  const { member } = useMember();
  const [formOpen, setFormOpen] = useState(false);

  // Check if current member has already submitted today
  const hasSubmitted = member
    ? board?.submitted.some(s => s.member_id === member.id) ?? false
    : false;

  // Fetch team name for the header
  const { data: teamData } = useSWR<ApiResponse<ITeam>>(
    code ? `/api/teams/${code}` : null,
    (url: string) => fetch(url).then(r => r.json()) as Promise<ApiResponse<ITeam>>
  );
  const teamName = teamData?.success ? teamData.data.name : undefined;

  return (
    <div className="dot-grid min-h-screen">
      <Header teamCode={code} teamName={teamName || undefined} />

      <PageWrapper>
        {/* Pill navigation */}
        <nav className="flex gap-2 p-1 bg-surface-subtle rounded-xl w-fit mb-6" aria-label="Team navigation">
          <Link
            href={`/team/${code}`}
            id="nav-board"
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 bg-white text-ink shadow-sm"
            aria-current="page"
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
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 text-ink-muted hover:text-ink"
          >
            History
          </Link>
        </nav>

        {/* Date label */}
        {board && (
          <p className="text-xs text-ink-muted mb-4">
            {formatDateLabel(board.date)} · {board.submitted.length} checked in
            {board.pending.length > 0 && `, ${board.pending.length} pending`}
          </p>
        )}

        {/* Check-in CTA */}
        {member && !hasSubmitted && !isLoading && (
          <button
            id="checkin-cta"
            onClick={() => setFormOpen(true)}
            className={cn(
              'w-full sm:w-auto flex items-center gap-2 mb-6',
              'bg-brand hover:bg-brand-dark text-white',
              'px-5 py-3 rounded-xl text-sm font-semibold',
              'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              'transition-colors duration-150 min-h-[44px]'
            )}
          >
            <Plus size={16} aria-hidden="true" />
            Check in today
          </button>
        )}

        {member && hasSubmitted && !isLoading && (
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-success-light text-success rounded-xl text-sm font-medium border border-success/20">
            <span aria-hidden="true">✓</span> You&apos;ve checked in today
          </div>
        )}

        {!member && !isLoading && (
          <div className="mb-6 p-4 bg-brand-light rounded-xl border border-brand/20">
            <p className="text-sm text-ink-soft">
              <Link href="/" className="text-brand font-semibold hover:underline">
                Join this team
              </Link>{' '}
              to submit your standup.
            </p>
          </div>
        )}

        {/* Board content */}
        {isLoading && <LoadingGrid />}
        {error && !isLoading && (
          <EmptyState
            message="Couldn't load the board."
            subMessage={error}
          />
        )}
        {board && !isLoading && <BoardGrid board={board} />}
      </PageWrapper>

      {/* Standup form dialog */}
      {member && (
        <StandupForm
          open={formOpen}
          onOpenChange={setFormOpen}
          memberName={member.name}
          memberId={member.id}
          teamCode={code}
          onSuccess={() => refresh()}
        />
      )}
    </div>
  );
}
