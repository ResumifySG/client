// src/components/ResumeCard.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { purple } from '@mui/material/colors';
import { grid, styled } from '@mui/system';
import { Copy as CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Resume {
  _id: string;
  firstName: string;
  lastName: string;
  wantedJobTitle: string;
  imageBase64: string;
  updatedAt?: string; // Added optional updatedAt property
  createdAt?: string; // Added optional createdAt property
}

interface ResumeCardProps {
  resume: Resume;
  onDelete: (resumeId: string) => void;
  onDownload: (resumeId: string) => void;
  index: number;
}

const formattedDate = (date: string | undefined): string =>
  date ? format(new Date(date), 'PPPpp') : 'None';

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onDelete, onDownload, index }) => {
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResumeScore = async () => {
      try {
        const response = await fetch('https://resumify-backend.onrender.com/api/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume_id: resume._id }),
        });

        if (response.ok) {
          const data = await response.json();
          setScore(data.score);
        } else {
          console.error('Error fetching resume score:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching resume score:', error);
      }
    };

    fetchResumeScore();
  }, [resume._id]);

  const onDuplicate = async (resumeId: string) => {
    try {
      const response = await fetch(`https://resumify-backend.onrender.com/api/resume/duplicate/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newResumeId = data.id;
        router.push(`/dashboard/resume/${newResumeId}`);
      } else {
        console.error('Error duplicating resume:', response.statusText);
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
    }
  };

  return (
    <Card
      sx={{
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      <Grid container>
        <Grid xs={5} p={1}>
          <CardMedia
            alt="Resume Preview"
            component="a"
            href={`/dashboard/resume/${resume._id}`}
            image={resume.imageBase64}
            sx={{
              width: '100%',
              cursor: 'pointer',
              objectFit: 'contain',
              height: 'calc(100% * 0.7067604243770047)', // Set the height based on the aspect ratio
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            }}
          />
        </Grid>
        <Grid xs={7}>
          <CardContent>
            <Stack spacing={3}>
              <Stack spacing={3}>
                <Typography
                  color="primary"
                  variant="subtitle2"
                  sx={{
                    fontWeight: '300',
                  }}
                >
                  RESUME #{1 + index}
                </Typography>
                <Typography variant="h6">
                  {resume.firstName} {resume.lastName}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignItems: 'start',
                }}
                spacing={1}
              >
                <Button color="success" startIcon={<PencilIcon />} href={`/dashboard/resume/${resume._id}`}>
                  <Typography color="textPrimary" variant="body2">
                    Edit
                  </Typography>
                </Button>
                <Button
                  color="success"
                  startIcon={<CopyIcon />}
                  onClick={() => onDuplicate(resume._id)}
                >
                  <Typography color="textPrimary" variant="body2">
                    Duplicate
                  </Typography>
                </Button>
                <Button
                  color="success"
                  onClick={() => {
                    onDownload(resume._id);
                  }}
                  startIcon={<DownloadIcon />}
                >
                  <Typography color="textPrimary" variant="body2">
                    Download
                  </Typography>
                </Button>
                <Button color="error" onClick={() => onDelete(resume._id)} startIcon={<TrashIcon />}>
                  <Typography variant="body2" color="textPrimary">
                    Delete
                  </Typography>
                </Button>
              </Stack>
              <Divider />
              <Stack>
                <Typography variant="overline">
                  Last Edited: {formattedDate(resume.updatedAt)}
                </Typography>
                <Typography variant="overline">
                  Created on: {formattedDate(resume.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ResumeCard;
