import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local.');
}

// Browser client — used in hooks and client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client factory — same config for MVP (no auth)
// If auth is added later, swap for @supabase/ssr server client
export const createServerClient = () => createClient(supabaseUrl, supabaseAnonKey);
