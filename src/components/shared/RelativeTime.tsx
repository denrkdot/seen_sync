'use client';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => setLabel(formatDistanceToNow(new Date(date), { addSuffix: true }));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <time dateTime={date} className="text-xs text-ink-muted whitespace-nowrap">
      {label}
    </time>
  );
}
