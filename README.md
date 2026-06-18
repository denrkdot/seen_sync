# Standup

Async daily standups for small teams. Sign in once, manage all your teams from one dashboard.

## Quick Start

1. Clone this repository
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Run `supabase/schema.sql` in the Supabase SQL Editor
4. In Supabase Dashboard → Authentication → Providers, enable **Email** auth
5. `npm install`
6. `npm run dev`
7. Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email + password)
- **Data Fetching:** SWR (polling every 10s)
- **Validation:** Zod + React Hook Form
- **Animations:** Framer Motion
- **Font:** Geist

## Features

- Sign up / sign in with email and password
- Dashboard listing all teams you've joined
- Create or join teams with a 6-character code
- Answer 3 questions + an optional mood check-in once per day
- Live board updates every 10 seconds via SWR polling
- Blockers feed for the last 7 days
- Past standup history by date

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon key** → paste into `.env.local`
3. Go to SQL Editor → New query → paste `supabase/schema.sql` → Run
4. Go to Authentication → Providers → enable **Email**
5. (Optional) run the seed script: `npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seed.ts`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_POLL_INTERVAL=10000
```
