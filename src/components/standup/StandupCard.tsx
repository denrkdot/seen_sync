'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { MoodBadge } from './MoodBadge';
import { StandupMenu } from './StandupMenu';
import { EditStandupDialog } from './EditStandupDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { cn } from '@/lib/utils';
import type { IStandup } from '@/types/standup';

interface StandupSection {
  label: string;
  content: string;
}

function Section({ label, content }: StandupSection) {
  return (
    <div className="space-y-0.5 relative z-10">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">{content}</p>
    </div>
  );
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

interface StandupCardProps {
  standup: IStandup;
  currentMemberId?: string;
  teamCode?: string;
  onUpdated?: (updated: IStandup) => void;
  onDeleted?: (id: string) => void;
}

export function StandupCard({
  standup,
  currentMemberId,
  teamCode,
  onUpdated,
  onDeleted,
}: StandupCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = !!currentMemberId && currentMemberId === standup.member_id;
  const canEdit = isOwner && !!teamCode;
  const initials = getInitials(standup.member_name);
  const firstLetter = standup.member_name.trim().charAt(0).toUpperCase() || '◈';

  const mood = standup.mood;
  const avatarStyle = mood
    ? (avatarMoodStyles[mood] ?? { bg: 'bg-zinc-100', border: 'border-zinc-200/60', text: 'text-zinc-500' })
    : (isOwner ? { bg: 'bg-brand-light', border: 'border-brand-subtle', text: 'text-brand' } : { bg: 'bg-zinc-100', border: 'border-zinc-200/60', text: 'text-zinc-500' });

  return (
    <>
      <article
        className={cn(
          'w-full text-left bg-white/70 backdrop-blur-[2px] border border-surface-border rounded-2xl p-5 min-h-[160px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-md',
          isOwner ? 'hover:border-brand/40 hover:shadow-brand/[0.01]' : 'hover:border-zinc-300'
        )}
      >
        {/* Background Watermark Initial */}
        <span
          className={cn(
            'absolute -right-3 -bottom-8 text-[120px] font-black select-none pointer-events-none leading-none font-sans transition-all duration-500 group-hover:scale-115 group-hover:-rotate-3',
            isOwner
              ? 'text-brand/[0.03] group-hover:text-brand/[0.06]'
              : 'text-zinc-100/50 group-hover:text-zinc-200/40'
          )}
          aria-hidden="true"
        >
          {firstLetter}
        </span>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2 relative z-20 w-full">
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
              {standup.mood && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-lg shadow-sm border border-surface-border w-5.5 h-5.5 flex items-center justify-center text-xs select-none">
                  <MoodBadge mood={standup.mood} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="text-sm font-semibold text-ink truncate block leading-tight">
                {standup.member_name}
              </span>
              {isOwner ? (
                <span className="text-[10px] font-semibold text-brand uppercase tracking-wider block mt-0.5">
                  You
                </span>
              ) : (
                <span className="text-[10px] text-ink-muted block mt-0.5">
                  Checked in
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <RelativeTime date={standup.created_at} />
            {canEdit && (
              <StandupMenu
                onEdit={() => setEditOpen(true)}
                onDelete={() => setDeleteOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 relative z-10 w-full flex-grow mb-3">
          <Section label="Finished" content={standup.finished} />
          <Section label="Today" content={standup.today} />
          {standup.blocker && (
            <div className="mt-3 p-3 bg-zinc-50/70 border border-zinc-200/50 rounded-xl flex items-start gap-2.5 relative z-10">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 border border-zinc-200/40 flex items-center justify-center shrink-0">
                <AlertTriangle size={13} className="text-zinc-500" aria-hidden="true" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                  Blocker
                </p>
                <p className="text-xs text-ink-soft leading-relaxed font-medium">
                  {standup.blocker}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Owned indicator — subtle brand accent strip at bottom */}
        {isOwner && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="mt-1 h-0.5 rounded-full bg-brand/20 origin-left relative z-10"
            aria-hidden="true"
          />
        )}
      </article>

      {/* Dialogs — rendered outside the article to avoid nesting issues */}
      {canEdit && (
        <>
          <EditStandupDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            standup={standup}
            teamCode={teamCode}
            onSuccess={(updated) => {
              setEditOpen(false);
              onUpdated?.(updated);
            }}
          />
          <ConfirmDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            standupId={standup.id}
            teamCode={teamCode}
            memberName={standup.member_name}
            onSuccess={() => {
              setDeleteOpen(false);
              onDeleted?.(standup.id);
            }}
          />
        </>
      )}
    </>
  );
}

