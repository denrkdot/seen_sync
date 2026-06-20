'use client';
import { AlertTriangle } from 'lucide-react';
import { MoodBadge } from './MoodBadge';
import { BlockerBadge } from './BlockerBadge';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { cn } from '@/lib/utils';
import type { IStandup } from '@/types/standup';

interface BlockerCardProps {
  blocker: IStandup;
  currentMemberId?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarMoodStyles: Record<string, { bg: string; border: string; text: string }> = {
  '😊': { bg: 'bg-emerald-50/80', border: 'border-emerald-200/50', text: 'text-emerald-700' },
  '🔥': { bg: 'bg-brand-light', border: 'border-brand-subtle', text: 'text-brand' },
  '😤': { bg: 'bg-red-50/80', border: 'border-red-200/50', text: 'text-red-600' },
  '😴': { bg: 'bg-amber-50/80', border: 'border-amber-200/50', text: 'text-amber-700' },
  '😐': { bg: 'bg-zinc-100', border: 'border-zinc-200/60', text: 'text-zinc-600' },
};

export function BlockerCard({ blocker, currentMemberId }: BlockerCardProps) {
  const isOwner = !!currentMemberId && currentMemberId === blocker.member_id;
  const initials = getInitials(blocker.member_name);
  const mood = blocker.mood;
  const avatarStyle = mood
    ? (avatarMoodStyles[mood] ?? { bg: 'bg-zinc-100', border: 'border-zinc-200/60', text: 'text-zinc-500' })
    : (isOwner ? { bg: 'bg-brand-light', border: 'border-brand-subtle', text: 'text-brand' } : { bg: 'bg-zinc-100', border: 'border-zinc-200/60', text: 'text-zinc-500' });

  return (
    <article
      className={cn(
        'w-full text-left bg-white/70 backdrop-blur-[2px] border rounded-2xl p-5 min-h-[140px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-md',
        isOwner
          ? 'border-brand/20 hover:border-brand/40 hover:shadow-brand/[0.01]'
          : 'border-surface-border hover:border-red-200/80'
      )}
    >
      {/* Background Watermark AlertTriangle */}
      <AlertTriangle
        size={140}
        className="absolute -right-6 -bottom-10 text-red-500/[0.02] group-hover:text-red-500/[0.04] transition-all duration-500 rotate-12 group-hover:rotate-6 group-hover:scale-105 pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2 relative z-10 w-full">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initials Avatar & Mood Bubble Overlay */}
          <div className="relative shrink-0">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-colors duration-300',
                avatarStyle.bg,
                avatarStyle.border,
                avatarStyle.text
              )}
            >
              {initials}
            </div>
            {mood && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-lg shadow-sm border border-surface-border w-5.5 h-5.5 flex items-center justify-center text-xs select-none">
                <MoodBadge mood={mood} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <span className="text-sm font-semibold text-ink truncate block leading-tight">
              {blocker.member_name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isOwner && (
                <span className="text-[10px] font-semibold text-brand uppercase tracking-wider block">
                  You
                </span>
              )}
              {!isOwner && (
                <span className="text-[10px] text-ink-muted block">
                  Team Member
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <BlockerBadge />
          <RelativeTime date={blocker.created_at} />
        </div>
      </div>

      {/* Blocker content */}
      <div className="relative z-10 flex-grow">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500/80 mb-1">
          Blocked on
        </p>
        <p className="text-sm text-ink-soft leading-relaxed font-medium">
          {blocker.blocker}
        </p>
      </div>
    </article>
  );
}
