import { z } from 'zod';

export const createTeamSchema = z.object({
  teamName: z.string().min(2, 'Team name must be at least 2 characters').max(50),
  memberName: z.string().min(2, 'Your name must be at least 2 characters').max(50),
});

export const joinTeamSchema = z.object({
  code: z.string().length(6, 'Team code must be 6 characters'),
  memberName: z.string().min(2, 'Your name must be at least 2 characters').max(50),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
