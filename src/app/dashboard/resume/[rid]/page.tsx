/* eslint-disable */

'use client';

import * as React from 'react';
import { useContext } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';

import { DataContext } from '@/contexts/data';
import Chatbot from '@/components/chatbot/button';

export default function Page(): React.JSX.Element {
  const { rid } = useParams();
  const { data, currentRid, setCurrentRid, fetchInitData } = useContext(DataContext);

  const images = data?.images || [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const canvasRefs = React.useRef<(HTMLCanvasElement | null)[]>([]);

  React.useEffect(() => {
    fetchInitData(rid);
  }, []);

  React.useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, images.length);
  }, [images.length]);

  React.useEffect(() => {
    images.forEach((imgSrc: any, index: any) => {
      drawImageOnCanvas(index, imgSrc);
    });
  }, [images]);

  const drawImageOnCanvas = (index: number, imgSrc: string) => {
    const canvas = canvasRefs.current[index];
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      // Convert base64 to blob and then to object URL
      const fetchBlob = async (base64: string) => {
        const response = await fetch(`data:image/jpeg;base64,${base64}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      };

      fetchBlob(imgSrc)
        .then((objectUrl) => {
          const image = new Image();
          image.onload = () => {
            context.clearRect(0, 0, canvas?.width, canvas?.height);
            context.drawImage(image, 0, 0, canvas?.width, canvas?.height);
            URL.revokeObjectURL(objectUrl); // Clean up memory after image is loaded
          };
          image.src = objectUrl;
        })
        .catch(console.error);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : images.length - 1);
  };

  const downloadPDF = () => {
    window.open(`https://resumify-backend.onrender.com/api/resume/download/${currentRid}`, '_blank');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        height: '100%',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
        <Button onClick={downloadPDF} variant="contained" startIcon={<GetAppIcon />}>
          Download PDF
        </Button>
      </Stack>
      <Box
        sx={{
          flex: '1',
          border: '1px solid var(--mui-palette-divider)',
          m: 4,
          display: 'flex',
          background: '#656E83',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {images.length > 0 ? (
          images.map((_: any, index: any) => (
            <Box
              key={index}
              sx={{
                border: '1px solid var(--mui-palette-divider)',
                m: 4,
                overflow: 'hidden',
                display: currentIndex === index ? 'block' : 'none', // Only display the canvas if it's the current one
              }}
            >
              <canvas
                ref={(el) => (canvasRefs.current[index] = el)}
                width={600}
                height={900}
                style={{ minWidth: '600px', minHeight: '900px' }}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              border: '1px solid var(--mui-palette-divider)',
              m: 4,
              overflow: 'hidden',
              display: 'block', // Only display the canvas if it's the current one
            }}
          >
            <canvas width={600} height={900} style={{ minWidth: '600px', minHeight: '900px' }} />
          </Box>
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1}>
          <IconButton onClick={goToPrevious} aria-label="Previous page" disabled={currentIndex === 0}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={goToNext} aria-label="Next page" disabled={currentIndex === images.length - 1}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
        <IconButton aria-label="Save">
          <CloudDoneIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
