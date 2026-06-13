'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoodBadge } from '@/components/standup/MoodBadge';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockers } from '@/hooks/useBlockers';
import { cn } from '@/lib/utils';

export default function BlockersPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';
  const { blockers, isLoading, error } = useBlockers(code);

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
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 bg-white text-ink shadow-sm"
            aria-current="page"
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

        <h1 className="text-xl font-semibold tracking-tight text-ink mb-2">Blockers</h1>
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
              <article
                key={blocker.id}
                className="bg-white rounded-2xl p-5 border border-blocker-border shadow-sm border-l-4 border-l-blocker"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5',
                      'bg-blocker-light text-blocker text-xs font-semibold',
                      'rounded-full border border-blocker-border uppercase tracking-wide'
                    )}>
                      <AlertTriangle size={10} aria-hidden="true" />
                      Blocker
                    </span>
                    <MoodBadge mood={blocker.mood} />
                    <span className="text-sm font-semibold text-ink">{blocker.member_name}</span>
                  </div>
                  <RelativeTime date={blocker.created_at} />
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{blocker.blocker}</p>
              </article>
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
