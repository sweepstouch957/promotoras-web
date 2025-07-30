'use client';

import { Box, Typography, Avatar } from '@mui/material';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Avatar
    sx={{
      width: 40,
      height: 40,
      bgcolor: 'white',
      mx: 1,
      zIndex: 1,
    }}
  >
    {children}
  </Avatar>
);

const Circle = () => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      backgroundColor: '#B6A8B1',
      mx: 1,
      zIndex: 1,
    }}
  />
);

const Line = ({ color, left }: { color: string; left: string }) => (
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left,
      width: '48px',
      height: '4px',
      backgroundColor: color,
      zIndex: 0,
      transform: 'translateY(-50%)',
    }}
  />
);

export default function TurnosCompletados() {
  return (
    <Box
      sx={{
        borderRadius: '24px',
        backgroundColor: '#F1F1F1',
        padding: '24px',
        width: '100%',
        maxWidth: '360px',
        height: '150px',
        position: 'relative',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Línea + Íconos */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Line color="#ff0aa2" left="calc(50% - 66px)" />
        <Line color="#B6A8B1" left="calc(50% + 6px)" />

        <IconWrapper>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0aa2">
            <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
          </svg>
        </IconWrapper>

        <IconWrapper>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0aa2">
            <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
          </svg>
        </IconWrapper>

        <Circle />
      </Box>

      {/* Texto */}
      <Box>
        <Typography sx={{ fontWeight: '600', fontSize: '16px', color: '#000' }}>
          Turnos Completados
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#5e5e5e', mt: '2px' }}>
          Turnos finalizados exitosamente
        </Typography>
      </Box>

      {/* Número */}
      <Box sx={{ position: 'absolute', right: 24, bottom: 16 }}>
        <Typography sx={{ fontWeight: '700', fontSize: '34px', color: '#000' }}>
          2
        </Typography>
      </Box>
    </Box>
  );
}
