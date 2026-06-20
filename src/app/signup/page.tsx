'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { signupSchema, type SignupInput } from '@/validators/auth.schema';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-surface-subtle overflow-hidden relative flex flex-col">
      <Header />

      {/* Drifting background blobs */}
      <motion.div
        animate={{
          x: [0, -30, 10, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-24 right-10 sm:right-20 w-72 h-72 rounded-full bg-brand-light/40 blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-16 left-10 sm:left-20 w-80 h-80 rounded-full bg-purple-100/40 blur-3xl -z-10 pointer-events-none"
      />

      {/* Workspace Grid & Content Wrapper */}
      <div className="flex-1 dot-grid relative flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-subtle via-transparent to-surface-subtle pointer-events-none -z-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-surface-border shadow-xl relative noise overflow-hidden"
        >
          {/* Brand Mark and Form Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-12 h-12 flex items-center justify-center select-none cursor-pointer mb-3"
            >
              <Image
                src="/logo.svg"
                alt="Standup Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight text-ink">Create account</h1>
            <p className="text-sm text-ink-muted mt-1">Get started with async standups.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Your name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint w-5 h-5 flex items-center justify-center">
                  <User size={16} />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Chen"
                  {...register('name')}
                  className={cn(
                    'w-full border border-surface-border rounded-xl',
                    'pl-10 pr-4 py-3 text-base text-ink bg-white/50 backdrop-blur-sm',
                    'placeholder:text-ink-faint',
                    'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white',
                    'transition-all duration-150 min-h-[44px]',
                    errors.name && 'border-blocker focus:ring-blocker/20 focus:border-blocker'
                  )}
                />
              </div>
              {errors.name && <p className="text-xs text-blocker mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint w-5 h-5 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={cn(
                    'w-full border border-surface-border rounded-xl',
                    'pl-10 pr-4 py-3 text-base text-ink bg-white/50 backdrop-blur-sm',
                    'placeholder:text-ink-faint',
                    'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white',
                    'transition-all duration-150 min-h-[44px]',
                    errors.email && 'border-blocker focus:ring-blocker/20 focus:border-blocker'
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-blocker mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint w-5 h-5 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  {...register('password')}
                  className={cn(
                    'w-full border border-surface-border rounded-xl',
                    'pl-10 pr-10 py-3 text-base text-ink bg-white/50 backdrop-blur-sm',
                    'placeholder:text-ink-faint',
                    'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white',
                    'transition-all duration-150 min-h-[44px]',
                    errors.password && 'border-blocker focus:ring-blocker/20 focus:border-blocker'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-blocker mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'w-full bg-brand hover:bg-brand-dark text-white',
                'px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md',
                'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
                'flex items-center justify-center gap-1.5'
              )}
            >
              {loading ? (
                'Creating account…'
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
