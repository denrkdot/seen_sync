'use client';
import { useState } from 'react';
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
import { standupSchema, type StandupFormInput } from '@/validators/standup.schema';
import { cn } from '@/lib/utils';

interface StandupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberId: string;
  teamCode: string;
  onSuccess: () => void;
}

export function StandupForm({
  open,
  onOpenChange,
  memberName,
  memberId,
  teamCode,
  onSuccess,
}: StandupFormProps) {
  const [mood, setMood] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StandupFormInput>({
    resolver: zodResolver(standupSchema),
    defaultValues: { memberName, memberId, teamCode },
  });

  const onSubmit = async (data: StandupFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/standups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mood }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (!json.success) {
        toast.error(json.error ?? 'Something went wrong');
        return;
      }
      toast.success("Standup submitted! Let's go 🎉");
      reset();
      setMood(undefined);
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-full max-w-lg mx-auto p-6',
          'sm:rounded-2xl rounded-t-2xl rounded-b-none',
          'fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2',
          'max-h-[90vh] overflow-y-auto'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Check in for today
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Hidden fields */}
          <input type="hidden" {...register('memberName')} />
          <input type="hidden" {...register('memberId')} />
          <input type="hidden" {...register('teamCode')} />

          {/* Mood picker — always first, always optional */}
          <MoodPicker selected={mood} onSelect={setMood} />

          <Separator />

          {/* Finished */}
          <div className="space-y-1.5">
            <label
              htmlFor="standup-finished"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              What did you finish?
            </label>
            <textarea
              id="standup-finished"
              placeholder="Reviewed the design mockups, merged the auth PR..."
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

          {/* Today */}
          <div className="space-y-1.5">
            <label
              htmlFor="standup-today"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              What are you working on today?
            </label>
            <textarea
              id="standup-today"
              placeholder="Starting the onboarding flow, writing docs..."
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

          {/* Blocker — optional */}
          <div className="space-y-1.5">
            <label
              htmlFor="standup-blocker"
              className="text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              Anything blocking you?{' '}
              <span className="normal-case font-normal text-ink-faint">(optional)</span>
            </label>
            <textarea
              id="standup-blocker"
              placeholder="Waiting on design review, need access to..."
              {...register('blocker')}
              className={cn(
                'w-full border border-surface-border rounded-xl',
                'px-4 py-3 text-base text-ink bg-white',
                'placeholder:text-ink-faint',
                'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
                'transition-colors duration-150',
                'min-h-[72px] resize-none leading-relaxed'
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            id="standup-submit"
            className="w-full bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-xl text-sm font-semibold focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSubmitting ? 'Submitting…' : 'Submit standup'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
