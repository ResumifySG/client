// ExampleGrid.tsx

import React, { useState } from 'react';
import { Grid, ListItemButton, ListItemText, Typography, Box, Divider, TextField, InputAdornment, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateResumeButton from './CreateResumeButton';

interface Example {
  id: string;
  title: string;
}

interface ExampleGridProps {
  examples: Example[];
  selectedExampleId: string;
  onExampleClick: (example: Example) => void;
  loading: boolean;
}

export default function ExampleGrid({ examples, selectedExampleId, onExampleClick, loading }: ExampleGridProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredExamples = examples.filter((example) =>
    example.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F4F2F7',
        paddingY: '32px',
        paddingX: '5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Search Resume Examples
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: '24px', color: '#222' }}>
        Explore our collection of resume examples to find the perfect template for your needs.
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search..."
        sx={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          marginBottom: '24px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
          borderRadius: '8px'
        }}
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={1} sx={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item sm={12} md={6} key={index}>
                <Skeleton variant="rectangular" width="100%" height={'36px'} sx={{ borderRadius: '3px' }} />
              </Grid>
            ))
          : filteredExamples.map((example) => (
              <Grid item sm={12} md={6} key={example.id}>
                <ListItemButton
                  selected={selectedExampleId === example.id}
                  onClick={() => onExampleClick(example)}
                  sx={{
                    borderRadius: '3px',
                    backgroundColor: '#ffffff',
                    border: '1px solid transparent',
                    width: '100%',
                    textAlign: 'center',
                    '&.Mui-selected': {
                      border: '1px solid #d1c4e9',
                      '&:hover': {
                        border: '1px solid #b39ddb',
                      },
                    },
                    '&:hover': {
                      border: '1px solid #ede7f6',
                    },
                  }}
                >
                  <ListItemText primary={example.title} sx={{ color: '#AAA' }} />
                </ListItemButton>
              </Grid>
            ))}
      </Grid>
      <Divider sx={{ width: '100%', marginY: '32px' }} />
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
          padding: '24px',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Prefer a Blank Slate?
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ marginBottom: '24px' }}>
          Start from scratch and build your resume step-by-step.
        </Typography>
        <CreateResumeButton />
      </Box>
    </Box>
  );
}
