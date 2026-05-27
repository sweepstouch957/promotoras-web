"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface GananciasTotalesProps {
  total: number;
  loading?: boolean;
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Avatar
    sx={{
      width: 40,
      height: 40,
      bgcolor: "white",
      mx: 1,
      zIndex: 1,
    }}
  >
    {children}
  </Avatar>
);

const Circle = () => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      backgroundColor: "#B6A8B1",
      mx: 1,
      zIndex: 1,
    }}
  />
);

const Line = ({ color, left }: { color: string; left: string }) => (
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left,
      width: "48px",
      height: "4px",
      backgroundColor: color,
      zIndex: 0,
      transform: "translateY(-50%)",
    }}
  />
);

export default function GananciasTotales({
  total,
  loading = false,
}: GananciasTotalesProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box
      sx={{
        borderRadius: "24px",
        backgroundColor: "#F1F1F1",
        padding: "24px",
        width: "100%",
        maxWidth: "360px",
        height: "150px",
        position: "relative",
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Línea + Íconos */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Line color="#ff0aa2" left="calc(50% - 66px)" />
        <Line color="#B6A8B1" left="calc(50% + 6px)" />

        <IconWrapper>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0aa2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.73-1.09-7.12-3.73-.41-.78-.06-1.77.75-2.25.73-.43 1.66-.25 2.16.39 1.02 1.38 2.75 2.07 4.4 1.79 1.73-.3 3.1-1.67 3.4-3.4.29-1.65-.41-3.38-1.79-4.4-.63-.49-.82-1.43-.39-2.16.48-.81 1.47-1.16 2.25-.75 2.64 1.39 4.21 4.29 3.73 7.12-.48 2.84-2.83 5.19-5.67 5.67z" />
          </svg>
        </IconWrapper>

        <IconWrapper>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0aa2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.73-1.09-7.12-3.73-.41-.78-.06-1.77.75-2.25.73-.43 1.66-.25 2.16.39 1.02 1.38 2.75 2.07 4.4 1.79 1.73-.3 3.1-1.67 3.4-3.4.29-1.65-.41-3.38-1.79-4.4-.63-.49-.82-1.43-.39-2.16.48-.81 1.47-1.16 2.25-.75 2.64 1.39 4.21 4.29 3.73 7.12-.48 2.84-2.83 5.19-5.67 5.67z" />
          </svg>
        </IconWrapper>

        <Circle />
      </Box>

      {/* Texto */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            sx={{ fontWeight: "600", fontSize: "16px", color: "#000" }}
          >
            Ganancias Totales
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#5e5e5e", mt: "2px" }}>
            Ingreso Acumulados
          </Typography>
        </Box>
      </Box>

      {/* Monto */}
      <Box sx={{ position: "absolute", right: 24, bottom: 16 }}>
        {loading ? (
          <Skeleton variant="text" width={60} height={36} />
        ) : (
          <Stack gap={1} direction={"row"}>
            <Typography
              sx={{ fontWeight: "700", fontSize: "30px", color: "#000" }}
            >
              ${total.toFixed(2)}
            </Typography>
            <IconButton onClick={() => setModalOpen(true)}>
              <HelpIcon sx={{ color: "#ff0aa2" }} />
            </IconButton>
          </Stack>
        )}
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Plan de Ganancias por Tramos</DialogTitle>
        <DialogContent>
          {/* Tier table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: 2, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fdf5fb" }}>
                  <TableCell><strong>Tramo</strong></TableCell>
                  <TableCell><strong>Registros nuevos</strong></TableCell>
                  <TableCell><strong>Pago/nuevo</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: "#FF9800", fontWeight: 700 }}>Tramo 1</TableCell>
                  <TableCell>0 – 200</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>$0.40</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: "#fff9f5" }}>
                  <TableCell sx={{ color: "#E91E63", fontWeight: 700 }}>Tramo 2</TableCell>
                  <TableCell>201 – 999</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>$0.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: "#9C27B0", fontWeight: 700 }}>Tramo 3</TableCell>
                  <TableCell>1000+</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>$1.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Existing users */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: 2, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><strong>Tipo de Participación</strong></TableCell>
                  <TableCell><strong>Pago</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Participación Existente</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>$0.10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            <strong>Nota:</strong> El tramo aplica al número de clientes nuevos registrados en el turno.
            Más nuevos = mejor tarifa para todos los que sigas registrando en ese turno.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
