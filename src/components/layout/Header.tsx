'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, profileName, loading, signOut } = useAuth();

  const homeHref = user ? '/dashboard' : '/';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-surface-border">
      <div className="h-0.5 w-full bg-gradient-to-r from-brand via-purple-400 to-brand-dark" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href={homeHref}
          id="header-logo"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity duration-150"
          aria-label="Standup home"
        >
          <span className="text-brand mr-1" aria-hidden="true">◈</span>
          <span className="text-ink">standup</span>
        </Link>

        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                {profileName && (
                  <span className="text-sm text-ink-muted hidden sm:block truncate max-w-[120px]">
                    {profileName}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className={cn(
                    'bg-transparent border border-surface-border text-ink',
                    'px-3 py-1.5 rounded-xl text-sm font-medium',
                    'hover:bg-surface-hover transition-colors duration-150 min-h-[44px]'
                  )}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'text-sm font-medium text-brand hover:text-brand-dark',
                  'transition-colors duration-150 min-h-[44px] flex items-center'
                )}
              >
                Sign in
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
