'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOOD_OPTIONS, getMoodLabel } from '@/lib/constants';
import { StandupCard } from '@/components/standup/StandupCard';
import { PendingCard } from '@/components/standup/PendingCard';
import { BlockerCard } from '@/components/standup/BlockerCard';
import type { IStandup } from '@/types/standup';

interface MockStandup {
  id: string;
  memberName: string;
  initials: string;
  mood?: string;
  finished: string;
  today: string;
  blocker?: string;
  createdAt: Date;
}

// Helper to map MockStandup to IStandup for standard components
const mapToIStandup = (s: MockStandup): IStandup => ({
  id: s.id,
  team_id: 'mock-team',
  member_id: s.id === 'visitor-standup' ? 'david-id' : s.id,
  member_name: s.memberName,
  mood: s.mood || null,
  finished: s.finished,
  today: s.today,
  blocker: s.blocker || null,
  date: '2026-06-20',
  created_at: s.createdAt.toISOString(),
});

export function LandingClient() {
  // Tab states for the mock board
  const [activeTab, setActiveTab] = useState<'board' | 'blockers' | 'history'>('board');

  // Form states for the mock "Try it out" check-in
  const [formName, setFormName] = useState('');
  const [formMood, setFormMood] = useState<string | undefined>(undefined);
  const [formFinished, setFormFinished] = useState('');
  const [formToday, setFormToday] = useState('');
  const [formBlocker, setFormBlocker] = useState('');
  const [errors, setErrors] = useState<{ finished?: boolean; today?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Mock team standups state
  const [standups, setStandups] = useState<MockStandup[]>([
    {
      id: 'mock-1',
      memberName: 'Jan Reyes',
      initials: 'JR',
      mood: '🔥',
      finished: 'Implemented production-grade auth session storage using @supabase/ssr.',
      today: 'Integrating React Hook Form with Zod schemas for validation.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'mock-2',
      memberName: 'Maria Santos',
      initials: 'MS',
      mood: '😴',
      finished: 'Refactored pending board card layout variables for mobile-native safe zones.',
      today: 'Testing the timezone scoping helper on local dev server.',
      blocker: 'Awaiting client API keys for social OAuth scopes.',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  ]);

  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handlePendingClick = () => {
    const inputEl = document.getElementById('mock-name');
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { finished?: boolean; today?: boolean } = {};
    if (!formFinished.trim()) newErrors.finished = true;
    if (!formToday.trim()) newErrors.today = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newStandup: MockStandup = {
      id: 'visitor-standup',
      memberName: formName.trim() || 'Guest Member',
      initials: formName.trim() ? formName.trim().substring(0, 2).toUpperCase() : 'GM',
      mood: formMood,
      finished: formFinished.trim(),
      today: formToday.trim(),
      blocker: formBlocker.trim() || undefined,
      createdAt: new Date(),
    };

    setStandups((prev) => [...prev, newStandup]);
    setHasCheckedIn(true);
    setSubmitted(true);
  };

  // Floating emoji variants
  const floatingEmojiVariants = (delay: number) => ({
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-subtle">
      {/* Dynamic drifting background blobs for visual depth */}
      <motion.div
        animate={{
          x: [0, 30, -10, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 left-10 sm:left-20 w-64 h-64 rounded-full bg-brand-light/30 blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-40 right-10 sm:right-20 w-80 h-80 rounded-full bg-purple-100/40 blur-3xl -z-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-5 space-y-6 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light border border-brand-subtle text-brand text-xs font-semibold select-none"
            >
              <Sparkles size={12} className="text-brand animate-pulse" />
              Async team alignments
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-[1.1]"
            >
              No meetings.<br />
              <span className="text-brand">Just momentum.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-md"
            >
              Async standups for small teams. Three simple questions, once a day.
              No calendars, interruptions, or time-wasting meetings. Everyone synced.
            </motion.p>

            {/* Interactive Floating Mood Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                How is the team feeling today?
              </p>
              <div className="flex gap-3">
                {MOOD_OPTIONS.map(({ emoji, label }, idx) => (
                  <motion.div
                    key={label}
                    variants={floatingEmojiVariants(idx * 0.45)}
                    animate="animate"
                    whileHover={{ scale: 1.25, rotate: [0, -5, 5, 0] }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="relative group cursor-pointer"
                  >
                    <span
                      role="img"
                      aria-label={label}
                      className="w-12 h-12 rounded-2xl bg-white shadow-sm hover:shadow-md border border-surface-border flex items-center justify-center text-2xl select-none transition-shadow duration-200"
                    >
                      {emoji}
                    </span>
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-ink text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm transition-all duration-150 whitespace-nowrap pointer-events-none">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
              className="pt-2 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/signup"
                className={cn(
                  'inline-flex items-center justify-center gap-1.5',
                  'bg-brand hover:bg-brand-dark text-white',
                  'px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm hover:shadow-md',
                  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                  'transition-all duration-150 min-h-[44px]'
                )}
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className={cn(
                  'inline-flex items-center justify-center',
                  'bg-white border border-surface-border text-ink',
                  'px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm hover:bg-surface-hover',
                  'transition-all duration-150 min-h-[44px]'
                )}
              >
                Sign in
              </Link>
            </motion.div>
          </div>

          {/* INTERACTIVE DEMO WORKSPACE WIDGET */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-7 bg-white/40 backdrop-blur-[4px] rounded-3xl border border-surface-border p-4 sm:p-6 shadow-xl relative noise"
          >
            {/* Widget Header decoration */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-ink-muted font-mono ml-2 truncate max-w-[150px] sm:max-w-none">
                  ◈ seen_sync_dev_team
                </span>
              </div>
              <div className="flex items-center gap-1 bg-brand-light px-2.5 py-0.5 rounded-full border border-brand-subtle text-brand text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                Demo Board
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Tab Navigation and Team Cards List */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <nav className="flex gap-1.5 p-1 bg-zinc-200/50 rounded-xl w-fit">
                    {(['board', 'blockers', 'history'] as const).map((tab) => {
                      const isActive = activeTab === tab;
                      let count: number | null = null;
                      if (tab === 'blockers') {
                        count = standups.filter((s) => s.blocker).length;
                      }

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 capitalize',
                            isActive
                              ? 'bg-white text-ink shadow-sm'
                              : 'text-ink-muted hover:text-ink'
                          )}
                        >
                          {tab}
                          {count !== null && count > 0 && (
                            <span className="ml-1 bg-blocker-light text-blocker text-[9px] px-1.5 py-0.2 rounded-full border border-blocker-border">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tabs display */}
                <div className="min-h-[300px] max-h-[380px] overflow-y-auto pr-1 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {activeTab === 'board' && (
                      <motion.div
                        key="board-tab"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        {standups.map((s) => (
                          <motion.div
                            key={s.id}
                            layoutId={s.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                          >
                            <StandupCard
                              standup={mapToIStandup(s)}
                              currentMemberId="david-id"
                            />
                          </motion.div>
                        ))}

                        {/* If visitor has not checked in, show David's pending card */}
                        {!hasCheckedIn && (
                          <motion.div
                            key="pending-david"
                            layoutId="pending-david"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                          >
                            <PendingCard
                              member={{
                                id: 'david-id',
                                team_id: 'mock-team',
                                name: 'David',
                                joined_at: new Date().toISOString(),
                              }}
                              currentMemberId="david-id"
                              onCheckIn={handlePendingClick}
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'blockers' && (
                      <motion.div
                        key="blockers-tab"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        {standups.filter((s) => s.blocker).length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-ink-muted">
                            <span className="text-5xl mb-2 select-none">◈</span>
                            <p className="text-xs">No active blockers flagged today.</p>
                          </div>
                        ) : (
                          standups
                            .filter((s) => s.blocker)
                            .map((s) => (
                              <motion.div
                                key={`blocker-${s.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <BlockerCard
                                  blocker={mapToIStandup(s)}
                                  currentMemberId="david-id"
                                />
                              </motion.div>
                            ))
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'history' && (
                      <motion.div
                        key="history-tab"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3 text-left"
                      >
                        <div className="border-l-2 border-surface-border pl-4 ml-2 py-2 space-y-6">
                          <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-zinc-400 border border-white" />
                            <h4 className="text-xs font-bold text-ink">Yesterday, June 19</h4>
                            <p className="text-[10px] text-ink-muted mt-0.5">3 check-ins, 0 blockers</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-zinc-400 border border-white" />
                            <h4 className="text-xs font-bold text-ink">Wednesday, June 18</h4>
                            <p className="text-[10px] text-ink-muted mt-0.5">3 check-ins, 1 blocker resolved</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Check-In Widget Form */}
              <div className="md:col-span-5 bg-zinc-50 border border-surface-border rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink mb-1 flex items-center gap-1">
                    Try checking in
                  </h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed mb-4">
                    Submit a mock update to see how the team board updates in real-time.
                  </p>

                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.form
                        key="mock-form"
                        onSubmit={handleMockSubmit}
                        className="space-y-3 text-left"
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Name input */}
                        <div>
                          <label htmlFor="mock-name" className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
                            Your Name
                          </label>
                          <input
                            id="mock-name"
                            type="text"
                            placeholder="David (or your name)"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full border border-surface-border rounded-xl px-3 py-1.5 text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150 min-h-[38px]"
                          />
                        </div>

                        {/* Mood picker */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
                            Mood (Optional)
                          </label>
                          <div className="flex gap-2">
                            {MOOD_OPTIONS.map(({ emoji, label }) => {
                              const isSelected = formMood === emoji;
                              return (
                                <button
                                  key={`picker-${label}`}
                                  type="button"
                                  onClick={() => setFormMood(isSelected ? undefined : emoji)}
                                  className={cn(
                                    'w-8 h-8 rounded-lg text-lg flex items-center justify-center border-2 transition-colors duration-150',
                                    isSelected
                                      ? 'border-brand bg-brand-subtle ring-1 ring-brand'
                                      : 'border-surface-border bg-white hover:border-brand/40'
                                  )}
                                  title={label}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Finished input */}
                        <div>
                          <label htmlFor="mock-finished" className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
                            What did you finish? *
                          </label>
                          <textarea
                            id="mock-finished"
                            rows={2}
                            placeholder="e.g. Completed initial API setup..."
                            value={formFinished}
                            onChange={(e) => {
                              setFormFinished(e.target.value);
                              if (e.target.value.trim()) {
                                setErrors((prev) => ({ ...prev, finished: false }));
                              }
                            }}
                            className={cn(
                              'w-full border rounded-xl px-3 py-2 text-xs text-ink bg-white resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150 min-h-[50px]',
                              errors.finished ? 'border-blocker' : 'border-surface-border'
                            )}
                          />
                          {errors.finished && (
                            <span className="text-[10px] text-blocker">This field is required</span>
                          )}
                        </div>

                        {/* Today input */}
                        <div>
                          <label htmlFor="mock-today" className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
                            What are you working on today? *
                          </label>
                          <textarea
                            id="mock-today"
                            rows={2}
                            placeholder="e.g. Building standard card layout..."
                            value={formToday}
                            onChange={(e) => {
                              setFormToday(e.target.value);
                              if (e.target.value.trim()) {
                                setErrors((prev) => ({ ...prev, today: false }));
                              }
                            }}
                            className={cn(
                              'w-full border rounded-xl px-3 py-2 text-xs text-ink bg-white resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150 min-h-[50px]',
                              errors.today ? 'border-blocker' : 'border-surface-border'
                            )}
                          />
                          {errors.today && (
                            <span className="text-[10px] text-blocker">This field is required</span>
                          )}
                        </div>

                        {/* Blocker input */}
                        <div>
                          <label htmlFor="mock-blocker" className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
                            Blockers (Optional)
                          </label>
                          <input
                            id="mock-blocker"
                            type="text"
                            placeholder="e.g. Waiting on API credentials..."
                            value={formBlocker}
                            onChange={(e) => setFormBlocker(e.target.value)}
                            className="w-full border border-surface-border rounded-xl px-3 py-1.5 text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150 min-h-[38px]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-xl text-xs font-semibold transition-colors duration-150 min-h-[38px] flex items-center justify-center gap-1"
                        >
                          Post to Demo Board
                          <ArrowRight size={12} />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-widget"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center space-y-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-ink">Update Shared!</h4>
                          <p className="text-[11px] text-ink-muted leading-relaxed mt-1">
                            Check the board tab to see your card replacing David&apos;s pending status.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setFormFinished('');
                            setFormToday('');
                            setFormBlocker('');
                          }}
                          className="text-[10px] font-semibold text-brand hover:text-brand-dark hover:underline"
                        >
                          Submit another update
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* VALUE PROPOSITION GRID */}
        <section className="space-y-8 pt-10 border-t border-surface-border">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Designed for focus, not meetings.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Ditch the synchronous Zoom calls. Get a clear overview of what&apos;s finished and what&apos;s blocked, entirely async.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Value card 1: Focus Calendar compare */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <h3 className="text-base font-semibold text-ink">Sync Chaos vs. Async Flow</h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Traditional sync meetings fragment focus. Standup lets you log updates in 2 minutes, preserving hours of uninterrupted deep work.
                </p>
              </div>

              {/* Visual mini-comparison */}
              <div className="border border-surface-border rounded-xl p-3 bg-surface-subtle/50 space-y-2">
                <div className="flex items-center justify-between text-[10px] border-b border-surface-border pb-1.5">
                  <span className="font-bold text-ink-muted uppercase">Daily Schedule</span>
                  <span className="text-red-500 font-semibold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Meetings: 1.5h
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px] bg-red-50 border border-red-100 rounded px-2 py-0.5 text-red-700">
                    <span>9:00 AM · Standup Meeting</span>
                    <span>30m</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-emerald-700">
                    <span>9:30 AM · Deep Focus Workspace</span>
                    <span>4.5h</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] bg-red-50 border border-red-100 rounded px-2 py-0.5 text-red-700">
                    <span>2:30 PM · Blocker Catchup Sync</span>
                    <span>45m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Value card 2: Spot blockers instantly */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blocker-light text-blocker flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-base font-semibold text-ink">Spot Blockers Instantly</h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Issues are surfaced in a dedicated, high-priority feed. No need to dig through chat logs or wait for the next sync meeting.
                </p>
              </div>

              {/* Blocker alert visual */}
              <div className="border border-blocker-border rounded-xl p-3 bg-blocker-light/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-blocker-light text-blocker text-[9px] font-bold rounded-full border border-blocker-border uppercase tracking-wider">
                    <AlertTriangle size={8} />
                    Active Blocker
                  </span>
                  <span className="text-[9px] text-ink-muted font-medium">just now</span>
                </div>
                <p className="text-xs text-ink font-semibold">David is blocked:</p>
                <p className="text-[10px] text-blocker leading-relaxed">
                  &ldquo;Awaiting manager credentials approval for final deployment release.&rdquo;
                </p>
              </div>
            </div>

            {/* Value card 3: Timezone reset scoping */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-success flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-semibold text-ink">Grounded in Team Time</h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Automatic timezone detection aligned with Philippine Time (UTC+8) or local team scope. Daily boards reset clearly at midnight.
                </p>
              </div>

              {/* Timezone badge visual */}
              <div className="border border-surface-border rounded-xl p-3 bg-surface-subtle/50 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-ink-muted">Timezone scope</span>
                  <span className="font-mono text-zinc-600 bg-zinc-200/60 px-1.5 py-0.5 rounded">UTC+08:00</span>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-ink-soft">Board resets in:</span>
                  <span className="text-brand font-mono font-bold">11h 15m</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand h-full w-[53%]" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="bg-brand-light rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center space-y-6 noise border border-brand-subtle">
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Ready to unblock your team?
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
              Create a team in 10 seconds, share the short code with your team, and start async standups today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 relative z-10 max-w-sm mx-auto">
            <Link
              href="/signup"
              className={cn(
                'inline-flex items-center justify-center gap-1.5',
                'bg-brand hover:bg-brand-dark text-white',
                'px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm w-full',
                'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                'transition-all duration-150 min-h-[44px]'
              )}
            >
              Sign up free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className={cn(
                'inline-flex items-center justify-center',
                'bg-white border border-surface-border text-ink',
                'px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm hover:bg-surface-hover w-full',
                'transition-all duration-150 min-h-[44px]'
              )}
            >
              Log in
            </Link>
          </div>
        </section>

        <footer className="text-center pb-8 border-t border-surface-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} ◈ standup. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <Lock size={12} className="text-ink-faint" />
              Secure Team Spaces
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} className="text-ink-faint" />
              Async Alignment
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
