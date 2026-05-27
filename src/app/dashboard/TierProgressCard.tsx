"use client";

import { Box, Typography, Chip, LinearProgress, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShiftWithStatsResponse } from "@/types";

interface TierProgressCardProps {
  activeShift: ShiftWithStatsResponse;
}

const TIER_COLORS = ["#FF9800", "#E91E63", "#9C27B0"];

export default function TierProgressCard({ activeShift }: TierProgressCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { shift, stats, tierInfo } = activeShift;

  const isFirstEver = shift.isFirstShiftEver;
  const isFirstAtStore = shift.isFirstShiftAtStore;
  const timeRemaining = getTimeRemaining(shift.endTime);

  return (
    <Box
      sx={{
        borderRadius: "20px",
        bgcolor: "#fff",
        border: "1.5px solid #f0f0f0",
        boxShadow: "0 2px 12px rgba(233,30,99,0.07)",
        overflow: "hidden",
        mb: 2,
        mx: "auto",
        maxWidth: 360,
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#ff0aa2",
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 10 }}>
            Turno Activo
          </Typography>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: "#fff", mt: 0.2, fontSize: 14 }}
            noWrap
          >
            {shift.storeInfo?.name || "Tienda"}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>
            Tiempo restante
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff", fontSize: 13 }}>
            {timeRemaining}
          </Typography>
        </Box>
      </Box>

      {/* First-shift badges */}
      {(isFirstEver || isFirstAtStore) && (
        <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {isFirstEver && (
            <Chip
              icon={<EmojiEventsIcon sx={{ fontSize: 14, color: "#FF9800 !important" }} />}
              label="¡Primer turno!"
              size="small"
              sx={{
                bgcolor: "#FFF3E0",
                color: "#E65100",
                fontWeight: 700,
                fontSize: 11,
                height: 24,
                border: "1px solid #FFB74D",
              }}
            />
          )}
          {isFirstAtStore && !isFirstEver && (
            <Chip
              icon={<StarIcon sx={{ fontSize: 14, color: "#9C27B0 !important" }} />}
              label="Primera vez en esta tienda"
              size="small"
              sx={{
                bgcolor: "#F3E5F5",
                color: "#6A1B9A",
                fontWeight: 700,
                fontSize: 11,
                height: 24,
                border: "1px solid #CE93D8",
              }}
            />
          )}
        </Box>
      )}

      {/* Stats row */}
      <Box sx={{ px: 2.5, py: 1.5, display: "flex", justifyContent: "space-between" }}>
        <StatPill label="Total" value={stats.totalParticipations} color="#1976D2" />
        <StatPill label="Nuevos" value={stats.newUsers} color="#2E7D32" />
        <StatPill label="Existentes" value={stats.existingUsers} color="#E65100" />
        <StatPill label="Ganancias" value={`$${stats.totalEarnings.toFixed(2)}`} color="#ff0aa2" />
      </Box>

      {/* Tier section */}
      {tierInfo && (
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Box
            sx={{
              bgcolor: "#fdf5fb",
              border: "1px solid #f8d7ef",
              borderRadius: "12px",
              p: 1.5,
            }}
          >
            {/* Current tier label */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: TIER_COLORS[tierInfo.currentTierIdx] ?? "#ff0aa2",
                  }}
                />
                <Typography variant="caption" fontWeight={700} sx={{ color: "#222", fontSize: 12 }}>
                  {tierInfo.currentLabel}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" sx={{ color: "#888", fontSize: 11 }}>
                  ${tierInfo.currentRate.toFixed(2)}/nuevo
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setExpanded((v) => !v)}
                  sx={{ p: 0.25 }}
                >
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      color: "#ff0aa2",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>

            {/* Progress toward next tier */}
            {tierInfo.nextLabel && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(tierInfo.progressToNext * 100, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 4,
                    bgcolor: "#f0d8eb",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#ff0aa2",
                      borderRadius: 4,
                    },
                    mb: 0.75,
                  }}
                />
                <Typography variant="caption" sx={{ color: "#888", fontSize: 10 }}>
                  {tierInfo.countToNext} nuevos para{" "}
                  <strong style={{ color: "#ff0aa2" }}>{tierInfo.nextLabel}</strong>
                  {" "}(${tierInfo.nextRate?.toFixed(2)}/nuevo)
                </Typography>
              </>
            )}

            {!tierInfo.nextLabel && (
              <Typography variant="caption" sx={{ color: "#2E7D32", fontWeight: 700, fontSize: 11 }}>
                Nivel máximo alcanzado
              </Typography>
            )}

            {/* All tiers expanded */}
            <Collapse in={expanded}>
              <Box mt={1.25} display="flex" flexDirection="column" gap={0.75}>
                {tierInfo.tiers.map((tier, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: tier.isCurrent ? "rgba(255,10,162,0.07)" : "transparent",
                      borderRadius: "8px",
                      px: 1,
                      py: 0.5,
                      border: tier.isCurrent ? "1px solid rgba(255,10,162,0.2)" : "1px solid transparent",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.75}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: TIER_COLORS[i] ?? "#ccc",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          color: tier.isCurrent ? "#ff0aa2" : "#555",
                          fontWeight: tier.isCurrent ? 700 : 400,
                        }}
                      >
                        {tier.label}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: tier.isCurrent ? "#ff0aa2" : "#333",
                      }}
                    >
                      ${tier.ratePerNew.toFixed(2)}/nuevo
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        </Box>
      )}

      {/* Go to shift button */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Box
          component="button"
          onClick={() => router.push("/work")}
          sx={{
            display: "block",
            width: "100%",
            textAlign: "center",
            bgcolor: "#ff0aa2",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            py: 1.25,
            borderRadius: "10px",
            border: "none",
            letterSpacing: "0.01em",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
            "&:hover": { opacity: 0.88 },
            "&:active": { opacity: 0.75 },
          }}
        >
          Ir al Turno
        </Box>
      </Box>
    </Box>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Box textAlign="center">
      <Typography variant="caption" sx={{ color: "#999", fontSize: 10, display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ color, fontSize: 13 }}>
        {value}
      </Typography>
    </Box>
  );
}

function getTimeRemaining(endTime: string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return "Finalizado";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
