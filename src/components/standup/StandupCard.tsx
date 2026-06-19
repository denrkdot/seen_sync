'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodBadge } from './MoodBadge';
import { BlockerBadge } from './BlockerBadge';
import { StandupMenu } from './StandupMenu';
import { EditStandupDialog } from './EditStandupDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { MOOD_TINTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { IStandup } from '@/types/standup';

interface StandupSection {
  label: string;
  content: string;
}

function Section({ label, content }: StandupSection) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">{content}</p>
    </div>
  );
}

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

  const moodTint = standup.mood
    ? (MOOD_TINTS[standup.mood] ?? 'border-l-surface-border')
    : 'border-l-surface-border';

  const isOwner = !!currentMemberId && currentMemberId === standup.member_id;
  const canEdit = isOwner && !!teamCode;

  return (
    <>
      <article
        className={cn(
          'bg-white rounded-2xl p-5 border border-surface-border',
          'shadow-sm hover:shadow-md transition-shadow duration-200',
          'border-l-4',
          moodTint
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MoodBadge mood={standup.mood} />
            <span className="text-base font-semibold text-ink truncate">
              {standup.member_name}
            </span>
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
        <div className="space-y-3">
          <Section label="Finished" content={standup.finished} />
          <Section label="Today" content={standup.today} />
          {standup.blocker && (
            <div className="pt-2 border-t border-blocker-border">
              <BlockerBadge />
              <p className="text-sm text-blocker mt-1 leading-relaxed">{standup.blocker}</p>
            </div>
          )}
        </div>

        {/* Owned indicator — subtle brand accent strip at bottom */}
        {isOwner && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="mt-4 h-0.5 rounded-full bg-brand/20 origin-left"
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
