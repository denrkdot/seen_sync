import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { JoinCreateForm } from '@/components/team/JoinCreateForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <section className="relative bg-brand-light overflow-hidden rounded-2xl p-8 sm:p-12 noise">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-brand text-4xl sm:text-5xl font-bold leading-none" aria-hidden="true">
                ◈
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
              No meetings.<br />Just momentum.
            </h1>
            <p className="text-base text-ink-soft max-w-md leading-relaxed">
              Async standups for small teams. Three questions, once a day.
              Everyone stays in sync — no calendar required.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { emoji: '😊', label: 'Good' },
                { emoji: '😐', label: 'Okay' },
                { emoji: '😤', label: 'Frustrated' },
                { emoji: '😴', label: 'Tired' },
                { emoji: '🔥', label: 'Fired up' },
              ].map(({ emoji, label }) => (
                <span
                  key={label}
                  role="img"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-xl shadow-sm select-none"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Join / Create */}
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        }>
          <JoinCreateForm />
        </Suspense>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-xs text-ink-faint">
            No accounts. No meetings. No friction.
          </p>
        </footer>
      </div>
    </div>
  );
}
