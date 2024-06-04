// src/components/Dashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Skeleton, Typography } from '@mui/material';
import { useSnackbar, VariantType } from 'notistack';

import CreateResumeButton from './CreateResumeButton';
import ResumeCard from './ResumeCard';

interface Resume {
  _id: string;
  firstName: string;
  lastName: string;
  wantedJobTitle: string;
  imageBase64: string;
  score: string;
}

export default function Page(): React.JSX.Element {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('https://resumify-backend.onrender.com/api/resumes');
      const data = await response.json();
      const resumesWithImages = await Promise.all(
        data.map(async (resume: Resume) => {
          const imageResponse = await fetch(`https://resumify-backend.onrender.com/api/resume/preview/${resume._id}`);
          const imageData = await imageResponse.json();
          const imageBase64 =
            imageData.images && imageData.images.length > 0
              ? `data:image/jpeg;base64,${imageData.images[0]}`
              : '/static/assets/resume-placeholder.png';
          return { ...resume, imageBase64 };
        })
      );
      setResumes(resumesWithImages);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (resumeId: string) => {
    setResumeToDelete(resumeId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setResumeToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDownloadResume = (rid: string) => {
    window.open(`https://resumify-backend.onrender.com/api/resume/download/${rid}`, '_blank');
  };

  const handleDeleteResume = async () => {
    if (resumeToDelete) {
      try {
        const response = await fetch(`https://resumify-backend.onrender.com/api/resume/${resumeToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setResumes(resumes.filter((resume) => resume._id !== resumeToDelete));
          enqueueSnackbar('Resume deleted successfully.', { variant: 'success' as VariantType });
        } else {
          throw new Error('Failed to delete the resume.');
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
        enqueueSnackbar('Error deleting resume. Please try again later.', { variant: 'error' as VariantType });
      }
    }
    closeDeleteConfirmation();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ backgroundColor: '#ffffff' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your Existing Resumes
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Edit and customize your resumes to perfection
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {loading ? (
              Array.from(new Array(4)).map((_, index) => (
                <Grid item key={index} xs={12} sm={12} md={6}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              ))
            ) : (
              resumes.map((resume, index: number) => (
                <Grid item key={resume._id} xs={12} sm={12} md={6}>
                  <ResumeCard
                    resume={resume}
                    index={index}
                    onDownload={handleDownloadResume}
                    onDelete={openDeleteConfirmation}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this resume?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteResume} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
