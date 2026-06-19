'use client';
import { useRef, useEffect, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StandupMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function StandupMenu({ onEdit, onDelete }: StandupMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        id="standup-menu-trigger"
        aria-label="Entry options"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
          open
            ? 'bg-surface-subtle text-ink'
            : 'text-ink-faint hover:text-ink-muted hover:bg-surface-subtle'
        )}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Entry options"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={cn(
              'absolute right-0 top-8 z-50 w-44',
              'bg-white rounded-xl border border-surface-border shadow-md',
              'overflow-hidden origin-top-right'
            )}
          >
            <button
              role="menuitem"
              type="button"
              id="standup-menu-edit"
              onClick={() => { setOpen(false); onEdit(); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5',
                'text-sm text-ink-soft font-medium text-left',
                'hover:bg-surface-subtle transition-colors duration-100',
                'focus-visible:outline-none focus-visible:bg-surface-subtle'
              )}
            >
              <Pencil size={13} className="text-ink-muted shrink-0" aria-hidden="true" />
              Edit entry
            </button>

            <div className="mx-3 h-px bg-surface-border" aria-hidden="true" />

            <button
              role="menuitem"
              type="button"
              id="standup-menu-delete"
              onClick={() => { setOpen(false); onDelete(); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5',
                'text-sm text-blocker font-medium text-left',
                'hover:bg-blocker-light transition-colors duration-100',
                'focus-visible:outline-none focus-visible:bg-blocker-light'
              )}
            >
              <Trash2 size={13} className="shrink-0" aria-hidden="true" />
              Delete entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
