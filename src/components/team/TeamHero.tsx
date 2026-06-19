'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TeamHeroProps {
  teamName?: string;
  teamCode: string;
  dateLabel?: string;
}

export function TeamHero({ teamName, teamCode, dateLabel }: TeamHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-4">
      {/* Team name — plain div, no motion to avoid re-animation on tab switch */}
      <div>
        {teamName ? (
          <h1 className="text-2xl font-bold tracking-tight text-ink mb-1.5">
            {teamName}
          </h1>
        ) : (
          <div className="h-8 w-48 bg-surface-subtle rounded-lg animate-pulse mb-1.5" />
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Copy code button */}
        <button
          id="copy-team-code"
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : `Copy team code ${teamCode}`}
          title={copied ? 'Copied!' : 'Copy team code'}
          className={cn(
            'group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1',
            'border transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            'text-xs font-medium',
            copied
              ? 'border-success/30 bg-success-light text-success'
              : 'border-surface-border bg-surface-subtle text-ink-muted hover:border-brand/40 hover:bg-brand-light hover:text-brand'
          )}
        >
          <span className="font-mono font-semibold tracking-widest uppercase leading-none text-xs">
            {teamCode}
          </span>
          <span className="transition-transform duration-150 group-hover:scale-110">
            {copied
              ? <Check size={11} aria-hidden="true" />
              : <Copy size={11} aria-hidden="true" />
            }
          </span>
        </button>

        {/* Date label */}
        {dateLabel && (
          <>
            <span className="text-ink-faint text-xs" aria-hidden="true">·</span>
            <span className="text-xs text-ink-muted">{dateLabel}</span>
          </>
        )}
      </div>
    </div>
  );
}
