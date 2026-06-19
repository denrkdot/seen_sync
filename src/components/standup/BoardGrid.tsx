'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { StandupCard } from './StandupCard';
import { PendingCard } from './PendingCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { BoardData } from '@/types/standup';
import type { IStandup } from '@/types/standup';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

interface BoardGridProps {
  board: BoardData;
  currentMemberId?: string;
  teamCode?: string;
  onRefresh?: () => void;
  onCheckIn?: () => void;
}

export function BoardGrid({ board, currentMemberId, teamCode, onRefresh, onCheckIn }: BoardGridProps) {
  const prefersReduced = useReducedMotion();
  const [localSubmitted, setLocalSubmitted] = useState<IStandup[]>(board.submitted);

  // Sync local state when SWR refreshes the board (e.g., after a new member checks in)
  useEffect(() => {
    setLocalSubmitted(board.submitted);
  }, [board.submitted]);

  const handleUpdated = useCallback((updated: IStandup) => {
    setLocalSubmitted(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setLocalSubmitted(prev => prev.filter(s => s.id !== id));
    onRefresh?.();
  }, [onRefresh]);

  const isEmpty = localSubmitted.length === 0 && board.pending.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        message="No standups yet today."
        subMessage="Be the first to check in!"
      />
    );
  }

  const containerV = prefersReduced ? {} : containerVariants;
  const itemV = prefersReduced ? {} : itemVariants;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerV}
      initial="hidden"
      animate="show"
    >
      {localSubmitted.map(standup => (
        <motion.div key={standup.id} variants={itemV}>
          <StandupCard
            standup={standup}
            currentMemberId={currentMemberId}
            teamCode={teamCode}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        </motion.div>
      ))}
      {board.pending.map(member => (
        <motion.div key={member.id} variants={itemV}>
          <PendingCard
            member={member}
            currentMemberId={currentMemberId}
            onCheckIn={onCheckIn}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
