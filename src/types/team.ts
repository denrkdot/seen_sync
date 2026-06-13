export interface ITeam {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface IMember {
  id: string;
  team_id: string;
  name: string;
  joined_at: string;
}

export interface ITeamWithMembers extends ITeam {
  members: IMember[];
}
