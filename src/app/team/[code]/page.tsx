'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { BoardGrid } from '@/components/standup/BoardGrid';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { StandupForm } from '@/components/standup/StandupForm';
import { useTeamBoard } from '@/hooks/useTeamBoard';
import { useTeamMember } from '@/hooks/useTeamMember';
import { formatDateLabel, getPHTDateString } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function TeamBoardPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';
  const { board, isLoading, error, refresh } = useTeamBoard(code);
  const { member, isLoading: memberLoading } = useTeamMember(code);
  const [formOpen, setFormOpen] = useState(false);

  const hasSubmitted = member
    ? board?.submitted.some(s => s.member_id === member.id) ?? false
    : false;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-safe">
      {board && (
        <p className="text-xs text-ink-muted mb-4">
          {formatDateLabel(board.date)} · {board.submitted.length} checked in
          {board.pending.length > 0 && `, ${board.pending.length} pending`}
        </p>
      )}

      {member && !hasSubmitted && !isLoading && !memberLoading && (
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

      {isLoading && <LoadingGrid />}
      {error && !isLoading && (
        <EmptyState
          message="Couldn't load the board."
          subMessage={error}
        />
      )}
      {board && !isLoading && (
        <BoardGrid
          board={board}
          currentMemberId={member?.id}
          teamCode={code}
          onRefresh={() => void refresh()}
        />
      )}

      {member && (
        <StandupForm
          open={formOpen}
          onOpenChange={setFormOpen}
          teamCode={code}
          onSuccess={() => void refresh()}
        />
      )}
    </div>
  );
}
