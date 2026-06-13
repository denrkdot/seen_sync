-- supabase/schema.sql
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- RLS is disabled for MVP — security handled at API route level

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  code        TEXT NOT NULL UNIQUE CHECK (char_length(code) = 6),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS teams_code_idx ON teams (upper(code));

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS members_team_id_idx ON members (team_id);

-- Standups table
CREATE TABLE IF NOT EXISTS standups (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id      UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  member_id    UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  member_name  TEXT NOT NULL,
  mood         TEXT CHECK (mood IN ('😊','😐','😤','😴','🔥') OR mood IS NULL),
  finished     TEXT NOT NULL CHECK (char_length(finished) BETWEEN 1 AND 500),
  today        TEXT NOT NULL CHECK (char_length(today) BETWEEN 1 AND 500),
  blocker      TEXT CHECK (char_length(blocker) <= 500),
  date         TEXT NOT NULL,  -- YYYY-MM-DD in PHT (Asia/Manila)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One standup per member per day
  UNIQUE (member_id, date)
);

CREATE INDEX IF NOT EXISTS standups_team_date_idx   ON standups (team_id, date);
CREATE INDEX IF NOT EXISTS standups_team_blocker_idx ON standups (team_id, blocker)
  WHERE blocker IS NOT NULL AND blocker <> '';

-- Disable RLS for MVP (security handled at API route level)
ALTER TABLE teams    DISABLE ROW LEVEL SECURITY;
ALTER TABLE members  DISABLE ROW LEVEL SECURITY;
ALTER TABLE standups DISABLE ROW LEVEL SECURITY;

-- Seed demo data (optional — run separately if needed)
-- INSERT INTO teams (name, code) VALUES ('Design Team', 'DEMO01');
