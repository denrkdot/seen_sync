import { Clock } from 'lucide-react';
import type { IMember } from '@/types/team';
import { cn } from '@/lib/utils';

interface PendingCardProps {
  member: IMember;
  currentMemberId?: string;
  onCheckIn?: () => void;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PendingCard({ member, currentMemberId, onCheckIn }: PendingCardProps) {
  const isSelf = !!currentMemberId && currentMemberId === member.id;
  const initials = getInitials(member.name);
  const firstLetter = member.name.trim().charAt(0).toUpperCase() || '◈';

  const CardWrapper = isSelf ? 'button' : 'article';

  return (
    <CardWrapper
      onClick={isSelf ? onCheckIn : undefined}
      onKeyDown={
        isSelf
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCheckIn?.();
              }
            }
          : undefined
      }
      className={cn(
        'w-full text-left bg-white/70 backdrop-blur-[2px] border border-surface-border rounded-2xl p-5 min-h-[160px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group',
        isSelf
          ? 'cursor-pointer hover:border-brand/40 hover:bg-white hover:shadow-md hover:shadow-brand/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
          : 'hover:border-zinc-300'
      )}
      role={isSelf ? 'button' : undefined}
      tabIndex={isSelf ? 0 : undefined}
      aria-label={isSelf ? `Click to check in as ${member.name}` : undefined}
    >
      {/* Background Watermark Initial */}
      <span
        className={cn(
          'absolute -right-3 -bottom-8 text-[120px] font-black select-none pointer-events-none leading-none font-sans transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3',
          isSelf
            ? 'text-brand/[0.04] group-hover:text-brand/[0.08]'
            : 'text-zinc-100 group-hover:text-zinc-200/50'
        )}
        aria-hidden="true"
      >
        {firstLetter}
      </span>

      {/* Top Section: Avatar and Info */}
      <div className="flex items-start justify-between relative z-10 w-full">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initials Avatar */}
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-colors duration-300',
              isSelf
                ? 'bg-brand-light border-brand-subtle text-brand group-hover:bg-brand/10'
                : 'bg-zinc-100 border-zinc-200/60 text-zinc-500'
            )}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">
              {member.name}
            </p>
            {isSelf && (
              <p className="text-[10px] font-semibold text-brand uppercase tracking-wider">
                You
              </p>
            )}
          </div>
        </div>

        {/* Pulse status indicator badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider shrink-0 transition-colors duration-300',
            isSelf
              ? 'bg-brand-subtle/40 border-brand-subtle/80 text-brand'
              : 'bg-amber-50/50 border-amber-100 text-amber-700'
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                isSelf ? 'bg-brand' : 'bg-amber-400'
              )}
            />
            <span
              className={cn(
                'relative inline-flex rounded-full h-1.5 w-1.5',
                isSelf ? 'bg-brand' : 'bg-amber-500'
              )}
            />
          </span>
          {isSelf ? 'Your turn' : 'Pending'}
        </div>
      </div>

      {/* Bottom Section: Custom visual representation */}
      <div className="relative z-10 w-full mt-4">
        {isSelf ? (
          <div className="space-y-2">
            <div className="space-y-1.5">
              <div className="h-1.5 w-2/3 bg-brand/10 rounded group-hover:bg-brand/20 transition-colors duration-300" />
              <div className="h-1.5 w-5/12 bg-brand/10 rounded group-hover:bg-brand/20 transition-colors duration-300" />
            </div>
            <p className="text-xs text-brand font-medium flex items-center gap-1 pt-1.5 group-hover:text-brand-dark transition-colors duration-300">
              Share what you&apos;re working on today
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="space-y-1.5">
              <div className="h-1.5 w-2/3 bg-zinc-200/60 rounded" />
              <div className="h-1.5 w-5/12 bg-zinc-200/40 rounded" />
            </div>
            <p className="text-xs text-ink-muted flex items-center gap-1.5 pt-1.5">
              <Clock size={12} className="text-ink-faint" />
              Hasn&apos;t checked in yet today
            </p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

