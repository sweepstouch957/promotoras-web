'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData, useActiveShift } from '../../hooks/usePromoterData';
import AppLayout from '../../components/Layout/AppLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileSelector from '../../components/ProfileSelector';
import { Box, Button, Typography, Stack, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RegistroCard from './RegistroCard';
import TurnosCompletados from './TurnosCompletados';
import ProximosTurnos from './ProximosTurnos';
import GananciasTotales from './GananciasTotales';
import RecentHistory from './RecentHistory';

// Función helper para obtener iniciales
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  // Queries para obtener datos del dashboard
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useDashboardData(user?.id || '');

  console.log('Dashboard Data:', dashboardData);
  
  const {
    data: activeShift,
    isLoading: isActiveShiftLoading,
    error: activeShiftError
  } = useActiveShift(user?.id || '');

  console.log('Active Shift:', activeShift);
  
  useEffect(() => {
    // Check if this is the user's first login or has no profile image
    if (user && (user.isFirstLogin || !user.profileImage)) {
      setShowProfileSelector(true);
    }
  }, [user]);

  const handleProfileSelected = (profileImage: string) => {
    setShowProfileSelector(false);
  };

  const handleCloseProfileSelector = () => {
    setShowProfileSelector(false);
  };

  if (!user) {
    return null;
  }

  // Loading state
  const isLoading = isDashboardLoading || isActiveShiftLoading;

  // Error state
  const hasError = dashboardError || activeShiftError;

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="dashboard">
        <div className="mobile-container">
          <div className="dashboard-container">
            {/* Profile Section */}
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding={2}
              sx={{
                backgroundColor: 'transparent',
                borderRadius: 1.5,
                marginTop: 4,
                marginX: 2,
              }}
            >
              {/* Avatar con icono de cámara */}
              <Box position="relative" mb={2}>
                <Avatar
                  src={user.profileImage}
                  alt={user.name}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 36,
                    backgroundColor: '#ccc',
                  }}
                >
                  {!user.profileImage && getInitials(user.name || 'U')}
                </Avatar>

                <IconButton
                  onClick={() => setShowProfileSelector(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '2px solid #f0f0f0',
                    boxShadow: 1,
                    padding: '4px',
                    zIndex: 2,
                  }}
                >
                  <CameraAltIcon sx={{ color: '#e91e63', fontSize: 20 }} />
                </IconButton>
              </Box>

              {/* Texto de bienvenida */}
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                ¡Hola, {user.name.split(' ')[0]} {user.name.split(' ')[1]}!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Bienvenida a tu panel de impulsadora.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" mt={3} mb={2}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={
                    <SearchIcon
                      sx={{
                        fontSize: 24,
                        color: '#ff2d8b',
                        fontWeight: 'bold',
                      }}
                    />
                  }
                  onClick={() => (window.location.href = '/search-shifts')}
                  sx={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: '999px',
                    color: '#000',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2.5,
                    py: 1.5,
                    boxShadow: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#e5e5e5',
                    },
                  }}
                >
                  Buscar Turnos
                </Button>

                <Button
                  variant="contained"
                  startIcon={
                    <TrendingUpIcon
                      sx={{
                        fontSize: 24,
                        color: '#ff2d8b',
                        fontWeight: 'bold',
                      }}
                    />
                  }
                  onClick={() => (window.location.href = '/performance')}
                  sx={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: '999px',
                    color: '#000',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2.5,
                    py: 1.5,
                    boxShadow: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#e5e5e5',
                    },
                  }}
                >
                  Mi Rendimiento
                </Button>
              </Stack>
            </Box>

            {/* Loading State */}
            {isLoading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress size={40} sx={{ color: '#e91e63' }} />
              </Box>
            )}

            {/* Error State */}
            {hasError && (
              <Box mx={2} my={2}>
                <Alert 
                  severity="error" 
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => refetchDashboard()}
                    >
                      Reintentar
                    </Button>
                  }
                >
                  Error al cargar los datos. Verifica tu conexión.
                </Alert>
              </Box>
            )}

            {/* Dashboard Content */}
            {!isLoading && !hasError && dashboardData && (
              <>
                {/* Active Shift Indicator */}
                {activeShift && (
                  <Box mx={2} mb={2}>
                    <Alert 
                      severity="info" 
                      sx={{ 
                        backgroundColor: '#e3f2fd',
                        '& .MuiAlert-icon': { color: '#1976d2' }
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Turno activo en {activeShift.supermarketName}
                      </Typography>
                      <Typography variant="caption">
                        Contactos captados: {activeShift.numbersCollected} | 
                        Tiempo restante: {activeShift.timeRemaining}
                      </Typography>
                    </Alert>
                  </Box>
                )}

                {/* Stats Cards */}
                <RegistroCard 
                  total={dashboardData.stats?.allTime?.totalShifts || 0} 
                  loading={isLoading}
                />
                <TurnosCompletados 
                  completed={dashboardData.stats?.allTime?.completedShifts || 0}
                  loading={isLoading}
                />
                <ProximosTurnos 
                  upcoming={dashboardData.stats?.today?.shiftsCompleted || 0}
                  loading={isLoading}
                />
                <GananciasTotales 
                  total={dashboardData.stats?.allTime?.totalEarnings || 0}
                  loading={isLoading}
                />

                {/* History Section */}
                <Typography variant="h6" fontWeight="bold" mb={2} sx={{p: 2}}>
                  Historial Reciente
                </Typography>
                <RecentHistory
                  loading={isLoading}
                  recentShifts={dashboardData.recentShifts || []}
                />
              </>
            )}

            {/* Fallback when no data but not loading/error */}
            {!isLoading && !hasError && !dashboardData && (
              <>
                <RegistroCard total={0} loading={false} />
                <TurnosCompletados completed={0} loading={false} />
                <ProximosTurnos upcoming={0} loading={false} />
                <GananciasTotales total={0} loading={false} />

                <Typography variant="h6" fontWeight="bold" mb={2} sx={{p: 2}}>
                  Historial Reciente
                </Typography>
                <RecentHistory
                  loading={false}
                  recentShifts={[]}
                />
              </>
            )}
          </div>
        </div>

        {/* Profile Selector Modal */}
        <ProfileSelector
          open={showProfileSelector}
          onClose={handleCloseProfileSelector}
          onProfileSelected={handleProfileSelected}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
