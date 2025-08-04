import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  Collapse,
  IconButton,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface RegistroCardProps {
  total: number;
  clienteNuevo: number;
  clienteExistente: number;
  loading?: boolean;
}

export default function RegistroCard({
  total,
  clienteNuevo,
  clienteExistente,
  loading = false,
}: RegistroCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        borderRadius: "24px",
        backgroundColor: "#F1F1F1",
        padding: "24px",
        width: "100%",
        maxWidth: "360px",
        height: expanded ? "240px" : "150px",
        position: "relative",
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "height 0.3s ease-in-out",
        overflow: "hidden",
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "calc(50% - 66px)",
            width: "48px",
            height: "4px",
            backgroundColor: "#ff0aa2",
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "calc(50% + 6px)",
            width: "48px",
            height: "4px",
            backgroundColor: "#B6A8B1",
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        />
        {[1, 2].map((_, index) => (
          <Avatar
            key={index}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "white",
              mx: 1,
              zIndex: 1,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#ff0aa2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </Avatar>
        ))}
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
      </Box>

      {/* Cabecera texto + botón expandir */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            sx={{ fontWeight: "600", fontSize: "16px", color: "#000" }}
          >
            Total Registros
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#5e5e5e", mt: "2px" }}>
            Números registrados en total
          </Typography>
        </Box>

        <Box>
          {loading ? (
            <Skeleton variant="text" width={50} height={40} />
          ) : (
            <Stack direction={"row"}>
              <Typography
                sx={{ fontWeight: "700", fontSize: "34px", color: "#000" }}
              >
                {total}
              </Typography>
              <IconButton onClick={() => setExpanded(!expanded)}>
                <ExpandMoreIcon
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    color: "#ff0aa2",
                  }}
                />
              </IconButton>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Contenido expandido */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box mt={1}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000",
              mb: 0.5,
            }}
          >
            Detalle de registros:
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#5e5e5e" }}>
            Clientes Nuevos:{" "}
            <strong style={{ color: "#00A86B" }}>{clienteNuevo}</strong>
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#5e5e5e" }}>
            Clientes Existentes:{" "}
            <strong style={{ color: "#fc0680" }}>{clienteExistente}</strong>
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
