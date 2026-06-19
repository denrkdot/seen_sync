'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoodPicker } from './MoodPicker';
import { standupFormSchema, type StandupFormInput } from '@/validators/standup.schema';
import { cn } from '@/lib/utils';
import type { IStandup } from '@/types/standup';

interface EditStandupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standup: IStandup;
  teamCode: string;
  onSuccess: (updated: IStandup) => void;
}

export function EditStandupDialog({
  open,
  onOpenChange,
  standup,
  teamCode,
  onSuccess,
}: EditStandupDialogProps) {
  const [mood, setMood] = useState<string | undefined>(standup.mood ?? undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StandupFormInput>({
    resolver: zodResolver(standupFormSchema),
    defaultValues: {
      teamCode,
      finished: standup.finished,
      today: standup.today,
      blocker: standup.blocker ?? '',
    },
  });

  // Reset form when standup data changes (e.g., dialog reopened)
  useEffect(() => {
    if (open) {
      reset({
        teamCode,
        finished: standup.finished,
        today: standup.today,
        blocker: standup.blocker ?? '',
      });
      setMood(standup.mood ?? undefined);
    }
  }, [open, standup, teamCode, reset]);

  const onSubmit = async (data: StandupFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/standups/${standup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mood }),
      });
      const json = await res.json() as { success: boolean; data?: IStandup; error?: string };
      if (!json.success) {
        toast.error(json.error ?? 'Failed to update standup');
        return;
      }
      toast.success('Entry updated.');
      onOpenChange(false);
      if (json.data) onSuccess(json.data);
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="sheet"
        className={cn(
          'w-full max-w-lg mx-auto p-6',
          'bg-white border border-surface-border shadow-md',
          'max-h-[90vh] overflow-y-auto'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Edit your entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <input type="hidden" {...register('teamCode')} />

          <MoodPicker selected={mood} onSelect={setMood} />

          <Separator />

          <div className="space-y-1.5">
            <label
              htmlFor="edit-standup-finished"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              What did you finish?
            </label>
            <textarea
              id="edit-standup-finished"
              {...register('finished')}
              className={cn(
                'w-full border border-surface-border rounded-xl',
                'px-4 py-3 text-base text-ink bg-white',
                'placeholder:text-ink-faint',
                'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
                'transition-colors duration-150',
                'min-h-[88px] resize-none leading-relaxed',
                errors.finished && 'border-blocker'
              )}
            />
            {errors.finished && (
              <p className="text-xs text-blocker">{errors.finished.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-standup-today"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              What are you working on today?
            </label>
            <textarea
              id="edit-standup-today"
              {...register('today')}
              className={cn(
                'w-full border border-surface-border rounded-xl',
                'px-4 py-3 text-base text-ink bg-white',
                'placeholder:text-ink-faint',
                'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
                'transition-colors duration-150',
                'min-h-[88px] resize-none leading-relaxed',
                errors.today && 'border-blocker'
              )}
            />
            {errors.today && (
              <p className="text-xs text-blocker">{errors.today.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-standup-blocker"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              Anything blocking you?{' '}
              <span className="normal-case font-normal text-ink-faint">(optional)</span>
            </label>
            <textarea
              id="edit-standup-blocker"
              {...register('blocker')}
              className={cn(
                'w-full border border-surface-border rounded-xl',
                'px-4 py-3 text-base text-ink bg-white',
                'placeholder:text-ink-faint',
                'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
                'transition-colors duration-150',
                'min-h-[88px] resize-none leading-relaxed'
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            id="edit-standup-submit"
            className="w-full bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
