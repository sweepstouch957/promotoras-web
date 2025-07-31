"use client";

import { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useAvailableShifts,
  useRequestShift,
} from "../../hooks/usePromoterData";
import AppLayout from "../../components/Layout/AppLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Shift } from "../../types";
import ShiftCard from "./ShiftCard";
import ShiftFilters from "./SearchOptions";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function SearchShiftsPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const [popupShift, setPopupShift] = useState<Shift | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: shiftsData,
    isLoading,
    error: shiftsError,
    refetch,
  } = useAvailableShifts(currentPage, 10);

  const requestShiftMutation = useRequestShift();

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleRequest = async (shift: Shift) => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    try {
      console.log("Requesting shift:", shift._id);

      setError(null);
      setSuccessMessage(null);
      await requestShiftMutation.mutateAsync({
        shiftId: shift._id,
        promoterId: user._id,
      });
      setSuccessMessage("Turno solicitado exitosamente");
      setPopupShift(null);
      refetch();
    } catch (err: any) {
      setError(err.message || "Error al solicitar el turno");
    }
  };

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const filteredShifts = useMemo(() => {
    if (!shiftsData?.shifts) return [];
    return shiftsData.shifts.filter((shift) => {
      const nameMatch = shift.storeInfo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const zipMatch = zipFilter
        ? shift.storeInfo?.zipCode?.startsWith(zipFilter)
        : true;
      return nameMatch && zipMatch;
    });
  }, [shiftsData, searchTerm, zipFilter]);

  const firstCoords = filteredShifts[0]?.storeInfo?.location?.coordinates;
  const defaultView = firstCoords
    ? { longitude: firstCoords[0], latitude: firstCoords[1], zoom: 10 }
    : { longitude: -74.006, latitude: 40.7128, zoom: 9 };

  return (
    <ProtectedRoute requireAuth={true}>
      <AppLayout currentPage="search-shifts">
        <Box p={2}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Turnos Disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Encuentra turnos cerca de ti y solicítalos
          </Typography>

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
            <Alert severity="error" sx={{ mb: 2 }}>
              Error al cargar los turnos.
              <Button size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            </Alert>
          )}

          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress sx={{ color: "#e91e63" }} />
            </Box>
          ) : (
            <>
              {/* Mapa */}
              {filteredShifts.length > 0 && (
                <Box
                  sx={{
                    height: 400,
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  <Map
                    mapboxAccessToken={mapboxToken}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    initialViewState={defaultView}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <NavigationControl position="top-left" />
                    {filteredShifts.map((shift) => {
                      const coords = shift.storeInfo?.location?.coordinates;
                      if (!coords) return null;
                      return (
                        <Marker
                          key={shift._id}
                          longitude={coords[0]}
                          latitude={coords[1]}
                          onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setPopupShift(shift);
                          }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                            width={30}
                            height={30}
                            alt="marker"
                          />
                        </Marker>
                      );
                    })}
                    {popupShift && (
                      <Popup
                        anchor="top"
                        longitude={popupShift.storeInfo.location.coordinates[0]}
                        latitude={popupShift.storeInfo.location.coordinates[1]}
                        onClose={() => setPopupShift(null)}
                        closeOnClick={false}
                      >
                        <Box p={1} maxWidth={250}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {popupShift.storeInfo.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {popupShift.storeInfo.address}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            🕐 {formatTime(popupShift.startTime)} -{" "}
                            {formatTime(popupShift.endTime)}
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            sx={{ mt: 2, backgroundColor: "#e91e63" }}
                            onClick={() => handleRequest(popupShift)}
                          >
                            Enviar Solicitud
                          </Button>
                        </Box>
                      </Popup>
                    )}
                  </Map>
                </Box>
              )}

              {/* Filtros */}
              <ShiftFilters availableCount={filteredShifts.length} />

              {/* Turnos */}
              <Box display="flex" flexDirection="column" gap={2}>
                {filteredShifts.map((shift) => (
                  <ShiftCard
                    key={shift._id}
                    shift={shift}
                    onSuccess={handleRequest}
                  />
                ))}
              </Box>

              {/* Paginación */}
              {Number(shiftsData?.pagination?.page) > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={shiftsData?.pagination?.total}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": { color: "#e91e63" },
                      "& .Mui-selected": {
                        backgroundColor: "#e91e63 !important",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </AppLayout>
    </ProtectedRoute>
  );
}
