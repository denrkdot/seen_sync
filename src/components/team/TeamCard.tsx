import Link from 'next/link';
import { RelativeTime } from '@/components/shared/RelativeTime';
import type { IUserTeam } from '@/types/team';
import { cn } from '@/lib/utils';
import { Users, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamCardProps {
  userTeam: IUserTeam;
}

export function TeamCard({ userTeam }: TeamCardProps) {
  const { team, member, stats } = userTeam;

  const memberCount = stats?.memberCount ?? 1;
  const todayStandupsCount = stats?.todayStandupsCount ?? 0;
  const activeBlockersCount = stats?.activeBlockersCount ?? 0;
  const todayCheckedIn = stats?.todayCheckedIn ?? [];

  // Generate a stable HSL hue based on the team's name
  const getTeamHue = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
  };
  const hue = getTeamHue(team.name);
  const bgStyle = {
    backgroundColor: `hsl(${hue}, 85%, 97%)`,
    borderColor: `hsl(${hue}, 50%, 85%)`,
    color: `hsl(${hue}, 60%, 40%)`,
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-3xl p-6 border border-surface-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full min-h-[240px]"
    >
      <div className="space-y-4">
        {/* Header: Team Icon + Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              style={bgStyle}
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg border select-none shrink-0"
            >
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-ink leading-tight truncate max-w-[150px] sm:max-w-[180px]">
                {team.name}
              </h2>
              <span className="font-mono text-[10px] font-semibold tracking-wider text-ink-muted uppercase">
                {team.code}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-ink-muted whitespace-nowrap">
            Joined <RelativeTime date={member.joined_at} />
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-border">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-ink-muted mb-0.5">
              <Users size={12} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Members</span>
            </div>
            <span className="text-sm font-extrabold text-ink">{memberCount}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-ink-muted mb-0.5">
              <CheckCircle2 size={12} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Standups</span>
            </div>
            <span className="text-sm font-extrabold text-ink">{todayStandupsCount}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-ink-muted mb-0.5">
              <AlertTriangle
                size={12}
                className={cn(activeBlockersCount > 0 ? 'text-blocker animate-pulse' : 'text-ink-muted')}
              />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Blockers</span>
            </div>
            <span
              className={cn(
                'text-sm font-extrabold',
                activeBlockersCount > 0 ? 'text-blocker' : 'text-ink'
              )}
            >
              {activeBlockersCount}
            </span>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="space-y-1.5 min-h-[44px]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted block">
            Checked in today:
          </span>
          {todayCheckedIn.length === 0 ? (
            <span className="text-[11px] italic text-ink-faint block">
              No updates logged yet today.
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5 items-center">
              {todayCheckedIn.map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-subtle border border-surface-border rounded-lg text-[10px] font-medium text-ink-soft select-none"
                >
                  {item.mood && <span className="text-xs">{item.mood}</span>}
                  <span>{item.memberName.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Link
          href={`/team/${team.code}`}
          className={cn(
            'inline-flex items-center justify-center gap-1.5',
            'w-full bg-brand hover:bg-brand-dark text-white',
            'px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm',
            'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            'transition-colors duration-150 min-h-[44px]'
          )}
        >
          Open board
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
