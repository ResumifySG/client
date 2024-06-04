// src/components/CreateResumeButton.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

export function CreateResumeButton(): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const redirectToTemplates = () => {
    setLoading(true);
    router.push('/templates');
  };

  return (
    <Button
      color="primary"
      onClick={redirectToTemplates}
      size="small"
      startIcon={!loading && <PlusIcon />}
      variant="contained"
      disabled={loading}
      sx={{
        '&.Mui-disabled': {
          backgroundColor: '#cccccc', // Gray out the button when disabled
        },
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : ''} Create New Resume
    </Button>
  );
}

export default CreateResumeButton;
