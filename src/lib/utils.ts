import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns today's date in YYYY-MM-DD, Philippine Time (UTC+8)
// Always computed server-side — never use this client-side for DB queries
export function getPHTDateString(): string {
  const now = new Date();
  const pht = toZonedTime(now, 'Asia/Manila');
  return format(pht, 'yyyy-MM-dd');
}

// Generate a random 6-char uppercase team code (no ambiguous chars: 0, O, 1, I, L)
export function generateTeamCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00+08:00');
  return format(date, 'EEE, MMM d');
}
