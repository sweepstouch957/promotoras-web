"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { ShiftAssignedNotification } from "@/types";
import { useRouter } from "next/navigation";

interface ShiftNotificationBannerProps {
  notification: ShiftAssignedNotification | null;
  onDismiss: () => void;
}

function formatShiftTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Banner slides in from top. If user ignores for 3s → escalates to modal.
export function ShiftNotificationBanner({
  notification,
  onDismiss,
}: ShiftNotificationBannerProps) {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [idleTimer, setIdleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Escalate to modal after 3s of no interaction
  useEffect(() => {
    if (!notification) {
      setIsModal(false);
      if (idleTimer) clearTimeout(idleTimer);
      return;
    }
    const t = setTimeout(() => setIsModal(true), 3000);
    setIdleTimer(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.shiftId]);

  const handleGoToShift = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer);
    onDismiss();
    router.push("/work");
  }, [idleTimer, onDismiss, router]);

  const handleDismiss = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer);
    setIsModal(false);
    onDismiss();
  }, [idleTimer, onDismiss]);

  if (!notification) return null;

  const timeLabel =
    notification.startTime
      ? `${formatShiftTime(notification.startTime)} – ${formatShiftTime(notification.endTime)}`
      : "Turno asignado";

  return (
    <AnimatePresence>
      {notification && (
        <>
          {/* Banner (always shown first, hidden when modal takes over) */}
          {!isModal && (
            <motion.div
              key="banner"
              initial={{ y: -90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1500,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  maxWidth: 440,
                  width: "calc(100% - 24px)",
                  mx: "auto",
                  mt: 1.5,
                  bgcolor: "#ff0aa2",
                  borderRadius: "16px",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  boxShadow: "0 6px 24px rgba(255,10,162,0.35)",
                  pointerEvents: "all",
                }}
              >
                <NotificationsActiveIcon sx={{ color: "#fff", fontSize: 22, flexShrink: 0 }} />
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: "#fff", fontSize: 13, lineHeight: 1.2 }}>
                    {notification.message || "¡Te asignaron un turno!"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                    {timeLabel}
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={handleGoToShift}
                  sx={{
                    bgcolor: "#fff",
                    color: "#ff0aa2",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: 12,
                    px: 1.5,
                    py: 0.75,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
                    "&:active": { opacity: 0.8 },
                  }}
                >
                  Ver
                </Box>
                <IconButton size="small" onClick={handleDismiss} sx={{ color: "rgba(255,255,255,0.7)", p: 0.25 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </motion.div>
          )}

          {/* Modal — escalated after 3s idle */}
          <AnimatePresence>
            {isModal && (
              <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 1500,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 24,
                }}
                onClick={handleDismiss}
              >
                <motion.div
                  key="modal-card"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  style={{ width: "calc(100% - 32px)", maxWidth: 420 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 16px 60px rgba(0,0,0,0.18)",
                    }}
                  >
                    {/* Pink header */}
                    <Box
                      sx={{
                        bgcolor: "#ff0aa2",
                        px: 2.5,
                        pt: 2.5,
                        pb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 0.5, repeat: 3, repeatDelay: 0.4 }}
                        >
                          <NotificationsActiveIcon sx={{ color: "#fff", fontSize: 26 }} />
                        </motion.div>
                        <Typography variant="h6" fontWeight={800} sx={{ color: "#fff", fontSize: 17 }}>
                          Nuevo Turno Asignado
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={handleDismiss} sx={{ color: "rgba(255,255,255,0.7)" }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    {/* Details */}
                    <Box px={2.5} py={2}>
                      <Typography variant="body2" sx={{ color: "#555", fontSize: 14, mb: 1.5 }}>
                        {notification.message || "¡Te han asignado un nuevo turno!"}
                      </Typography>

                      <Box sx={{ bgcolor: "#fdf5fb", borderRadius: "12px", p: 1.5, mb: 2 }}>
                        <InfoRow label="Horario" value={timeLabel} />
                        {notification.heldUsd > 0 && (
                          <InfoRow
                            label="Presupuesto asignado"
                            value={`$${notification.heldUsd.toFixed(2)}`}
                            valueColor="#ff0aa2"
                          />
                        )}
                      </Box>

                      {/* Actions */}
                      <Box display="flex" gap={1.5}>
                        <Box
                          component="button"
                          onClick={handleDismiss}
                          sx={{
                            flex: 1,
                            py: 1.5,
                            bgcolor: "#f5f5f5",
                            color: "#666",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            "&:active": { opacity: 0.75 },
                          }}
                        >
                          Después
                        </Box>
                        <Box
                          component="button"
                          onClick={handleGoToShift}
                          sx={{
                            flex: 2,
                            py: 1.5,
                            bgcolor: "#ff0aa2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 800,
                            fontSize: 14,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            "&:active": { opacity: 0.85 },
                          }}
                        >
                          Ir al Turno
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({
  label,
  value,
  valueColor = "#222",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
      <Typography variant="caption" sx={{ color: "#888", fontSize: 12 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: valueColor, fontWeight: 700, fontSize: 12 }}>
        {value}
      </Typography>
    </Box>
  );
}
