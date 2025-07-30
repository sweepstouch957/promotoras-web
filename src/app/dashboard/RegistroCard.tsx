'use client';

import { Box, Typography, Avatar } from '@mui/material';

export default function RegistroCard({ total = 5 }) {
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
        {/* Línea rosa entre íconos 1 y 2 */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 'calc(50% - 66px)',
            width: '48px',
            height: '4px',
            backgroundColor: '#ff0aa2',
            zIndex: 0,
            transform: 'translateY(-50%)',
          }}
        />

        {/* Línea morada entre ícono 2 y el círculo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 'calc(50% + 6px)',
            width: '48px',
            height: '4px',
            backgroundColor: '#B6A8B1',
            zIndex: 0,
            transform: 'translateY(-50%)',
          }}
        />

        {/* Ícono 1 */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'white',
            mx: 1,
            zIndex: 1,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#ff0aa2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </Avatar>

        {/* Ícono 2 */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'white',
            mx: 1,
            zIndex: 1,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#ff0aa2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </Avatar>

        {/* Círculo gris (no Avatar) */}
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
      </Box>

      {/* Texto */}
      <Box>
        <Typography sx={{ fontWeight: '600', fontSize: '16px', color: '#000' }}>
          Total Registros
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#5e5e5e', mt: '2px' }}>
          Números registrados en total
        </Typography>
      </Box>

      {/* Número */}
      <Box sx={{ position: 'absolute', right: 24, bottom: 16 }}>
        <Typography sx={{ fontWeight: '700', fontSize: '34px', color: '#000' }}>
          {total}
        </Typography>
      </Box>
    </Box>
  );
}
