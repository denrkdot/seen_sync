import { getMoodLabel } from '@/lib/constants';

interface MoodBadgeProps {
  mood?: string | null;
}

export function MoodBadge({ mood }: MoodBadgeProps) {
  if (!mood) return null;

  return (
    <span
      role="img"
      aria-label={getMoodLabel(mood)}
      title={getMoodLabel(mood)}
      className="text-lg leading-none select-none"
    >
      {mood}
    </span>
  );
}
