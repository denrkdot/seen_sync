import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { getSessionUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className={cn(
                  'inline-flex items-center justify-center',
                  'bg-brand hover:bg-brand-dark text-white',
                  'px-5 py-2.5 rounded-xl text-sm font-semibold',
                  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                  'transition-colors duration-150 min-h-[44px]'
                )}
              >
                Get started
              </Link>
              <Link
                href="/login"
                className={cn(
                  'inline-flex items-center justify-center',
                  'bg-transparent border border-surface-border text-ink',
                  'px-5 py-2.5 rounded-xl text-sm font-medium',
                  'hover:bg-surface-hover transition-colors duration-150 min-h-[44px]'
                )}
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <footer className="text-center pb-8">
          <p className="text-xs text-ink-faint">
            Your teams, one dashboard. Check in once a day.
          </p>
        </footer>
      </div>
    </div>
  );
}
