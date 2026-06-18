'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', currentUser.id)
          .maybeSingle();
        setProfileName(profile?.name ?? currentUser.user_metadata?.name as string ?? null);
      }

      setLoading(false);
    };

    void init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileName(null);
    router.push('/');
    router.refresh();
  }, [supabase, router]);

  return { user, profileName, loading, signOut };
}
