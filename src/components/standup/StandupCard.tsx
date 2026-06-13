import { MoodBadge } from './MoodBadge';
import { BlockerBadge } from './BlockerBadge';
import { RelativeTime } from '@/components/shared/RelativeTime';
import { MOOD_TINTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { IStandup } from '@/types/standup';

interface StandupSection {
  label: string;
  content: string;
}

function Section({ label, content }: StandupSection) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">{content}</p>
    </div>
  );
}

interface StandupCardProps {
  standup: IStandup;
}

export function StandupCard({ standup }: StandupCardProps) {
  const moodTint = standup.mood ? (MOOD_TINTS[standup.mood] ?? 'border-l-surface-border') : 'border-l-surface-border';

  return (
    <article
      className={cn(
        'bg-white rounded-2xl p-5 border border-surface-border',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        'border-l-4',
        moodTint
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <MoodBadge mood={standup.mood} />
          <span className="text-base font-semibold text-ink truncate">
            {standup.member_name}
          </span>
        </div>
        <RelativeTime date={standup.created_at} />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <Section label="Finished" content={standup.finished} />
        <Section label="Today" content={standup.today} />
        {standup.blocker && (
          <div className="pt-2 border-t border-blocker-border">
            <BlockerBadge />
            <p className="text-sm text-blocker mt-1 leading-relaxed">{standup.blocker}</p>
          </div>
        )}
      </div>
    </article>
  );
}
