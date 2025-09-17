import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Shift } from "@/types";

interface ShiftCardProps {
  shift: Shift;
  onSuccess: (shift: Shift) => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onSuccess }) => {
  const [requestSent, setRequestSent] = React.useState(false);

  const start = new Date(shift.startTime);
  const end = new Date(shift.endTime);

  const formatDateFromStart = (d: Date) =>
    d.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // cámbialo a false si prefieres 24h
    });

  const handleRequest = () => {
    setRequestSent(true);
    onSuccess?.(shift);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          borderRadius: 2,
          p: 2,
          bgcolor: "#F8F8F8",
          boxShadow: 0,
          maxWidth: 380,
          mx: "auto",
        }}
      >
        <CardContent>
          <Typography fontWeight={700} fontSize={16}>
            {shift.storeInfo?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {shift.storeInfo?.address}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <CalendarMonthIcon sx={{ color: "#e91e63" }} />
            <Typography fontWeight={600} fontSize={14}>
              {formatDateFromStart(start)}
            </Typography>
            <AccessTimeIcon sx={{ color: "#e91e63", ml: 2 }} />
            <Typography fontWeight={600} fontSize={14}>
              {formatTime(start)} - {formatTime(end)}
            </Typography>
          </Stack>

          <Box textAlign="center">
            {requestSent ? (
              <Box
                mt={1}
                px={2}
                py={1}
                sx={{
                  borderRadius: 99,
                  backgroundColor: "#eeeeee",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20, color: "#e91e63" }} />
                <Typography fontWeight={700} fontSize={14}>
                  Solicitud Enviada
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={handleRequest}
                sx={{
                  backgroundColor: "#ff007f",
                  borderRadius: 99,
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Enviar Solicitud
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShiftCard;
