'use client';
import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Skeleton } from '@mui/material';

interface TurnosCompletadosProps {
  completed: number;
  loading?: boolean;
}

export default function TurnosCompletados({ completed, loading = false }: TurnosCompletadosProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        mb: 3,
        mx: 2,
        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        {/* Patrón decorativo de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -15,
            right: -15,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -25,
            left: -25,
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: '14px',
                fontWeight: 500,
                mb: 1,
              }}
            >
              Turnos Completados
            </Typography>
            {loading ? (
              <Skeleton 
                variant="text" 
                width={60} 
                height={40} 
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                }}
              >
                {completed}
              </Typography>
            )}
          </Box>

          <Box>
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            ) : (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ✅
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.8,
              fontSize: '12px',
            }}
          >
            Turnos finalizados exitosamente
          </Typography>
          
          {!loading && (
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {completed > 0 ? `${completed} completados` : 'Sin completar'}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
