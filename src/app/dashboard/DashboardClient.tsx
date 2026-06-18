'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TeamCard } from '@/components/team/TeamCard';
import { JoinCreateDialog } from '@/components/team/JoinCreateDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingGrid } from '@/components/shared/LoadingGrid';
import { useAuth } from '@/hooks/useAuth';
import type { ApiResponse } from '@/types/api';
import type { IUserTeam } from '@/types/team';

const fetcher = (url: string) =>
  fetch(url).then(r => r.json()) as Promise<ApiResponse<IUserTeam[]>>;

export default function DashboardPage() {
  const { profileName } = useAuth();
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useSWR<ApiResponse<IUserTeam[]>>(
    '/api/users/teams',
    fetcher
  );

  useEffect(() => {
    if (searchParams.get('error') === 'not-member') {
      toast.error("You're not a member of this team");
    }
  }, [searchParams]);

  const teams = data?.success ? data.data : [];

  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />

      <PageWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">Your teams</h1>
            <p className="text-sm text-ink-muted mt-1">
              {profileName ? `Welcome back, ${profileName}.` : 'Pick a team to check in.'}
            </p>
          </div>
          <JoinCreateDialog defaultMemberName={profileName ?? undefined} />
        </div>

        {isLoading && <LoadingGrid />}
        {error && !isLoading && (
          <EmptyState message="Couldn't load your teams." subMessage="Please try again." />
        )}
        {!isLoading && !error && teams.length === 0 && (
          <EmptyState
            message="No teams yet."
            subMessage="Join an existing team or create one to get started."
          />
        )}
        {!isLoading && teams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(userTeam => (
              <TeamCard key={userTeam.team.id} userTeam={userTeam} />
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
