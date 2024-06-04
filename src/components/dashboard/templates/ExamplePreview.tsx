// ExamplePreview.tsx

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, Skeleton } from '@mui/material';

interface ExamplePreviewProps {
  selectedExample: {
    id: string;
    title: string;
  } | null;
  loading: boolean;
}

export default function ExamplePreview({ selectedExample, loading }: ExamplePreviewProps): React.JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedExample) {
        setPreviewUrl(null);
        return;
      }

      setPreviewLoading(true);

      try {
        const response = await fetch(`https://resumify-backend.onrender.com/api/example/preview/${selectedExample.id}`);
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          // Prepend data URI scheme to the base64 string
          setPreviewUrl(`data:image/jpeg;base64,${data.images[0]}`); // Assuming the first image is the preview and it's in JPEG format
        } else {
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Error fetching example preview:', error);
        setPreviewUrl(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchPreview();
  }, [selectedExample]);

  const handleUseThisResume = async () => {
    if (!selectedExample?.id) return;

    setButtonLoading(true);

    try {
      const response = await fetch(`https://resumify-backend.onrender.com/api/example/use/${selectedExample.id}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.id) {
        window.location.href = `/dashboard/resume/${data.id}`;
      }
    } catch (error) {
      console.error('Error using example resume:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: '16px' }}>Loading...</Typography>
      </Box>
    );
  }

  if (!selectedExample) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6">Select a resume example to preview</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Resume Preview
      </Typography>
      {previewLoading ? (
        <Skeleton variant="rectangular" width="100%" height="500px" sx={{ maxWidth: '500px', borderRadius: '2px', marginBottom: '16px' }} />
      ) : (
        previewUrl ? (
          <img src={previewUrl} alt="Resume Preview" style={{ width: '100%', maxWidth: '500px', borderRadius: '2px', marginBottom: '16px' }} />
        ) : (
          <Typography variant="h6" color="error">Preview not available</Typography>
        )
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none' }}
        onClick={handleUseThisResume}
        disabled={buttonLoading}
      >
        {buttonLoading ? <CircularProgress size={24} color="inherit" /> : ''} Use this resume
      </Button>
    </Box>
  );
}
