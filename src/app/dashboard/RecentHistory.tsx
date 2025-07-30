'use client';
import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Skeleton } from '@mui/material';
import { Shift } from '../../types';

interface RecentHistoryProps {
  loading: boolean;
  recentShifts: Shift[];
}

export default function RecentHistory({ loading, recentShifts }: RecentHistoryProps) {
  if (loading) {
    return (
      <Box mx={2} mb={2}>
        {[1, 2, 3].map((index) => (
          <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="40%" height={18} />
                </Box>
                <Box>
                  <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 2 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (!recentShifts || recentShifts.length === 0) {
    return (
      <Box mx={2} mb={2}>
        <Card sx={{ borderRadius: 3, backgroundColor: '#f8f9fa' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#6c757d', mb: 1 }}>
              📋
            </Typography>
            <Typography variant="body1" sx={{ color: '#6c757d', fontWeight: 500 }}>
              No hay turnos recientes
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
              Tus turnos completados aparecerán aquí
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    // Si ya viene formateado (ej: "8:00 AM"), devolverlo tal como está
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    // Si viene en formato 24h (ej: "08:00"), convertir a 12h
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'active':
        return '#2196f3';
      case 'confirmed':
        return '#ff9800';
      case 'requested':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'active':
        return 'Activo';
      case 'confirmed':
        return 'Confirmado';
      case 'requested':
        return 'Solicitado';
      default:
        return status;
    }
  };

  return (
    <Box mx={2} mb={2}>
      {recentShifts.map((shift, index) => (
        <Card 
          key={shift.id || index} 
          sx={{ 
            mb: 2, 
            borderRadius: 3,
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '16px',
                    color: '#1a1a1a',
                    mb: 0.5,
                    lineHeight: 1.3
                  }}
                >
                  {shift.supermarketName}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6c757d',
                    mb: 1,
                    lineHeight: 1.4
                  }}
                >
                  📍 {shift.address}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#495057',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    📅 {formatDate(shift.date)}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#495057',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    🕐 {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </Typography>
                  
                  {shift.earnings && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#28a745',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      💰 ${shift.earnings}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box>
                <Box
                  sx={{
                    backgroundColor: getStatusColor(shift.status),
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    minWidth: 80
                  }}
                >
                  {getStatusText(shift.status)}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
