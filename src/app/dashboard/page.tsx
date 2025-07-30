'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AppLayout from '../../components/Layout/AppLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileSelector from '../../components/ProfileSelector';
import { shiftAPI } from '../../services/api';
import { Shift } from '../../types';
import { Box, Button, Typography, Stack } from '@mui/material';
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentShifts, setRecentShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  useEffect(() => {
    // Check if this is the user's first login
    if (user && user.isFirstLogin) {
      setShowProfileSelector(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchRecentShifts = async () => {
      if (user?.id) {
        try {
          const shifts = await shiftAPI.getUserShifts(user.id);
          setRecentShifts(shifts.slice(0, 3));
        } catch (error) {
          console.error('Error fetching shifts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecentShifts();
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
                borderRadius: 1.5, // menos redondeado (12px)
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

            {/* Stats Cards */}
            <RegistroCard total={5} />
            <TurnosCompletados />
            <ProximosTurnos />
            <GananciasTotales />

            {/* History Section */}
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{p: 2}}>
        Historial Reciente
      </Typography>
            <RecentHistory
              loading={false}
              recentShifts={[
                {
                  id: 1,
                  date: '2025-07-01',
                  startTime: '8:00 AM',
                  endTime: '12:00 PM',
                  supermarketName: 'CTown Supermarket 272',
                  address: 'Maple St, Perth Amboy, NJ 08861, USA',
                },
              ]}
            />
             <RecentHistory
              loading={false}
              recentShifts={[
                {
                  id: 1,
                  date: '2025-07-01',
                  startTime: '8:00 AM',
                  endTime: '12:00 PM',
                  supermarketName: 'CTown Supermarket 272',
                  address: 'Maple St, Perth Amboy, NJ 08861, USA',
                },
              ]}
            />

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
