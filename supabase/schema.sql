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

-- Profiles linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link members to authenticated users
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS members_team_user_idx ON members (team_id, user_id) WHERE user_id IS NOT NULL;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Disable RLS for MVP (security handled at API route level)
ALTER TABLE teams    DISABLE ROW LEVEL SECURITY;
ALTER TABLE members  DISABLE ROW LEVEL SECURITY;
ALTER TABLE standups DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Seed demo data (optional — run separately if needed)
-- INSERT INTO teams (name, code) VALUES ('Design Team', 'DEMO01');
