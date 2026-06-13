'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HeaderProps {
  teamName?: string;
  teamCode?: string;
}

export function Header({ teamName, teamCode }: HeaderProps) {
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-surface-border">
      {/* Gradient strip — 2px signature element */}
      <div className="h-0.5 w-full bg-gradient-to-r from-brand via-purple-400 to-brand-dark" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          id="header-logo"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity duration-150"
          aria-label="Standup home"
        >
          <span className="text-brand mr-1" aria-hidden="true">◈</span>
          <span className="text-ink">standup</span>
        </Link>

        {/* Team chip — shown whenever teamCode is present */}
        {teamCode && (
          <div className="flex items-center gap-2">
            {/* Team name — hidden on small screens */}
            {teamName && (
              <span className="text-sm text-ink-muted hidden sm:block truncate max-w-[160px]">
                {teamName}
              </span>
            )}

            {/* Code + copy button */}
            <button
              id="copy-team-code"
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : `Copy team code ${teamCode}`}
              title={copied ? 'Copied!' : 'Copy team code'}
              className={cn(
                'group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5',
                'border transition-all duration-150',
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
      </div>
    </header>
  );
}
