export const POLL_INTERVAL = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 10000;

export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🔥', label: 'Fired up' },
] as const;

export type MoodEmoji = typeof MOOD_OPTIONS[number]['emoji'];

export const getMoodLabel = (emoji: string): string =>
  MOOD_OPTIONS.find(m => m.emoji === emoji)?.label ?? emoji;

// Mood → left border color class for StandupCard
// Imported from here — never hardcode emojis in components
export const MOOD_TINTS: Record<string, string> = {
  '😊': 'border-l-success',
  '🔥': 'border-l-brand',
  '😤': 'border-l-blocker',
  '😴': 'border-l-pending',
  '😐': 'border-l-surface-border',
};

export const HISTORY_DAYS = 7;
