"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Skeleton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import StoreIcon from "@mui/icons-material/Store";
import { Shift } from "@/types";

interface RecentHistoryProps {
  loading: boolean;
  recentShifts: Shift[];
}

export default function RecentHistory({
  loading,
  recentShifts,
}: RecentHistoryProps) {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            sx={{
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
              mb: 2,
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="flex-start" spacing={1} mb={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width="50%" height={18} />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width="70%" height={18} />
              </Stack>

              <Skeleton variant="text" width="80%" height={18} sx={{ ml: 3 }} />
              <Skeleton variant="text" width="30%" height={24} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {recentShifts.length === 0 ? (
        <Card
          sx={{
            borderRadius: 1,
            backgroundColor: "#f5f5f5",
            mb: 2,
            boxShadow: "none",
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <StoreIcon sx={{ fontSize: 40, color: "#e91e63" }} />
              <Box>
                <Typography fontWeight="bold">
                  No hay turnos recientes
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  ¡Busca turnos disponibles para comenzar!
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        recentShifts.map((shift) => (
          <Card
            key={shift._id}
            sx={{
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
              mb: 2,
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="flex-start" spacing={1} mb={1}>
                <EventIcon sx={{ color: "#e91e63" }} />
                <Typography color="text.secondary" fontWeight="bold">
                  {new Date(shift.date).toLocaleDateString("es-ES")}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <AccessTimeIcon sx={{ color: "#e91e63", fontSize: 18 }} />
                <Typography fontSize={14}>
                  {shift.startTime} - {shift.endTime}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <PlaceIcon sx={{ color: "#e91e63", fontSize: 18 }} />
                <Typography fontSize={14} color="text.secondary">
                  {shift?.storeInfo?.address}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
