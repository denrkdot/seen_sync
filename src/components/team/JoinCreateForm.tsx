'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { createTeamSchema, joinTeamSchema } from '@/validators/team.schema';
import type { CreateTeamInput, JoinTeamInput } from '@/validators/team.schema';
import { cn } from '@/lib/utils';
import type { IMember } from '@/types/team';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-blocker mt-1">{message}</p>;
}

const inputClass = cn(
  'w-full border border-surface-border rounded-xl',
  'px-4 py-3 text-base text-ink bg-white',
  'placeholder:text-ink-faint',
  'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
  'transition-colors duration-150 min-h-[44px]'
);

const btnClass = cn(
  'w-full bg-brand hover:bg-brand-dark text-white',
  'px-5 py-2.5 rounded-xl text-sm font-semibold',
  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
  'transition-colors duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'
);

interface JoinCreateFormProps {
  defaultMemberName?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function JoinCreateForm({ defaultMemberName = '', onSuccess, compact = false }: JoinCreateFormProps) {
  const router = useRouter();
  const [joinLoading, setJoinLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const joinForm = useForm<JoinTeamInput>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { memberName: defaultMemberName },
  });
  const createForm = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { memberName: defaultMemberName },
  });

  const invalidateTeams = () => void mutate('/api/users/teams');

  const handleJoin = async (data: JoinTeamInput) => {
    setJoinLoading(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json() as { success: boolean; data?: IMember; error?: string };
      if (res.status === 409) {
        toast.info("You're already on this team");
        invalidateTeams();
        onSuccess?.();
        router.push(`/team/${data.code.toUpperCase()}`);
        return;
      }
      if (!json.success || !json.data) {
        toast.error(json.error ?? 'Could not join team');
        return;
      }
      toast.success(`Joined team ${data.code.toUpperCase()}!`);
      invalidateTeams();
      onSuccess?.();
      router.push(`/team/${data.code.toUpperCase()}`);
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreate = async (data: CreateTeamInput) => {
    setCreateLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json() as {
        success: boolean;
        data?: { team: { code: string }; member: IMember };
        error?: string;
      };
      if (!json.success || !json.data) {
        toast.error(json.error ?? 'Could not create team');
        return;
      }
      toast.success('Team created!');
      invalidateTeams();
      onSuccess?.();
      router.push(`/team/${json.data.team.code}`);
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setCreateLoading(false);
    }
  };

  const gridClass = compact
    ? 'space-y-6'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-6';

  return (
    <div className={gridClass}>
      {/* Join a team */}
      <div className={cn(!compact && 'bg-white rounded-2xl p-6 border border-surface-border shadow-sm')}>
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Join a team</h2>
        <p className="text-sm text-ink-muted mb-5">Have a team code? Jump right in.</p>

        <form onSubmit={joinForm.handleSubmit(handleJoin)} className="space-y-4" noValidate>
          {/* memberName is submitted silently from profile — not shown to user */}
          <input type="hidden" {...joinForm.register('memberName')} />

          <div>
            <label htmlFor="join-code" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
              Team code
            </label>
            <input
              id="join-code"
              type="text"
              placeholder="ABCD12"
              maxLength={6}
              autoComplete="off"
              {...joinForm.register('code', {
                onChange: e => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              className={cn(inputClass, 'font-mono tracking-widest uppercase', joinForm.formState.errors.code && 'border-blocker')}
            />
            <FieldError message={joinForm.formState.errors.code?.message} />
          </div>

          {defaultMemberName && (
            <p className="text-xs text-ink-muted">
              Joining as <span className="font-semibold text-ink">{defaultMemberName}</span>
            </p>
          )}

          <button type="submit" disabled={joinLoading} id="join-submit" className={btnClass}>
            {joinLoading ? 'Joining…' : 'Join →'}
          </button>
        </form>
      </div>

      {/* Create a team */}
      <div className={cn(!compact && 'bg-white rounded-2xl p-6 border border-surface-border shadow-sm')}>
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Create a team</h2>
        <p className="text-sm text-ink-muted mb-5">Start fresh. Your team code is generated automatically.</p>

        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4" noValidate>
          {/* memberName is submitted silently from profile — not shown to user */}
          <input type="hidden" {...createForm.register('memberName')} />

          <div>
            <label htmlFor="create-team-name" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
              Team name
            </label>
            <input
              id="create-team-name"
              type="text"
              placeholder="Design Team"
              {...createForm.register('teamName')}
              className={cn(inputClass, createForm.formState.errors.teamName && 'border-blocker')}
            />
            <FieldError message={createForm.formState.errors.teamName?.message} />
          </div>

          {defaultMemberName && (
            <p className="text-xs text-ink-muted">
              Creating as <span className="font-semibold text-ink">{defaultMemberName}</span>
            </p>
          )}

          <button type="submit" disabled={createLoading} id="create-submit" className={btnClass}>
            {createLoading ? 'Creating…' : 'Create →'}
          </button>
        </form>
      </div>
    </div>
  );
}
