# AGENTS.md
# Standup — AI Agent & Coding Guidelines

Read this file completely before touching any file in this project.
Every decision must be traceable to this document or `frontend_styling.md`.

---

## 0. Project Context

**Standup** is an async daily standup tool for small professional teams.
Sign in once, join teams with a short code, and check in daily from a single dashboard.

A team joins with a short code. Each member answers four inputs once a day:
1. How are you coming in today? *(mood — one emoji, optional)*
2. What did you finish?
3. What are you working on today?
4. Is anything blocking you?

The board shows everyone's answers in real time. Pending members show as
placeholders. Blockers surface in a dedicated feed.

**Target users:** Any small team — not just developers. Marketing teams,
design teams, operations staff, university departments, comms offices.
Copy and UI must never assume a technical user.

**Platform:** Web app, optimised for both desktop and mobile browsers.
Mobile is a first-class citizen — not an afterthought.

---

## 1. General Agent Behaviour

### 1.1 Plan before you code
Before writing any implementation, output a short plan:
- What files will be created or modified?
- What is the data flow for this feature?
- Are there any edge cases to handle?
Only proceed after the plan is stated.

### 1.2 One concern per file
- A route handler contains no business logic
- A component does not fetch its own data (use hooks or server components)
- A model/type file contains only types and schema
- A utility function does one thing and is pure where possible

### 1.3 Never use `any`
TypeScript strict mode is on. Use `unknown` and narrow it properly.
Define interfaces before writing implementation.

### 1.4 Always handle errors
Every async operation must have error handling. API routes return structured
error responses. Server actions use try/catch. No silent rejections.

### 1.5 Never hardcode secrets
All keys and URLs live in `.env.local`. Never commit `.env.local`.

### 1.6 Ask before deleting
Never delete a file unless explicitly instructed. Flag redundancies as
comments and ask.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server components by default |
| Language | TypeScript (strict mode) | No `any` |
| Styling | Tailwind CSS + shadcn/ui | Follow `frontend_styling.md` |
| Database | Supabase (PostgreSQL) | Hosted Postgres, no local instance |
| Auth | Supabase Auth (email + password) | Session via `@supabase/ssr` cookies |
| Validation | Zod | All API inputs and form data |
| Forms | React Hook Form + Zod resolver | Client forms only |
| Data fetching | SWR | Client-side polling for live board |
| Date handling | date-fns + date-fns-tz | PHT timezone aware |
| HTTP client | Native fetch | No axios |
| Animation | Framer Motion | Purposeful only |
| Icons | lucide-react | No mixing icon libraries |
| Linting | ESLint + Prettier | Run before every commit |

---

## 3. File & Folder Structure

```
seen_sync/
├── AGENTS.md
├── frontend_styling.md
├── PROMPT.md
├── .env.local                          ← never commit
├── .env.example                        ← commit (no real values)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── supabase/
│   └── schema.sql                      ← full DB schema, run once in Supabase
│
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                    ← landing / join or create
    │   ├── globals.css
    │   │
    │   ├── team/
    │   │   └── [code]/
    │   │       ├── page.tsx            ← today's board
    │   │       ├── blockers/
    │   │       │   └── page.tsx        ← blockers feed
    │   │       └── history/
    │   │           └── page.tsx        ← past standups
    │   │
    │   └── api/
    │       ├── teams/
    │       │   ├── route.ts            ← POST /api/teams
    │       │   └── [code]/
    │       │       └── route.ts        ← GET /api/teams/:code
    │       ├── members/
    │       │   └── route.ts            ← POST /api/members
    │       └── standups/
    │           ├── route.ts            ← POST /api/standups
    │           ├── today/
    │           │   └── route.ts        ← GET /api/standups/today?teamCode=
    │           ├── history/
    │           │   └── route.ts        ← GET /api/standups/history?teamCode=&date=
    │           └── blockers/
    │               └── route.ts        ← GET /api/standups/blockers?teamCode=
    │
    ├── components/
    │   ├── ui/                         ← shadcn (do not edit)
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── PageWrapper.tsx
    │   ├── team/
    │   │   ├── JoinCreateForm.tsx
    │   │   └── TeamHeader.tsx
    │   ├── standup/
    │   │   ├── StandupCard.tsx
    │   │   ├── PendingCard.tsx
    │   │   ├── StandupForm.tsx
    │   │   ├── MoodPicker.tsx
    │   │   ├── MoodBadge.tsx
    │   │   ├── BoardGrid.tsx
    │   │   └── BlockerBadge.tsx
    │   └── shared/
    │       ├── RelativeTime.tsx
    │       ├── EmptyState.tsx
    │       └── LoadingGrid.tsx
    │
    ├── hooks/
    │   ├── useTeamBoard.ts             ← SWR polling for board
    │   ├── useBlockers.ts              ← SWR for blockers feed
    │   ├── useAuth.ts                  ← Supabase session state
    │   └── useTeamMember.ts            ← Current user's member for a team
    │
    ├── lib/
    │   ├── supabase.ts                 ← Supabase client (server + browser)
    │   ├── utils.ts                    ← cn(), date helpers
    │   └── constants.ts               ← MOOD_OPTIONS, POLL_INTERVAL, etc.
    │
    ├── types/
    │   ├── team.ts
    │   ├── standup.ts
    │   └── api.ts
    │
    └── validators/
        ├── team.schema.ts
        └── standup.schema.ts
```

---

## 4. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `StandupCard.tsx` |
| Hooks | camelCase, `use` prefix | `useTeamBoard.ts` |
| Utilities | camelCase | `getPHTDateString` |
| Types/Interfaces | PascalCase | `StandupInput` |
| Zod schemas | camelCase, `Schema` suffix | `standupSchema` |
| API routes | Next.js convention | `route.ts` |
| Env variables | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |
| DB tables | snake_case plural | `teams`, `members`, `standups` |
| DB columns | snake_case | `member_name`, `created_at` |
| TS interfaces | PascalCase | `ITeam`, `IMember` |

---

## 5. API Design Rules

### 5.1 Response envelope
```ts
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, details?: unknown }
```

### 5.2 HTTP status codes
| Situation | Code |
|---|---|
| Success read | 200 |
| Success created | 201 |
| Bad input | 400 |
| Not found | 404 |
| Duplicate | 409 |
| Server error | 500 |

### 5.3 Input validation
All POST/PATCH bodies validated with Zod before touching Supabase.
Reject invalid input with 400 + Zod error message. Never trust `req.body`.

### 5.4 Query params for filtering
```
✅ GET /api/standups/today?teamCode=XYZ123
✅ GET /api/standups/history?teamCode=XYZ123&date=2026-06-09
❌ GET /api/standups/XYZ123/today
```

---

## 6. Database Rules (Supabase)

### 6.1 Always use the server client for API routes
```ts
// lib/supabase.ts exports:
// - createBrowserSupabaseClient() → for client components (auth forms, hooks)
// - createServerClient() → for API routes and server components (cookie session)
```

### 6.2 Date scoping
"Today" = current date string in `YYYY-MM-DD` format, Philippine Time (UTC+8).
Always computed server-side via `getPHTDateString()` in `lib/utils.ts`.
Never compute dates client-side for scoping queries.

### 6.3 No raw IDs in responses
Always return `id` as a string. Supabase UUIDs are already strings.

### 6.4 Use Supabase's generated types
Run `npx supabase gen types typescript` after schema changes to keep
`src/types/supabase.ts` in sync. Import from there for DB row types.

### 6.5 RLS (Row Level Security)
For this MVP, RLS is disabled on all tables. Security is handled at the
API route level via Supabase Auth session validation and team membership checks.

---

## 7. Component Rules

### 7.1 Server components by default
Only add `'use client'` when you need:
- `useState` / `useEffect` / `useReducer`
- Browser APIs (localStorage, window)
- SWR hooks
- Event handlers on interactive elements

### 7.2 Mobile first
Write base styles for mobile. Override at `sm:`, `md:`, `lg:`.
Minimum tap target: 44×44px for all interactive elements.
Never rely on hover-only interactions for core functionality.

### 7.3 Loading + empty states required
Every data-dependent component needs:
- Skeleton loading state (shadcn `Skeleton`)
- Empty state (`EmptyState` component)
- Error state with message

### 7.4 Accessibility
- All interactive elements keyboard accessible
- `aria-label` on icon-only buttons
- Semantic HTML throughout
- `role="img"` + `aria-label` on decorative emoji
- WCAG AA contrast minimum

---

## 8. TypeScript Rules

```ts
// ✅ Always type explicitly
interface StandupInput {
  mood?: string;
  finished: string;
  today: string;
  blocker?: string;
  memberName: string;
  teamCode: string;
  memberId: string;
}

// ✅ Generic API response
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };

// ❌ Never
const handle = (data) => { ... }  // implicit any
const res: any = await fetch(...)  // explicit any
```

---

## 9. Environment Variables

```bash
# .env.example — commit this
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_POLL_INTERVAL=10000
```

```bash
# .env.local — never commit
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_POLL_INTERVAL=10000
```

### Constants (src/lib/constants.ts)
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
```

---

## 10. Git Commit Convention

```
feat: add mood check-in to standup form
fix: correct PHT timezone date scoping
chore: add Supabase schema indexes
style: update card spacing per styling guide
refactor: extract getPHTDateString to lib/utils
docs: update AGENTS.md with Supabase rules
```

Format: `type(scope?): description`
Types: `feat` `fix` `chore` `style` `refactor` `docs` `test`

---

## 11. Scope Guard — Do Not Build

- Email or push notifications
- Rich text editor
- File uploads
- Payment logic
- Admin dashboard
- Mood analytics charts
- Custom emoji configuration
- React Native / mobile app

The mood feature is: 5 emoji options, optional, one field in DB, one chip
on the card. Nothing more. This is a focused MVP.
