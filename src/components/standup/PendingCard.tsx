import { Clock } from 'lucide-react';
import type { IMember } from '@/types/team';

interface PendingCardProps {
  member: IMember;
}

export function PendingCard({ member }: PendingCardProps) {
  return (
    <article className="bg-pending-light border border-dashed border-pending-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-[160px]">
      <div className="w-8 h-8 rounded-full bg-pending-border flex items-center justify-center">
        <Clock size={16} className="text-pending" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-ink">{member.name}</p>
      <p className="text-xs text-ink-muted">Hasn&apos;t checked in yet</p>
    </article>
  );
}
