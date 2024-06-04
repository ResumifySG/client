import * as React from 'react';
import Box from '@mui/material/Box';

const icons: Record<string, string> = {
  jpeg: '/static/assets/icon-jpg.svg',
  jpg: '/static/assets/icon-jpg.svg',
  mp4: '/static/assets/icon-mp4.svg',
  pdf: '/static/assets/icon-pdf.svg',
  png: '/static/assets/icon-png.svg',
  svg: '/static/assets/icon-svg.svg',
};

export interface FileIconProps {
  extension?: string;
}

export function FileIcon({ extension }: FileIconProps): React.JSX.Element {
  let icon: string;

  if (!extension) {
    icon = '/static/assets/icon-other.svg';
  } else {
    icon = icons[extension] ?? '/static/assets/icon-other.svg';
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
      }}
    >
      <Box alt="File" component="img" src={icon} sx={{ height: '100%', width: 'auto' }} />
    </Box>
  );
}
