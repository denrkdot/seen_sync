'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { loginSchema, type LoginInput } from '@/validators/auth.schema';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const inputClass = cn(
  'w-full border border-surface-border rounded-xl',
  'px-4 py-3 text-base text-ink bg-white',
  'placeholder:text-ink-faint',
  'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
  'transition-colors duration-150 min-h-[44px]'
);

const btnClass = cn(
  'w-full bg-brand hover:bg-brand-dark text-white',
  'px-5 py-2.5 rounded-xl text-sm font-semibold',
  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
  'transition-colors duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'
);

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Welcome back!');
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error('Something went wrong — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-ink mb-1">Sign in</h1>
          <p className="text-sm text-ink-muted mb-6">Welcome back to Standup.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register('email')}
                className={cn(inputClass, errors.email && 'border-blocker')}
              />
              {errors.email && <p className="text-xs text-blocker mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={cn(inputClass, errors.password && 'border-blocker')}
              />
              {errors.password && <p className="text-xs text-blocker mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
