'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { StandupCard } from './StandupCard';
import { PendingCard } from './PendingCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { BoardData } from '@/types/standup';

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
}

export function BoardGrid({ board }: BoardGridProps) {
  const prefersReduced = useReducedMotion();
  const { submitted, pending } = board;
  const isEmpty = submitted.length === 0 && pending.length === 0;

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
      {submitted.map(standup => (
        <motion.div key={standup.id} variants={itemV}>
          <StandupCard standup={standup} />
        </motion.div>
      ))}
      {pending.map(member => (
        <motion.div key={member.id} variants={itemV}>
          <PendingCard member={member} />
        </motion.div>
      ))}
    </motion.div>
  );
}
