'use client';
import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Skeleton } from '@mui/material';

interface GanciasTotalesProps {
  total: number;
  loading?: boolean;
}

export default function GananciasTotales({ total, loading = false }: GanciasTotalesProps) {
  // Formatear el total como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        mb: 3,
        mx: 2,
        background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        {/* Patrón decorativo de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -15,
            left: -15,
            width: 50,
            height: 50,
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
              Ganancias Totales
            </Typography>
            {loading ? (
              <Skeleton 
                variant="text" 
                width={80} 
                height={40} 
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  lineHeight: 1,
                }}
              >
                {formatCurrency(total)}
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
                  💰
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
            Total acumulado de comisiones
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
                {total > 0 ? 'Activo' : 'Sin ganancias'}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
