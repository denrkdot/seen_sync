'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standupId: string;
  teamCode: string;
  memberName: string;
  onSuccess: () => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  standupId,
  teamCode,
  memberName,
  onSuccess,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/standups/${standupId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (!json.success) {
        toast.error(json.error ?? 'Failed to delete standup');
        return;
      }
      toast.success('Entry deleted.');
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          'bg-white border border-surface-border',
          'rounded-2xl shadow-md max-w-sm'
        )}
      >
        <AlertDialogHeader>
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-50 mb-3">
            <Trash2 size={18} className="text-red-800" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-base font-semibold tracking-tight text-ink">
            Delete your entry?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-ink-muted leading-relaxed">
            This will remove{' '}
            <span className="font-medium text-ink">{memberName}&apos;s</span>{' '}
            standup entry for today. You can check in again after deleting.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 mt-2">
          <AlertDialogCancel
            id="delete-standup-cancel"
            className={cn(
              'bg-transparent border border-surface-border text-ink',
              'px-4 py-2 rounded-xl text-sm font-medium',
              'hover:bg-surface-hover transition-colors duration-150 min-h-[40px]'
            )}
          >
            Keep it
          </AlertDialogCancel>
          <AlertDialogAction
            id="delete-standup-confirm"
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              'bg-red-800 hover:bg-red-900 text-white',
              'px-4 py-2 rounded-xl text-sm font-semibold',
              'transition-colors duration-150 min-h-[40px]',
              'focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isDeleting ? 'Deleting…' : 'Delete entry'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
