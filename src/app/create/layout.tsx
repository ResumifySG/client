import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { ProfileTabs } from '@/components/dashboard/social/profile-tabs';
// import { Footer } from '@/components/marketing/layout/footer';
import { MainNav } from '@/components/marketing/layout/main-nav';

import CreateResumeButton from './CreateResumeButton';

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
              m: 'var(--Content-margin)',
              p: 'var(--Content-padding)',
              width: 'var(--Content-width)',
            }}
          >
            <Container maxWidth="lg">
              <Stack spacing={4}>
                <Stack spacing={4}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <div>
                        <Typography variant="h6">Welcome back! </Typography>
                      </div>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: 'center', display: { md: 'flex', xs: 'none' } }}
                      >
                        <CreateResumeButton />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack spacing={4}>
                  <ProfileTabs />
                  {children}
                </Stack>
              </Stack>
            </Container>
          </Box>
        </main>
        {/* <Footer /> */}
      </div>
    </AuthGuard>
  );
}
