import type { IMember } from './team';

export interface IStandup {
  id: string;
  team_id: string;
  member_id: string;
  member_name: string;
  mood?: string | null;
  finished: string;
  today: string;
  blocker?: string | null;
  date: string;
  created_at: string;
}

export interface StandupInput {
  mood?: string;
  finished: string;
  today: string;
  blocker?: string;
  memberName: string;
  teamCode: string;
  memberId: string;
}

export interface BoardData {
  submitted: IStandup[];
  pending: IMember[];
  date: string;
}
