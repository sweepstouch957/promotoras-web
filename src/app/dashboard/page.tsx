"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardData, useActiveShift } from "../../hooks/usePromoterData";
import AppLayout from "../../components/Layout/AppLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProfileSelector from "../../components/ProfileSelector";
import {
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RegistroCard from "./RegistroCard";
import TurnosCompletados from "./TurnosCompletados";
import ProximosTurnos from "./ProximosTurnos";
import GananciasTotales from "./GananciasTotales";
import RecentHistory from "./RecentHistory";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  const userId = user?.id || user?._id || "";

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboardData(userId);

  const {
    data: activeShift,
    isLoading: isActiveShiftLoading,
    error: activeShiftError,
  } = useActiveShift(userId);

  useEffect(() => {
    if (user && (user.isFirstLogin || !user.profileImage)) {
      setShowProfileSelector(true);
    }
  }, [user]);

  const handleProfileSelected = () => setShowProfileSelector(false);

  const isLoadingUser = !user || !userId;
  const isLoading = isDashboardLoading || isActiveShiftLoading || isLoadingUser;
  const hasError = dashboardError || activeShiftError;

  if (isLoadingUser) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={40} sx={{ color: "#e91e63" }} />
      </Box>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="dashboard">
        <Box className="mobile-container dashboard-container" px={2}>
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={2}
            mt={4}
            borderRadius={1.5}
            bgcolor="transparent"
          >
            <Box position="relative" mb={2}>
              <Avatar
                src={user.profileImage}
                alt={user.name}
                sx={{ width: 120, height: 120, fontSize: 36, bgcolor: "#ccc" }}
              >
                {!user.profileImage && getInitials(user.name || "U")}
              </Avatar>

              <IconButton
                onClick={() => setShowProfileSelector(true)}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "white",
                  border: "2px solid #f0f0f0",
                  boxShadow: 1,
                  p: 0.5,
                  zIndex: 2,
                }}
              >
                <CameraAltIcon sx={{ color: "#e91e63", fontSize: 20 }} />
              </IconButton>
            </Box>

            <Typography variant="h5" fontWeight="bold" textAlign="center">
              ¡Hola, {user.name?.split(" ")[0]} {user.name?.split(" ")[1]}!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Bienvenida a tu panel de impulsadora.
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            mt={3}
            mb={2}
          >
            <Button
              variant="contained"
              startIcon={<SearchIcon sx={{ fontSize: 24, color: "#ff2d8b" }} />}
              href="/search-shifts"
              sx={{
                bgcolor: "#f2f2f2",
                borderRadius: 99,
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                px: 2.5,
                py: 1.5,
                fontSize: 14,
                boxShadow: "none",
                "&:hover": { bgcolor: "#e5e5e5" },
              }}
            >
              Buscar Turnos
            </Button>

            <Button
              variant="contained"
              startIcon={
                <TrendingUpIcon sx={{ fontSize: 24, color: "#ff2d8b" }} />
              }
              href="/performance"
              sx={{
                bgcolor: "#f2f2f2",
                borderRadius: 99,
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                px: 2.5,
                py: 1.5,
                fontSize: 14,
                boxShadow: "none",
                "&:hover": { bgcolor: "#e5e5e5" },
              }}
            >
              Mi Rendimiento
            </Button>
          </Stack>

          {isLoading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={40} sx={{ color: "#e91e63" }} />
            </Box>
          )}

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

          {!isLoading && !hasError && dashboardData && (
            <>
              {activeShift && (
                <Box mx={2} mb={2}>
                  <Alert
                    severity="info"
                    sx={{
                      bgcolor: "#e3f2fd",
                      "& .MuiAlert-icon": { color: "#1976d2" },
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

              <Typography variant="h6" fontWeight="bold" mb={2} px={2}>
                Historial Reciente
              </Typography>
              <RecentHistory
                loading={isLoading}
                recentShifts={dashboardData.recentShifts || []}
              />
            </>
          )}

          {!isLoading && !hasError && !dashboardData && (
            <>
              <RegistroCard total={0} loading={false} />
              <TurnosCompletados completed={0} loading={false} />
              <ProximosTurnos upcoming={0} loading={false} />
              <GananciasTotales total={0} loading={false} />

              <Typography variant="h6" fontWeight="bold" mb={2} px={2}>
                Historial Reciente
              </Typography>
              <RecentHistory loading={false} recentShifts={[]} />
            </>
          )}
        </Box>

        <ProfileSelector
          open={showProfileSelector}
          onClose={() => setShowProfileSelector(false)}
          onProfileSelected={handleProfileSelected}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
