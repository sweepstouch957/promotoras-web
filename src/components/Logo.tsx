import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  let width = 120;
  let height = 120;

  switch (size) {
    case 'small':
      width = 80;
      height = 80;
      break;
    case 'medium':
      width = 120;
      height = 120;
      break;
    case 'large':
      width = 160;
      height = 160;
      break;
    default:
      break;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Image
        src="/logo.png"
        alt="SweepsTouch Logo"
        width={width}
        height={height}
        priority
      />
    </Box>
  );
};

export default Logo;

