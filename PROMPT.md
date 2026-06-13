# Initial Agent Prompt — Standup App (Supabase Edition)
# Paste this entire file into your coding agent to bootstrap the project.

---

## Your Mission

Scaffold **Standup** — a production-quality async standup tool for small
professional teams. No accounts. No meetings. Three questions + a mood
check-in, once a day, visible to the whole team on a shared board.

Read these two files completely before writing any code:
- `AGENTS.md` — architecture, naming, API design, database rules
- `frontend_styling.md` — all visual standards, components, mobile rules

Every decision must be traceable to one of those documents.

---

## Phase 0 — Dependencies

Run in the workspace root (do NOT create a new folder):

```bash
# Core deps
npm install @supabase/supabase-js swr date-fns date-fns-tz zod react-hook-form @hookform/resolvers framer-motion lucide-react geist

# shadcn/ui setup
npx shadcn@latest init
# When prompted: Style: Default, Base color: Zinc, CSS variables: Yes

# shadcn components
npx shadcn@latest add button input textarea card badge separator skeleton dialog tabs sonner
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_POLL_INTERVAL=10000
```

Create `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_POLL_INTERVAL=10000
```

---

## Phase 1 — Supabase Schema

Create `supabase/schema.sql`. The agent must create this file first —
it defines the entire data model before any code is written.

```sql
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

-- Disable RLS for MVP (note this in comments)
ALTER TABLE teams    DISABLE ROW LEVEL SECURITY;
ALTER TABLE members  DISABLE ROW LEVEL SECURITY;
ALTER TABLE standups DISABLE ROW LEVEL SECURITY;

-- Seed demo data (optional — run separately if needed)
-- INSERT INTO teams (name, code) VALUES ('Design Team', 'DEMO01');
```

---

## Phase 2 — Tailwind & Font Configuration

### tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: false,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#7C5CFC',
          light:   '#F0EBFF',
          dark:    '#6344E0',
          subtle:  '#EDE8FF',
        },
        ink: {
          DEFAULT: '#18181B',
          soft:    '#3F3F46',
          muted:   '#71717A',
          faint:   '#A1A1AA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle:  '#F4F4F5',
          raised:  '#FAFAFA',
          border:  '#E4E4E7',
          hover:   '#F0F0F1',
        },
        blocker: {
          DEFAULT: '#EF4444',
          light:   '#FEF2F2',
          border:  '#FECACA',
        },
        pending: {
          DEFAULT: '#F59E0B',
          light:   '#FFFBEB',
          border:  '#FDE68A',
        },
        success: {
          DEFAULT: '#10B981',
          light:   '#ECFDF5',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    @apply border-surface-border;
  }
  body {
    @apply bg-surface-subtle text-ink antialiased;
    font-feature-settings: 'cv11', 'ss01';
  }
  h1, h2, h3, h4 {
    @apply tracking-tight;
  }
}

@layer utilities {
  /* Mobile safe area */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 16px);
  }

  /* Dot grid background for board page */
  .dot-grid {
    background-image: radial-gradient(circle, #D4D4D8 1px, transparent 1px);
    background-size: 24px 24px;
  }

  /* Noise texture for hero section */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    border-radius: inherit;
  }
}
```

### src/app/layout.tsx

```tsx
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Standup — No meetings. Just momentum.',
  description: 'Async daily standups for small teams. No accounts. No meetings.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>" },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // prevent iOS auto-zoom
  themeColor: '#7C5CFC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans min-h-screen bg-surface-subtle">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
```

---

## Phase 3 — Types

### src/types/api.ts

```ts
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; details?: unknown };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

### src/types/team.ts

```ts
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
```

### src/types/standup.ts

```ts
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
```

---

## Phase 4 — Validators

### src/validators/team.schema.ts

```ts
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
```

### src/validators/standup.schema.ts

```ts
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
```

---

## Phase 5 — Supabase Client & Lib

### src/lib/supabase.ts

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Browser client — used in hooks and client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client factory — same config for MVP (no auth)
// If auth is added later, swap for @supabase/ssr server client
export const createServerClient = () => createClient(supabaseUrl, supabaseAnonKey);
```

### src/lib/utils.ts

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns today's date in YYYY-MM-DD, Philippine Time (UTC+8)
export function getPHTDateString(): string {
  const now = new Date();
  const pht = toZonedTime(now, 'Asia/Manila');
  return format(pht, 'yyyy-MM-dd');
}

// Generate a random 6-char uppercase team code (no ambiguous chars)
export function generateTeamCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00+08:00');
  return format(date, 'EEE, MMM d');
}
```

### src/lib/constants.ts

```ts
export const POLL_INTERVAL = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 10000;

export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🔥', label: 'Fired up' },
] as const;

export type MoodEmoji = typeof MOOD_OPTIONS[number]['emoji'];

export const getMoodLabel = (emoji: string): string =>
  MOOD_OPTIONS.find(m => m.emoji === emoji)?.label ?? emoji;

// Mood → left border color class for StandupCard
export const MOOD_TINTS: Record<string, string> = {
  '😊': 'border-l-success',
  '🔥': 'border-l-brand',
  '😤': 'border-l-blocker',
  '😴': 'border-l-pending',
  '😐': 'border-l-surface-border',
};

export const HISTORY_DAYS = 7;
```

---

## Phase 6 — API Routes

### src/app/api/teams/route.ts — POST /api/teams

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateTeamCode } from '@/lib/utils';
import { createTeamSchema } from '@/validators/team.schema';
import type { ApiResponse } from '@/types/api';
import type { ITeam, IMember } from '@/types/team';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { teamName, memberName } = parsed.data;
    const db = createServerClient();

    // Generate unique code (retry on collision)
    let code = generateTeamCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data } = await db.from('teams').select('id').eq('code', code).maybeSingle();
      if (!data) break;
      code = generateTeamCode();
      attempts++;
    }

    // Create team
    const { data: team, error: teamErr } = await db
      .from('teams')
      .insert({ name: teamName, code })
      .select()
      .single();

    if (teamErr || !team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to create team' },
        { status: 500 }
      );
    }

    // Create first member
    const { data: member, error: memberErr } = await db
      .from('members')
      .insert({ team_id: team.id, name: memberName })
      .select()
      .single();

    if (memberErr || !member) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to create member' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ team: ITeam; member: IMember }>>(
      { success: true, data: { team, member } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/teams]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/teams/[code]/route.ts — GET /api/teams/:code

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import type { ITeamWithMembers } from '@/types/team';

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const db = createServerClient();
    const { data: team, error } = await db
      .from('teams')
      .select('*, members(*)')
      .eq('code', params.code.toUpperCase())
      .single();

    if (error || !team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ITeamWithMembers>>({
      success: true,
      data: team as ITeamWithMembers,
    });
  } catch (err) {
    console.error('[GET /api/teams/:code]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/members/route.ts — POST /api/members

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { joinTeamSchema } from '@/validators/team.schema';
import type { ApiResponse } from '@/types/api';
import type { IMember } from '@/types/team';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = joinTeamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { code, memberName } = parsed.data;
    const db = createServerClient();

    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found. Check your team code.' },
        { status: 404 }
      );
    }

    const { data: member, error } = await db
      .from('members')
      .insert({ team_id: team.id, name: memberName })
      .select()
      .single();

    if (error || !member) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to join team' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IMember>>(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/members]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/standups/route.ts — POST /api/standups

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { standupSchema } from '@/validators/standup.schema';
import { getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = standupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { mood, finished, today, blocker, memberName, teamCode, memberId } = parsed.data;
    const db = createServerClient();
    const date = getPHTDateString();

    // Check for duplicate submission
    const { data: existing } = await db
      .from('standups')
      .select('id')
      .eq('member_id', memberId)
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'You have already submitted your standup today' },
        { status: 409 }
      );
    }

    // Get team id from code
    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', teamCode.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    const { data: standup, error } = await db
      .from('standups')
      .insert({
        team_id: team.id,
        member_id: memberId,
        member_name: memberName,
        mood: mood ?? null,
        finished,
        today,
        blocker: blocker || null,
        date,
      })
      .select()
      .single();

    if (error || !standup) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to submit standup' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup>>(
      { success: true, data: standup },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/standups]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/standups/today/route.ts — GET board data

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getPHTDateString } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { BoardData } from '@/types/standup';
import type { IMember } from '@/types/team';

export async function GET(req: NextRequest) {
  try {
    const teamCode = req.nextUrl.searchParams.get('teamCode');
    if (!teamCode) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode is required' },
        { status: 400 }
      );
    }
    const db = createServerClient();

    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', teamCode.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    const date = getPHTDateString();

    const [{ data: members }, { data: standups }] = await Promise.all([
      db.from('members').select('*').eq('team_id', team.id).order('joined_at'),
      db.from('standups').select('*').eq('team_id', team.id).eq('date', date).order('created_at'),
    ]);

    const submittedIds = new Set((standups ?? []).map(s => s.member_id));
    const pending: IMember[] = (members ?? []).filter(m => !submittedIds.has(m.id));

    return NextResponse.json<ApiResponse<BoardData>>({
      success: true,
      data: {
        submitted: standups ?? [],
        pending,
        date,
      },
    });
  } catch (err) {
    console.error('[GET /api/standups/today]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/standups/blockers/route.ts — GET blockers feed

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function GET(req: NextRequest) {
  try {
    const teamCode = req.nextUrl.searchParams.get('teamCode');
    if (!teamCode) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode is required' },
        { status: 400 }
      );
    }
    const db = createServerClient();

    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', teamCode.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // Last 7 days, non-empty blocker
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: blockers, error } = await db
      .from('standups')
      .select('*')
      .eq('team_id', team.id)
      .not('blocker', 'is', null)
      .neq('blocker', '')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to fetch blockers' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup[]>>({
      success: true,
      data: blockers ?? [],
    });
  } catch (err) {
    console.error('[GET /api/standups/blockers]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### src/app/api/standups/history/route.ts — GET past day

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ApiResponse } from '@/types/api';
import type { IStandup } from '@/types/standup';

export async function GET(req: NextRequest) {
  try {
    const teamCode = req.nextUrl.searchParams.get('teamCode');
    const date = req.nextUrl.searchParams.get('date');
    if (!teamCode || !date) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'teamCode and date are required' },
        { status: 400 }
      );
    }
    const db = createServerClient();

    const { data: team } = await db
      .from('teams')
      .select('id')
      .eq('code', teamCode.toUpperCase())
      .maybeSingle();

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    const { data: standups, error } = await db
      .from('standups')
      .select('*')
      .eq('team_id', team.id)
      .eq('date', date)
      .order('created_at');

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Failed to fetch history' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<IStandup[]>>({
      success: true,
      data: standups ?? [],
    });
  } catch (err) {
    console.error('[GET /api/standups/history]', err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

---

## Phase 7 — Hooks

### src/hooks/useMember.ts

```ts
'use client';
import { useState, useEffect } from 'react';
import type { IMember } from '@/types/team';

const KEY = 'standup_member';

export function useMember() {
  const [member, setMemberState] = useState<IMember | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setMemberState(JSON.parse(stored));
    } catch {
      localStorage.removeItem(KEY);
    }
  }, []);

  const saveMember = (m: IMember) => {
    localStorage.setItem(KEY, JSON.stringify(m));
    setMemberState(m);
  };

  const clearMember = () => {
    localStorage.removeItem(KEY);
    setMemberState(null);
  };

  return { member, saveMember, clearMember };
}
```

### src/hooks/useTeamBoard.ts

```ts
'use client';
import useSWR from 'swr';
import { POLL_INTERVAL } from '@/lib/constants';
import type { BoardData } from '@/types/standup';
import type { ApiResponse } from '@/types/api';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useTeamBoard(teamCode: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<BoardData>>(
    teamCode ? `/api/standups/today?teamCode=${teamCode}` : null,
    fetcher,
    { refreshInterval: POLL_INTERVAL }
  );
  return {
    board: data?.success ? data.data : null,
    error: data?.success === false ? data.error : error?.message,
    isLoading,
    refresh: mutate,
  };
}
```

### src/hooks/useBlockers.ts

```ts
'use client';
import useSWR from 'swr';
import type { IStandup } from '@/types/standup';
import type { ApiResponse } from '@/types/api';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useBlockers(teamCode: string | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<IStandup[]>>(
    teamCode ? `/api/standups/blockers?teamCode=${teamCode}` : null,
    fetcher
  );
  return {
    blockers: data?.success ? data.data : [],
    error: data?.success === false ? data.error : error?.message,
    isLoading,
  };
}
```

---

## Phase 8 — Pages & Components

All backend infrastructure is complete. Now build the UI.
Read `frontend_styling.md` before writing every component.
Build in this exact order — each depends on the previous:

### Components (build in order):

1. **`src/lib/constants.ts`** — already defined above, ensure MOOD_TINTS is included
2. **`src/components/shared/RelativeTime.tsx`** — `formatDistanceToNow` from date-fns, updates every minute via `useEffect`
3. **`src/components/standup/MoodBadge.tsx`** — emoji with `role="img"`, renders null if no mood
4. **`src/components/standup/MoodPicker.tsx`** — 5 emoji buttons, spring animation on select, `motion.button` from framer-motion
5. **`src/components/standup/BlockerBadge.tsx`** — red chip with AlertTriangle icon
6. **`src/components/shared/EmptyState.tsx`** — large faded ◈ watermark + message
7. **`src/components/shared/LoadingGrid.tsx`** — skeleton grid matching BoardGrid layout
8. **`src/components/standup/StandupForm.tsx`** — MoodPicker → Separator → 3 fields → submit. Dialog bottom-sheet on mobile. React Hook Form + Zod.
9. **`src/components/standup/StandupCard.tsx`** — full card with mood tint border-l-4, MoodBadge, all three sections, BlockerBadge if applicable
10. **`src/components/standup/PendingCard.tsx`** — dashed amber border, Clock icon, "Hasn't checked in yet"
11. **`src/components/standup/BoardGrid.tsx`** — Framer Motion stagger container + item variants. Renders StandupCards + PendingCards.
12. **`src/components/layout/Header.tsx`** — gradient strip at top, ◈ standup logo, team name + code chip if on team page
13. **`src/components/team/JoinCreateForm.tsx`** — two panels (join + create), stacked on mobile, side-by-side on sm+
14. **`src/app/page.tsx`** — landing page with hero (brand-light + noise), JoinCreateForm below
15. **`src/app/team/[code]/page.tsx`** — dot-grid background, pill nav, board with SWR polling, submit CTA
16. **`src/app/team/[code]/blockers/page.tsx`** — blockers feed
17. **`src/app/team/[code]/history/page.tsx`** — date list + past board

---

## Phase 9 — Seed Data

Create `src/scripts/seed.ts`:

```ts
// Run: npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seed.ts
// Seeds:
// - Team: "Design Team" code: "DEMO01"
// - Members: Jan (😊 Good), Maria (😤 Frustrated + blocker), Carlo (😴 Tired), Sofia (pending)
// - 5 days of history with varied moods and 2 blocker entries
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
```

---

## Phase 10 — Supabase Setup Instructions (for developer)

```
1. Go to supabase.com → New project
2. Copy Project URL and anon key → paste into .env.local
3. Go to SQL Editor → New query
4. Paste the contents of supabase/schema.sql → Run
5. npm run dev
6. Visit http://localhost:3000
7. Optional: npx ts-node ... src/scripts/seed.ts
8. Visit http://localhost:3000/team/DEMO01
```

---

## Quality Checklist

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No `any` types anywhere
- [ ] All API routes return `ApiResponse<T>` envelope
- [ ] `supabase/schema.sql` is committed and complete
- [ ] `.env.local` is in `.gitignore`, `.env.example` is committed
- [ ] All forms have loading + error states
- [ ] All data components have skeleton loading states
- [ ] Board auto-refreshes every 10s via SWR
- [ ] MoodPicker is optional — no validation error if skipped
- [ ] MoodBadge renders nothing (not a space) when mood is null/empty
- [ ] MoodBadge has `role="img"` and `aria-label`
- [ ] Spring animation scoped to MoodPicker only
- [ ] MOOD_OPTIONS and MOOD_TINTS imported from constants — no hardcoded emojis
- [ ] All buttons/inputs have `min-h-[44px]` for mobile tap targets
- [ ] Mobile inputs use `text-base` to prevent iOS zoom
- [ ] StandupForm dialog is bottom-sheet style on mobile
- [ ] Gradient header strip appears on every page
- [ ] Dot-grid background on board page
- [ ] ◈ watermark in empty states
- [ ] `viewport` meta includes `maximumScale: 1`
- [ ] GitHub repo pushed with descriptive README
