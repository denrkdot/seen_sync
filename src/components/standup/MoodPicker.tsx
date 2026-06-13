'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { MOOD_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodPickerProps {
  selected?: string;
  onSelect: (emoji: string | undefined) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
        How are you coming in today?
      </p>
      <div className="flex gap-2 flex-wrap">
        {MOOD_OPTIONS.map(({ emoji, label }) => (
          <motion.button
            key={emoji}
            type="button"
            id={`mood-${label.toLowerCase()}`}
            aria-label={label}
            aria-pressed={selected === emoji}
            whileTap={prefersReduced ? {} : { scale: 0.9 }}
            animate={prefersReduced ? {} : { scale: selected === emoji ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => onSelect(selected === emoji ? undefined : emoji)}
            className={cn(
              'w-12 h-12 rounded-2xl text-2xl flex items-center justify-center',
              'border-2 transition-colors duration-150 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              selected === emoji
                ? 'border-brand bg-brand-subtle ring-2 ring-brand ring-offset-2'
                : 'border-surface-border bg-surface-subtle hover:border-brand/40'
            )}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
