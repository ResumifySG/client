import React from 'react';
import { Box } from '@mui/material';

const GradientText = ({ children, style }) => {
  const defaultStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline' // Ensures it behaves like a span
  };

  return (
    <Box component="span" sx={{ ...defaultStyle, ...style }}>
      {children}
    </Box>
  );
};

export default GradientText;