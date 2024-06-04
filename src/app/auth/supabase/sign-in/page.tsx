import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { CenteredLayout } from '@/components/auth/centered-layout';
import { SignInForm } from '@/components/auth/supabase/sign-in-form';

export const metadata: Metadata = { title: `Sign in | Supabase | Auth | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <CenteredLayout>
        <SignInForm />
      </CenteredLayout>
    </GuestGuard>
  );
}
