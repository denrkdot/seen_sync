'use client';
import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockerCard } from '@/components/standup/BlockerCard';
import { useBlockers } from '@/hooks/useBlockers';
import { useTeamMember } from '@/hooks/useTeamMember';

export default function BlockersPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';
  const { blockers, isLoading, error } = useBlockers(code);
  const { member } = useTeamMember(code);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 pb-safe">
      <h1 className="text-xl font-semibold tracking-tight text-ink mb-1">Blockers</h1>
      <p className="text-sm text-ink-muted mb-6">Last 7 days</p>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-surface-border shadow-sm">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <EmptyState message="Couldn't load blockers." subMessage={error} />
      )}

      {/* Empty */}
      {!isLoading && !error && blockers.length === 0 && (
        <EmptyState
          message="No blockers in the last 7 days."
          subMessage="That's a good sign! 🎉"
        />
      )}

      {/* Blocker cards */}
      {!isLoading && blockers.length > 0 && (
        <div className="space-y-4">
          {blockers.map(blocker => (
            <BlockerCard
              key={blocker.id}
              blocker={blocker}
              currentMemberId={member?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
