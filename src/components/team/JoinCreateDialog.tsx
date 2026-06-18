'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JoinCreateForm } from './JoinCreateForm';
import { cn } from '@/lib/utils';

interface JoinCreateDialogProps {
  defaultMemberName?: string;
}

export function JoinCreateDialog({ defaultMemberName }: JoinCreateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center gap-2',
          'bg-brand hover:bg-brand-dark text-white',
          'px-5 py-2.5 rounded-xl text-sm font-semibold',
          'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          'transition-colors duration-150 min-h-[44px]'
        )}
      >
        <Plus size={16} aria-hidden="true" />
        Join or create team
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent variant="sheet" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Join or create a team
            </DialogTitle>
          </DialogHeader>
          <JoinCreateForm
            defaultMemberName={defaultMemberName}
            compact
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
