import { AlertTriangle } from 'lucide-react';

export function BlockerBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blocker-light text-blocker text-xs font-semibold rounded-full border border-blocker-border uppercase tracking-wide">
      <AlertTriangle size={10} aria-hidden="true" />
      Blocker
    </span>
  );
}
