"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
  IconButton,
  Collapse,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import { Shift } from "@/types";

interface RecentHistoryProps {
  loading: boolean;
  recentShifts: Shift[];
}

function formatTime(timeStr: string) {
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function RecentHistory({
  loading,
  recentShifts,
}: RecentHistoryProps) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const itemsPerPage = 1;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setExpanded(false); // reset accordion when switching card
  };

  const paginatedShifts = recentShifts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return <Typography sx={{ p: 2 }}>Cargando turnos recientes...</Typography>;
  }

  if (recentShifts.length === 0) {
    return (
      <Card sx={{ m: 2, backgroundColor: "#f5f5f5", boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight="bold">No hay turnos recientes</Typography>
          <Typography fontSize={14} color="text.secondary">
            ¡Busca turnos disponibles para comenzar!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {paginatedShifts.map((shift) => (
        <Card
          key={shift._id}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#f5f5f5",
            mb: 2,
            boxShadow: "none",
            px: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <CardContent>
            {/* Fecha */}
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EventIcon sx={{ color: "#e91e63" }} />
              <Typography fontWeight="bold" fontSize={14}>
                {new Date(shift.date).toLocaleDateString("es-ES")}
              </Typography>
            </Stack>

            {/* Hora */}
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <AccessTimeIcon sx={{ color: "#e91e63", fontSize: 18 }} />
              <Typography fontSize={14}>
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </Typography>
            </Stack>

            {/* Dirección */}
            <Stack direction="row" alignItems="flex-start" spacing={1} mb={2}>
              <PlaceIcon sx={{ color: "#e91e63", fontSize: 18, mt: 0.3 }} />
              <Typography fontSize={14} color="text.secondary">
                {shift.storeInfo?.name ?? "Tienda no disponible"}
              </Typography>
            </Stack>

            {/* Participaciones con acordeón */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight="bold" fontSize={14}>
                Números captados:
              </Typography>
              <IconButton
                size="small"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>

            <Typography fontWeight="bold" fontSize={20} color="#000">
              {shift.totalParticipations?.toLocaleString() ?? 0}
            </Typography>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 1, pl: 1 }}>
                <Typography fontSize={14}>
                  Nuevos: <b>{shift.newParticipations ?? 0}</b>
                </Typography>
                <Typography fontSize={14}>
                  Existentes: <b>{shift.existingParticipations ?? 0}</b>
                </Typography>
                <Typography fontSize={14}>
                  Ganancias: <b>{shift.totalEarnings?.toFixed(2) ?? 0} USD</b>
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <Pagination
        count={Math.ceil(recentShifts.length / itemsPerPage)}
        page={page}
        onChange={handleChange}
        color="primary"
        sx={{ mt: 1, "& .MuiPaginationItem-root": { color: "#000" } }}
      />
    </Box>
  );
}
