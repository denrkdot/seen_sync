'use client';
import { useParams, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { TeamHero } from '@/components/team/TeamHero';
import { TeamNav } from '@/components/team/TeamNav';
import { formatDateLabel, getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { ITeam } from '@/types/team';

const teamFetcher = (url: string) =>
  fetch(url).then(r => r.json()) as Promise<ApiResponse<ITeam>>;

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const code = typeof params.code === 'string' ? params.code.toUpperCase() : '';

  const { data: teamData } = useSWR<ApiResponse<ITeam>>(
    code ? `/api/teams/${code}` : null,
    teamFetcher,
    { revalidateOnFocus: false }
  );

  const teamName = teamData?.success ? teamData.data.name : undefined;
  const todayLabel = formatDateLabel(getPHTDateString());

  return (
    <div className="dot-grid min-h-screen">
      {/* Persistent header — never unmounts on tab switch */}
      <Header />

      {/* Persistent team hero — team name + code */}
      <TeamHero
        teamName={teamName}
        teamCode={code}
        dateLabel={todayLabel}
      />

      {/* Persistent pill navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-surface-border sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <TeamNav code={code} />
        </div>
      </div>

      {/* Animated page content — fades/slides on tab change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
