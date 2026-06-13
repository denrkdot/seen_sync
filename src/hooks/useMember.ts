'use client';
import { useState, useEffect } from 'react';
import type { IMember } from '@/types/team';

const KEY = 'standup_member';

export function useMember() {
  const [member, setMemberState] = useState<IMember | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setMemberState(JSON.parse(stored) as IMember);
    } catch {
      localStorage.removeItem(KEY);
    }
  }, []);

  const saveMember = (m: IMember) => {
    localStorage.setItem(KEY, JSON.stringify(m));
    setMemberState(m);
  };

  const clearMember = () => {
    localStorage.removeItem(KEY);
    setMemberState(null);
  };

  return { member, saveMember, clearMember };
}
