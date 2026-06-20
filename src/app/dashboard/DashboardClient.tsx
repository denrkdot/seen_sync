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
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FallingEmojis } from '@/components/shared/FallingEmojis';

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const greeting = getGreeting();

  const prefersReduced = useReducedMotion();

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  const container = prefersReduced ? {} : containerVariants;
  const item = prefersReduced ? {} : itemVariants;

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-subtle dot-grid">
      {/* Drifting blurred brand color blobs in the background */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -15, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-light/30 blur-3xl -z-10 pointer-events-none"
          />
          <motion.div
            animate={{
              x: [0, -15, 20, 0],
              y: [0, 20, -15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-100/40 blur-3xl -z-10 pointer-events-none"
          />
        </>
      )}

      <Header />

      <PageWrapper>
        {/* Welcome Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-white rounded-3xl p-6 md:p-8 border border-surface-border shadow-sm overflow-hidden noise mb-8"
        >
          {/* Falling Emojis Background */}
          <FallingEmojis />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light border border-brand-subtle text-brand text-xs font-semibold select-none">
                <Sparkles size={12} className="text-brand animate-pulse" />
                Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight leading-[1.1]">
                {greeting}, {profileName || 'User'}!
              </h1>
              <p className="text-sm text-ink-soft max-w-xl">
                Here&apos;s how your teams are tracking today. Scroll through your workspaces or join a new one.
              </p>
              
              <div className="pt-2">
                <JoinCreateDialog defaultMemberName={profileName ?? undefined} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content States */}
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
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teams.map(userTeam => (
              <motion.div key={userTeam.team.id} variants={item}>
                <TeamCard userTeam={userTeam} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </PageWrapper>
    </div>
  );
}
