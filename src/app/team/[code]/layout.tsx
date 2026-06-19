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
      {/* Navbar only — pure, no extra content */}
      <Header />

      {/* Team hero (name + code + date) — part of page content, not navbar */}
      <TeamHero
        teamName={teamName}
        teamCode={code}
        dateLabel={todayLabel}
      />

      {/* Tab navigation — sits directly below hero in the content flow */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <TeamNav code={code} />
      </div>

      {/* Animated page content — only children animate on tab change */}
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
