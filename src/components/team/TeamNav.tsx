'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TeamNavProps {
  code: string;
}

interface NavItem {
  label: string;
  href: string;
  id: string;
}

export function TeamNav({ code }: TeamNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Board', href: `/team/${code}`, id: 'nav-board' },
    { label: 'Blockers', href: `/team/${code}/blockers`, id: 'nav-blockers' },
    { label: 'History', href: `/team/${code}/history`, id: 'nav-history' },
  ];

  // Exact match for board, prefix match for others
  const isActive = (href: string) => {
    if (href === `/team/${code}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="flex gap-2 p-1 bg-surface-subtle rounded-xl w-fit"
      aria-label="Team navigation"
    >
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          id={item.id}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
            isActive(item.href)
              ? 'bg-white text-ink shadow-sm'
              : 'text-ink-muted hover:text-ink'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
