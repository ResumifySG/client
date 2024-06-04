'use client';

// src/components/CreateResumeButton.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useSnackbar, VariantType } from 'notistack';

export function CreateResumeButton(): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const createResume = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://resumify-backend.onrender.com/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/dashboard/resume/${data.id}`);
      } else {
        console.error('Failed to create a new resume:', data);
        enqueueSnackbar('Error creating resume. Please try again.', { variant: 'error' as VariantType });
        setLoading(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      enqueueSnackbar('Network error. Please check your connection and try again.', {
        variant: 'error' as VariantType,
      });
    }
  };

  return (
    <Button
      color="primary"
      disabled={loading}
      onClick={createResume}
      size="small"
      startIcon={loading ? <CircularProgress color="inherit" size={24} /> : <PlusIcon />}
      variant="contained"
    >
      {loading ? 'Creating...' : 'Create from scratch'}
    </Button>
  );
}

export default CreateResumeButton;
