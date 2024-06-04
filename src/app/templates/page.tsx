'use client';

import React from 'react';
import { Box } from '@mui/material';
import ResumeExamples from '@/components/dashboard/templates/ResumeExamples';

export default function ResumeExamplesPage(): React.JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResumeExamples />
    </Box>
  );
}