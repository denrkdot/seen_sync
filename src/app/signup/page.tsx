'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { signupSchema, type SignupInput } from '@/validators/auth.schema';
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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (authData.session) {
        toast.success('Account created! Welcome to Standup.');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.success('Check your email to confirm your account.');
        router.push('/login');
      }
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
          <h1 className="text-xl font-semibold tracking-tight text-ink mb-1">Create account</h1>
          <p className="text-sm text-ink-muted mb-6">Get started with async standups.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Your name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Alex Chen"
                {...register('name')}
                className={cn(inputClass, errors.name && 'border-blocker')}
              />
              {errors.name && <p className="text-xs text-blocker mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register('email')}
                className={cn(inputClass, errors.email && 'border-blocker')}
              />
              {errors.email && <p className="text-xs text-blocker mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                {...register('password')}
                className={cn(inputClass, errors.password && 'border-blocker')}
              />
              {errors.password && <p className="text-xs text-blocker mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
