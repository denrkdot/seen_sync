'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  teamName?: string;
  teamCode?: string;
}

export function Header({ teamName, teamCode }: HeaderProps) {
  const { user, profileName, loading, signOut } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!teamCode || copied) return;
    try {
      await navigator.clipboard.writeText(teamCode);
      setCopied(true);
      toast.success('Team code copied!', {
        description: `Share ${teamCode} with your teammates.`,
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — try manually selecting the code.');
    }
  };

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

        <div className="flex items-center gap-3">
          {teamCode && (
            <div className="flex items-center gap-2">
              {teamName && (
                <span className="text-sm text-ink-muted hidden sm:block truncate max-w-[160px]">
                  {teamName}
                </span>
              )}
              <button
                id="copy-team-code"
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : `Copy team code ${teamCode}`}
                title={copied ? 'Copied!' : 'Copy team code'}
                className={cn(
                  'group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5',
                  'border transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                  copied
                    ? 'border-success/30 bg-success-light text-success'
                    : 'border-surface-border bg-surface-subtle text-ink-soft hover:border-brand/40 hover:bg-brand-light hover:text-brand'
                )}
              >
                <span className="font-mono text-sm font-semibold tracking-widest uppercase leading-none">
                  {teamCode}
                </span>
                <span className="transition-transform duration-150 group-hover:scale-110">
                  {copied
                    ? <Check size={13} aria-hidden="true" />
                    : <Copy size={13} aria-hidden="true" />
                  }
                </span>
              </button>
            </div>
          )}

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
