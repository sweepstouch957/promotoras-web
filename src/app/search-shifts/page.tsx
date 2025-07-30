'use client';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAvailableShifts, useRequestShift } from '../../hooks/usePromoterData';
import AppLayout from '../../components/Layout/AppLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Chip,
  Pagination
} from '@mui/material';
import { Shift } from '../../types';

export default function SearchShiftsPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [requestingShiftId, setRequestingShiftId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Query para obtener turnos disponibles
  const {
    data: shiftsData,
    isLoading,
    error: shiftsError,
    refetch
  } = useAvailableShifts(currentPage, 10);

  // Mutation para solicitar turno
  const requestShiftMutation = useRequestShift();

  const handleRequestShift = async (shift: Shift) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setRequestingShiftId(shift.id);

      await requestShiftMutation.mutateAsync({
        shiftId: shift.id,
        promoterId: user.id
      });

      setSuccessMessage(`Turno en ${shift.supermarketName} solicitado exitosamente`);
      
      // Refrescar la lista después de solicitar
      setTimeout(() => {
        refetch();
      }, 1000);

    } catch (error: any) {
      console.error('Error al solicitar turno:', error);
      setError(error.message || 'Error al solicitar el turno. Intenta de nuevo.');
    } finally {
      setRequestingShiftId(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
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
      case 'available':
        return '#4caf50';
      case 'requested':
        return '#ff9800';
      case 'confirmed':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'requested':
        return 'Solicitado';
      case 'confirmed':
        return 'Confirmado';
      default:
        return status;
    }
  };

  const isShiftRequestable = (shift: Shift) => {
    return shift.status === 'available';
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="search-shifts">
        <div className="mobile-container">
          <Box sx={{ p: 2 }}>
            {/* Header */}
            <Typography variant="h4" fontWeight="bold" mb={1}>
              Turnos Disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Encuentra turnos cerca de ti y solicítalos
            </Typography>

            {/* Messages */}
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                onClose={() => setSuccessMessage(null)}
              >
                {successMessage}
              </Alert>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {shiftsError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => refetch()}>
                    Reintentar
                  </Button>
                }
              >
                Error al cargar los turnos disponibles
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress size={40} sx={{ color: '#e91e63' }} />
              </Box>
            )}

            {/* Shifts List */}
            {!isLoading && shiftsData?.data && (
              <>
                {shiftsData.data.length === 0 ? (
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        🔍 No hay turnos disponibles
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Por el momento no hay turnos disponibles. 
                        Vuelve a revisar más tarde.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        onClick={() => refetch()}
                      >
                        Actualizar
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {shiftsData.data.map((shift) => (
                      <Card 
                        key={shift.id} 
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
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box flex={1}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  color: '#1a1a1a',
                                  mb: 0.5
                                }}
                              >
                                {shift.supermarketName}
                              </Typography>
                              
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#6c757d',
                                  mb: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                📍 {shift.address}
                              </Typography>

                              {shift.distance && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: '#495057',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mb: 1
                                  }}
                                >
                                  🚗 {shift.distance} km de distancia
                                </Typography>
                              )}
                            </Box>

                            <Chip
                              label={getStatusText(shift.status)}
                              sx={{
                                backgroundColor: getStatusColor(shift.status),
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '12px'
                              }}
                            />
                          </Box>

                          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
                            <Typography 
                              variant="body2" 
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
                              variant="body2" 
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
                                variant="body2" 
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

                          <Box display="flex" justifyContent="flex-end">
                            <Button
                              variant="contained"
                              onClick={() => handleRequestShift(shift)}
                              disabled={
                                !isShiftRequestable(shift) || 
                                requestingShiftId === shift.id ||
                                requestShiftMutation.isPending
                              }
                              sx={{
                                backgroundColor: isShiftRequestable(shift) ? '#e91e63' : '#cccccc',
                                color: 'white',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                  backgroundColor: isShiftRequestable(shift) ? '#c2185b' : '#cccccc',
                                },
                                '&:disabled': {
                                  backgroundColor: '#cccccc',
                                  color: '#999999'
                                }
                              }}
                            >
                              {requestingShiftId === shift.id ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <CircularProgress size={16} sx={{ color: 'white' }} />
                                  Solicitando...
                                </Box>
                              ) : (
                                isShiftRequestable(shift) ? 'Solicitar Turno' : 'No Disponible'
                              )}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Pagination */}
                    {shiftsData.totalPages > 1 && (
                      <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                          count={shiftsData.totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              color: '#e91e63'
                            },
                            '& .Mui-selected': {
                              backgroundColor: '#e91e63 !important',
                              color: 'white'
                            }
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
