import { Suspense } from 'react';
import SignupClient from './SignupClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-subtle" />}>
      <SignupClient />
    </Suspense>
  );
}
