# frontend_styling.md
# Standup — Frontend Design System

Single source of truth for all visual decisions. Read this before touching
any UI file. If something isn't covered here, ask before inventing a pattern.

---

## 0. Design Philosophy

**"Calm energy with a pulse."**

Standup is used at the start of the workday. It needs to feel like a space
that's both grounding and alive — not sterile like a spreadsheet, not chaotic
like a chat app. The aesthetic sits between a well-designed notebook and a
living dashboard.

**Three personality traits:**

**Grounded** — generous whitespace, strong typographic hierarchy, nothing
screaming for attention. The content is the hero.

**Characterful** — a distinctive brand mark, a signature accent, subtle
moments of delight (the mood picker spring, a card entrance animation).
Not a generic SaaS template.

**Mobile-native** — layouts that feel at home on a phone screen. Touch
targets are generous. Navigation is thumb-reachable. Cards stack cleanly.

---

## 1. Branding

### 1.1 Name & Mark

The app is called **Standup** — but the brand mark renders as:

```
◈ standup
```

The `◈` (U+25C8, "white diamond containing black small diamond") is the
logo mark. It's geometric, neutral, slightly technical without being nerdy.
It suggests a meeting point — four directions converging.

```tsx
// Used in Header, landing hero, page title
<span className="font-bold tracking-tight">
  <span className="text-brand mr-1">◈</span>standup
</span>
```

### 1.2 Tagline
```
"No meetings. Just momentum."
```

Used on the landing page hero only. Never in the app chrome.

### 1.3 Brand voice
- Direct, not corporate
- Warm, not casual
- Confident, not loud
- Phrases to use: "Let's see where everyone's at." "What's moving today?"
- Phrases to avoid: "Synergise your workflow", "Boost productivity"

---

## 2. Colour System

### 2.1 Palette

```ts
// tailwind.config.ts — extend colors
colors: {
  // Brand — the signature
  brand: {
    DEFAULT: '#7C5CFC',    // violet — distinctive, energetic, not overused
    light:   '#F0EBFF',    // tint backgrounds
    dark:    '#6344E0',    // hover state
    subtle:  '#EDE8FF',    // very light tint for active states
  },
  // Neutrals — 90% of the UI
  ink: {
    DEFAULT: '#18181B',    // primary text (zinc-900)
    soft:    '#3F3F46',    // secondary text (zinc-700)
    muted:   '#71717A',    // captions, meta (zinc-500)
    faint:   '#A1A1AA',    // placeholders, disabled (zinc-400)
  },
  surface: {
    DEFAULT: '#FFFFFF',    // cards, inputs
    subtle:  '#F4F4F5',    // page background (zinc-100)
    raised:  '#FAFAFA',    // elevated surfaces
    border:  '#E4E4E7',    // dividers, card borders (zinc-200)
    hover:   '#F0F0F1',    // hover state on surfaces
  },
  // Semantic
  blocker: {
    DEFAULT: '#EF4444',    // red-500
    light:   '#FEF2F2',    // red-50
    border:  '#FECACA',    // red-200
  },
  pending: {
    DEFAULT: '#F59E0B',    // amber-500
    light:   '#FFFBEB',    // amber-50
    border:  '#FDE68A',    // amber-200
  },
  success: {
    DEFAULT: '#10B981',    // emerald-500
    light:   '#ECFDF5',    // emerald-50
  },
}
```

### 2.2 The Brand Violet Rule

Violet (`brand.DEFAULT` #7C5CFC) appears on:
- The ◈ logo mark
- Primary CTA buttons
- Active navigation states
- Focus rings
- Selected state on MoodPicker
- Link underlines on hover

**Nowhere else.** Not for decoration. Not for section headers. Not for
card borders. Every violet element is interactive or brand-identifying.

### 2.3 Dark mode
Not in scope for MVP. Light mode only. Do not add `dark:` classes.

---

## 3. Typography

### 3.1 Font Stack

```ts
// Install: npm install geist
fontFamily: {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
}
```

```tsx
// app/layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

### 3.2 Type Scale

| Role | Class | Size | Weight | Tracking | Use |
|---|---|---|---|---|---|
| Brand mark | `text-xl font-bold tracking-tight` | 20px | 700 | tight | Header logo |
| Hero | `text-3xl sm:text-4xl font-bold tracking-tight` | 30–36px | 700 | tight | Landing hero |
| Heading | `text-xl font-semibold tracking-tight` | 20px | 600 | tight | Section titles |
| Subheading | `text-base font-semibold` | 16px | 600 | normal | Card titles, names |
| Body | `text-sm leading-relaxed` | 14px | 400 | normal | Standup answers |
| Caption | `text-xs text-ink-muted` | 12px | 400 | normal | Timestamps, meta |
| Label | `text-xs font-medium uppercase tracking-widest` | 12px | 500 | widest | Form section labels |
| Code | `font-mono text-sm` | 14px | 400 | normal | Team codes |
| Tag | `text-xs font-semibold` | 12px | 600 | normal | Badges, chips |

### 3.3 Team Code Display

Team codes are always rendered in mono, uppercase, with letter-spacing:
```tsx
<span className="font-mono text-sm font-semibold tracking-widest uppercase
                 bg-surface-subtle px-2 py-1 rounded-md text-ink-soft">
  {code}
</span>
```

---

## 4. Spacing & Layout

### 4.1 Base unit: 4px (Tailwind default)

| Token | px | Use |
|---|---|---|
| `p-2` | 8px | Badges, chips, tight buttons |
| `p-3` | 12px | Compact elements |
| `p-4` | 16px | Cards, standard buttons |
| `p-5` | 20px | Card padding (primary) |
| `p-6` | 24px | Section padding |
| `p-8` | 32px | Page sections |
| `gap-3` | 12px | Tight grids |
| `gap-4` | 16px | Default grid/flex |
| `gap-6` | 24px | Section gaps |

### 4.2 Page Layout

```
Mobile:  px-4 (16px sides)
Tablet:  sm:px-6 (24px sides)
Desktop: lg:px-8 (32px sides) with max-w-6xl centered
```

### 4.3 Board Grid — mobile first

```tsx
// Mobile: 1 col, Tablet: 2 col, Desktop: 3 col
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 4.4 Safe area on mobile

```tsx
// PageWrapper — add bottom padding for mobile nav bars
<main className="pb-safe min-h-screen">
  // pb-safe = padding-bottom: env(safe-area-inset-bottom)
```

Add to globals.css:
```css
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
```

---

## 5. Creative Styling Concepts

These are the character elements that make Standup feel designed, not templated.

### 5.1 The Gradient Header Strip

The top of every page has a 2px gradient line — a signature visual element:

```tsx
<div className="h-0.5 w-full bg-gradient-to-r from-brand via-purple-400 to-brand-dark" />
```

This sits above the header on every page. Subtle. Distinctive.

### 5.2 Card Personality — the Mood Tint

When a standup has a mood, the card gets a very faint left border tint
that corresponds to the mood's energy:

```ts
const moodTints: Record<string, string> = {
  '😊': 'border-l-success',         // green
  '🔥': 'border-l-brand',           // violet
  '😤': 'border-l-blocker',         // red
  '😴': 'border-l-pending',         // amber
  '😐': 'border-l-surface-border',  // neutral
};
// Applied as border-l-4 on the card
```

No mood = no left border, just the standard card border.

### 5.3 The ◈ Watermark on Empty States

Empty state components use a large, faded ◈ as a background mark:

```tsx
<div className="relative flex flex-col items-center justify-center py-16">
  <span className="absolute text-[120px] font-bold text-surface-border
                   select-none pointer-events-none leading-none">
    ◈
  </span>
  <div className="relative z-10 flex flex-col items-center gap-3">
    <p className="text-ink-muted text-sm">No standups yet today.</p>
  </div>
</div>
```

### 5.4 Noise Texture on Landing Hero

The landing page hero section has a subtle noise texture overlay — gives
warmth and depth without being distracting:

```tsx
// globals.css
.noise {
  background-image: url("data:image/svg+xml,..."); // SVG noise pattern
  opacity: 0.03;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
```

```tsx
// Landing hero
<section className="relative bg-brand-light overflow-hidden rounded-2xl p-8">
  <div className="noise" aria-hidden="true" />
  <div className="relative z-10">...</div>
</section>
```

### 5.5 Dotted Grid Background

The board page has a subtle dotted grid background — suggests a workspace:

```css
/* globals.css */
.dot-grid {
  background-image: radial-gradient(circle, #D4D4D8 1px, transparent 1px);
  background-size: 24px 24px;
}
```

```tsx
<div className="dot-grid min-h-screen">
  <PageWrapper>...</PageWrapper>
</div>
```

### 5.6 Pill Navigation

Board/Blockers/History navigation uses pill-style tabs, not underline tabs:

```tsx
<nav className="flex gap-2 p-1 bg-surface-subtle rounded-xl w-fit">
  <button className={cn(
    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
    isActive
      ? "bg-white text-ink shadow-sm"
      : "text-ink-muted hover:text-ink"
  )}>
    Board
  </button>
</nav>
```

---

## 6. Component Patterns

### 6.1 StandupCard

```
┌─────────────────────────────────────┐  ← border-l-4 (mood tint color)
│  😊 Jan Reyes            2 hrs ago  │  ← MoodBadge + name + RelativeTime
├─────────────────────────────────────┤
│  FINISHED                           │  ← label: xs, widest, muted
│  Reviewed and merged the homepage   │  ← body: sm, ink.soft, line-clamp-4
│  redesign PR.                       │
│                                     │
│  TODAY                              │
│  Writing docs for onboarding flow.  │
│                                     │
│  ⚠ BLOCKER                          │  ← only if blocker exists
│  Waiting on manager approval.       │
└─────────────────────────────────────┘
```

```tsx
<article className={cn(
  "bg-white rounded-2xl p-5 border border-surface-border",
  "shadow-sm hover:shadow-md transition-shadow duration-200",
  "border-l-4",
  moodTints[standup.mood ?? ''] ?? 'border-l-surface-border'
)}>
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <MoodBadge mood={standup.mood} />
      <span className="text-base font-semibold text-ink truncate">
        {standup.memberName}
      </span>
    </div>
    <RelativeTime date={standup.createdAt} />
  </div>

  {/* Sections */}
  <div className="space-y-3">
    <StandupSection label="Finished" content={standup.finished} />
    <StandupSection label="Today" content={standup.today} />
    {standup.blocker && (
      <div className="pt-2 border-t border-blocker-border">
        <BlockerBadge />
        <p className="text-sm text-blocker mt-1">{standup.blocker}</p>
      </div>
    )}
  </div>
</article>
```

### 6.2 PendingCard

```tsx
<article className="bg-pending-light border border-dashed border-pending-border
                    rounded-2xl p-5 flex flex-col items-center justify-center
                    gap-2 min-h-[160px]">
  <div className="w-8 h-8 rounded-full bg-pending-border flex items-center
                  justify-center">
    <Clock size={16} className="text-pending" />
  </div>
  <p className="text-sm font-medium text-ink">{member.name}</p>
  <p className="text-xs text-ink-muted">Hasn't checked in yet</p>
</article>
```

### 6.3 MoodPicker

```
How are you coming in today?   ← label

  😊    😐    😤    😴    🔥
```

```tsx
// Each emoji is a motion.button with spring on select
// Selected: ring-2 ring-brand, bg-brand-subtle, scale-110
// Unselected: bg-surface-subtle, border-surface-border
// Deselect: tap selected emoji again → undefined

<motion.button
  type="button"
  aria-label={label}
  aria-pressed={selected === emoji}
  whileTap={{ scale: 0.9 }}
  animate={{ scale: selected === emoji ? 1.15 : 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  onClick={() => onSelect(selected === emoji ? undefined : emoji)}
  className={cn(
    "w-12 h-12 rounded-2xl text-2xl flex items-center justify-center",
    "border-2 transition-colors duration-150",
    selected === emoji
      ? "border-brand bg-brand-subtle ring-2 ring-brand ring-offset-2"
      : "border-surface-border bg-surface-subtle hover:border-brand/40"
  )}
>
  {emoji}
</motion.button>
```

MoodPicker rules:
- Always first in the form, before a `<Separator />`
- Optional — never a validation error
- Min tap target: `w-12 h-12` (48px) for mobile
- Spring animation is the ONLY spring in the app
- Respects `prefers-reduced-motion`

### 6.4 MoodBadge

```tsx
<span
  role="img"
  aria-label={getMoodLabel(mood)}
  title={getMoodLabel(mood)}
  className="text-lg leading-none select-none"
>
  {mood}
</span>
```

- `text-lg` (18px), no background, no border
- Renders nothing (not a placeholder) if mood is falsy
- `select-none` prevents double-click text selection

### 6.5 BlockerBadge

```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5
                 bg-blocker-light text-blocker text-xs font-semibold
                 rounded-full border border-blocker-border uppercase tracking-wide">
  <AlertTriangle size={10} />
  Blocker
</span>
```

### 6.6 Primary Button

```tsx
<button className="bg-brand hover:bg-brand-dark text-white
                   px-5 py-2.5 rounded-xl text-sm font-semibold
                   focus-visible:ring-2 focus-visible:ring-brand
                   focus-visible:ring-offset-2
                   transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed
                   min-h-[44px]">                    ← mobile tap target
```

### 6.7 Ghost Button

```tsx
<button className="bg-transparent border border-surface-border text-ink
                   px-5 py-2.5 rounded-xl text-sm font-medium
                   hover:bg-surface-hover transition-colors duration-150
                   min-h-[44px]">
```

### 6.8 Input / Textarea

```tsx
<input className="w-full border border-surface-border rounded-xl
                  px-4 py-3 text-sm text-ink bg-white
                  placeholder:text-ink-faint
                  focus:outline-none focus:ring-2 focus:ring-brand
                  focus:border-transparent
                  transition-all duration-150
                  min-h-[44px]" />               ← mobile tap target

<textarea className="... min-h-[88px] resize-none leading-relaxed" />
```

---

## 7. Page Layouts

### 7.1 Landing Page — Mobile

```
┌─────────────────────┐
│  ◈ standup          │  ← header (sticky)
├─────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ◈                  │  ← hero section (brand-light bg + noise)
│  No meetings.       │
│  Just momentum.     │
│  ─────────────────  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├─────────────────────┤
│  Join a team        │  ← stacked on mobile, side-by-side on sm+
│  [Team code     ]   │
│  [Your name     ]   │
│  [ Join →       ]   │
├─────────────────────┤
│  Create a team      │
│  [Team name     ]   │
│  [Your name     ]   │
│  [ Create →     ]   │
└─────────────────────┘
```

### 7.2 Board Page

```
┌─────────────────────┐
│  ◈ standup   [code] │  ← sticky header with team name + code chip
├─────────────────────┤
│  [Board][Blk][Hist] │  ← pill nav tabs
├─────────────────────┤  ← dot-grid background starts here
│                     │
│  [+ Check in today] │  ← CTA card if not submitted (full width on mobile)
│                     │
│  ┌───────────────┐  │
│  │ 😊 Jan Reyes  │  │  ← StandupCard (full width on mobile)
│  │ ...           │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ⏳ Maria      │  │  ← PendingCard
│  └───────────────┘  │
└─────────────────────┘
```

### 7.3 Standup Form — Dialog on mobile

The form opens in a `Dialog` (bottom sheet feel on mobile):
```tsx
// Dialog takes full width on mobile, max-w-lg centered on desktop
<Dialog>
  <DialogContent className="w-full max-w-lg mx-auto
                            sm:rounded-2xl rounded-t-2xl rounded-b-none
                            fixed bottom-0 sm:bottom-auto sm:top-1/2">
```

### 7.4 Blockers Feed

```
┌─────────────────────┐
│ ← Board   Blockers  │
├─────────────────────┤
│  ┌───────────────┐  │
│  │ ⚠ BLOCKER     │  │
│  │ 😤 Maria · now│  │
│  │ Waiting on... │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 8. Motion & Animation

### 8.1 Standard transitions

```tsx
// Page entrance
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}

// Board card stagger
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } }
};
```

### 8.2 MoodPicker — the one spring

```tsx
animate={{ scale: selected === emoji ? 1.15 : 1 }}
transition={{ type: 'spring', stiffness: 400, damping: 20 }}
```

This is the only spring animation. Everything else uses `easeOut`.

### 8.3 Rules

- Max animation duration: 300ms
- No bounce on anything except MoodPicker
- Always wrap with `prefers-reduced-motion` check:

```tsx
const prefersReduced = useReducedMotion();
const variants = prefersReduced ? {} : cardVariants;
```

---

## 9. Mobile-Specific Rules

- All buttons and interactive elements: `min-h-[44px]` minimum
- All inputs: `min-h-[44px]`, `text-[16px]` minimum to prevent iOS zoom
  ```tsx
  // Prevent iOS zoom on focus — always use text-base (16px) on inputs
  <input className="text-base ..." />  // NOT text-sm on mobile inputs
  ```
- Form dialog: bottom sheet on mobile (`rounded-t-2xl, fixed bottom-0`)
- Navigation: pill tabs are thumb-reachable (placed near top, not bottom)
- Cards: full width on mobile, no horizontal scroll
- Avoid `hover:` only interactions for anything functional
- Test at 375px (iPhone SE) and 390px (iPhone 14) viewport widths

---

## 10. shadcn/ui Components

| Component | Use case |
|---|---|
| `Button` | All buttons (override with Tailwind) |
| `Input` | All text inputs |
| `Textarea` | Standup answer fields |
| `Card` | Base shell (rarely used — prefer custom article) |
| `Badge` | Status chips |
| `Separator` | Between MoodPicker and the 3 questions |
| `Skeleton` | Loading states |
| `Dialog` | Standup form modal (bottom sheet on mobile) |
| `Tabs` | Board/Blockers/History (override with pill style) |
| `Sonner` | Toast notifications |

`MoodPicker` and `MoodBadge` are fully custom — no shadcn primitives.

---

## 11. Do Not

- ❌ Gradients on buttons or cards (only on the 2px header strip)
- ❌ Drop shadows larger than `shadow-md`
- ❌ `rounded-full` on cards or large containers
- ❌ Center-align body text
- ❌ More than 2 font weights on one screen
- ❌ `transition-all` — specify the property
- ❌ Hardcode pixel values — use Tailwind scale
- ❌ Spinners — use skeleton screens
- ❌ Brand violet for decoration — only for interactive/brand elements
- ❌ Label or tooltip on MoodBadge on the card — emoji is self-explanatory
- ❌ Spring animations on anything except MoodPicker
- ❌ `dark:` classes — light mode only for MVP
- ❌ `text-sm` on mobile form inputs — use `text-base` to prevent iOS zoom
- ❌ Mood as a required field — always optional
