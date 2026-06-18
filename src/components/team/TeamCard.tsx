import Link from 'next/link';
import { RelativeTime } from '@/components/shared/RelativeTime';
import type { IUserTeam } from '@/types/team';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  userTeam: IUserTeam;
}

export function TeamCard({ userTeam }: TeamCardProps) {
  const { team, member } = userTeam;

  return (
    <article className="bg-white rounded-2xl p-5 border border-surface-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-ink truncate">{team.name}</h2>
        <span className="inline-block mt-2 font-mono text-sm font-semibold tracking-widest uppercase bg-surface-subtle px-2 py-1 rounded-md text-ink-soft">
          {team.code}
        </span>
        <p className="text-xs text-ink-muted mt-2">
          Joined <RelativeTime date={member.joined_at} />
        </p>
      </div>

      <Link
        href={`/team/${team.code}`}
        className={cn(
          'inline-flex items-center justify-center',
          'bg-brand hover:bg-brand-dark text-white',
          'px-5 py-2.5 rounded-xl text-sm font-semibold',
          'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          'transition-colors duration-150 min-h-[44px]'
        )}
      >
        Open board →
      </Link>
    </article>
  );
}
