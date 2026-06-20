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
  user_id?: string | null;
}

export interface IProfile {
  id: string;
  name: string;
  created_at: string;
}

export interface ITeamStats {
  memberCount: number;
  todayStandupsCount: number;
  activeBlockersCount: number;
  todayCheckedIn: { memberName: string; mood?: string | null }[];
}

export interface IUserTeam {
  team: ITeam;
  member: IMember;
  stats?: ITeamStats;
}

export interface ITeamWithMembers extends ITeam {
  members: IMember[];
}
