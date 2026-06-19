import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { LandingClient } from '@/components/layout/LandingClient';
import { getSessionUser } from '@/lib/auth';

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />
      <LandingClient />
    </div>
  );
}
