import Link from 'next/link';

interface HeaderProps {
  teamName?: string;
  teamCode?: string;
}

export function Header({ teamName, teamCode }: HeaderProps) {
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

        {/* Team chip — only shown on team pages */}
        {teamName && teamCode && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-muted hidden sm:block truncate max-w-[160px]">
              {teamName}
            </span>
            <span className="font-mono text-sm font-semibold tracking-widest uppercase bg-surface-subtle px-2 py-1 rounded-md text-ink-soft">
              {teamCode}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
