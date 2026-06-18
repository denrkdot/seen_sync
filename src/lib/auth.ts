import type { User } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase';
import type { IMember, ITeam } from '@/types/team';

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getProfile(userId: string): Promise<{ name: string } | null> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

export async function getMemberForTeam(
  userId: string,
  teamCode: string
): Promise<{ team: ITeam; member: IMember } | null> {
  const supabase = await createServerClient();

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('code', teamCode.toUpperCase())
    .maybeSingle();

  if (!team) return null;

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('team_id', team.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!member) return null;

  return { team: team as ITeam, member: member as IMember };
}

export async function assertTeamMember(
  userId: string,
  teamCode: string
): Promise<{ team: ITeam; member: IMember } | null> {
  return getMemberForTeam(userId, teamCode);
}
