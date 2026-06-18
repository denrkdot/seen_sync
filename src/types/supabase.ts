export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          created_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          joined_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          joined_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          joined_at?: string;
          user_id?: string | null;
        };
      };
      standups: {
        Row: {
          id: string;
          team_id: string;
          member_id: string;
          member_name: string;
          mood: string | null;
          finished: string;
          today: string;
          blocker: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          member_id: string;
          member_name: string;
          mood?: string | null;
          finished: string;
          today: string;
          blocker?: string | null;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          member_id?: string;
          member_name?: string;
          mood?: string | null;
          finished?: string;
          today?: string;
          blocker?: string | null;
          date?: string;
          created_at?: string;
        };
      };
    };
  };
}
