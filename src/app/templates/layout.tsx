// src/components/layout.tsx
'use client';

import * as React from 'react';
import { Box, Container, Stack } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/marketing/layout/main-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '72px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <div>
        <MainNav />
        <main>
          <Box
            sx={{
              maxWidth: 'var(--Content-maxWidth)',
              m: '0',
              p: '0',
              width: 'var(--Content-width)',
            }}
          >
			{children}
          </Box>
        </main>
      </div>
    </AuthGuard>
  );
}