'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '@/paths';

function useSegment(): string {
  const pathname = usePathname();

  return pathname.split('/create/')[1] ?? 'allDocuments';
}

export function ProfileTabs(): React.JSX.Element {
  const segment = useSegment();

  return (
    <Tabs sx={{ borderBottom: '1px solid var(--mui-palette-divider)' }} value={segment}>
      <Tab
        component={RouterLink}
        href={paths.create.allDocuments}
        label="All Documents"
        tabIndex={0}
        value="allDocuments" // Corrected to match the default value returned by useSegment
      />
      <Tab
        component={RouterLink}
        disabled
        href={paths.create.allDocuments}
        label="Resumes"
        tabIndex={0}
        value="resumes"
      />
      <Tab
        component={RouterLink}
        disabled
        href={paths.create.allDocuments}
        label="Cover letters (0)"
        tabIndex={0}
        value="coverLetters"
      />
    </Tabs>
  );
}
