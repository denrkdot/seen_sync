import { z } from 'zod';
import { MOOD_OPTIONS } from '@/lib/constants';

const validEmojis = MOOD_OPTIONS.map(m => m.emoji) as [string, ...string[]];

export const standupSchema = z.object({
  mood: z.enum(validEmojis).optional(),
  finished: z.string().min(5, 'Please describe what you finished').max(500),
  today: z.string().min(5, "Please describe what you're working on").max(500),
  blocker: z.string().max(500).optional(),
  memberName: z.string().min(1),
  teamCode: z.string().length(6),
  memberId: z.string().uuid(),
});

export type StandupFormInput = z.infer<typeof standupSchema>;
