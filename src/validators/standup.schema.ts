import { z } from 'zod';
import { MOOD_OPTIONS } from '@/lib/constants';

const validEmojis = MOOD_OPTIONS.map(m => m.emoji) as [string, ...string[]];

export const standupFormSchema = z.object({
  mood: z.enum(validEmojis).optional(),
  finished: z.string().min(5, 'Please describe what you finished').max(500),
  today: z.string().min(5, "Please describe what you're working on").max(500),
  blocker: z.string().max(500).optional(),
  teamCode: z.string().length(6),
});

export type StandupFormInput = z.infer<typeof standupFormSchema>;

// Schema for PATCH /api/standups/[id]
export const updateStandupSchema = z.object({
  mood: z.enum(validEmojis).optional(),
  finished: z.string().min(5, 'Please describe what you finished').max(500),
  today: z.string().min(5, "Please describe what you're working on").max(500),
  blocker: z.string().max(500).optional(),
  teamCode: z.string().length(6),
});

export type UpdateStandupInput = z.infer<typeof updateStandupSchema>;
