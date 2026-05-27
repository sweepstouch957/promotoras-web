"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useActiveShift } from "@/hooks/usePromoterData";
import { participationService } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/Layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, Typography, CircularProgress, IconButton, Chip, LinearProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { TierInfo, ParticipationResult } from "@/types";

// ─── Phone formatting ────────────────────────────────────────────────────────

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function digitsOnly(v: string): string {
  return v.replace(/\D/g, "");
}

// ─── Milestone values ────────────────────────────────────────────────────────

const MILESTONES = [50, 100, 200, 500, 1000];

function nextMilestone(count: number): number | null {
  return MILESTONES.find((m) => m > count) ?? null;
}

// ─── Tier mini bar ────────────────────────────────────────────────────────────

const TIER_COLORS = ["#FF9800", "#E91E63", "#9C27B0"];

function TierBar({ tierInfo }: { tierInfo: TierInfo }) {
  return (
    <Box
      sx={{
        bgcolor: "#fdf5fb",
        border: "1px solid #f5d0ea",
        borderRadius: "14px",
        p: 1.5,
        mb: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
        <Box display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: TIER_COLORS[tierInfo.currentTierIdx] ?? "#ff0aa2",
            }}
          />
          <Typography variant="caption" fontWeight={700} sx={{ color: "#222", fontSize: 12 }}>
            {tierInfo.currentLabel}
          </Typography>
          <Typography variant="caption" sx={{ color: "#ff0aa2", fontWeight: 700, fontSize: 12 }}>
            ${tierInfo.currentRate.toFixed(2)}/nuevo
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#888", fontSize: 11 }}>
          {tierInfo.newUsersCount} nuevos
        </Typography>
      </Box>

      {tierInfo.nextLabel && (
        <>
          <LinearProgress
            variant="determinate"
            value={Math.min(tierInfo.progressToNext * 100, 100)}
            sx={{
              height: 5,
              borderRadius: 4,
              bgcolor: "#f0d8eb",
              "& .MuiLinearProgress-bar": { bgcolor: "#ff0aa2", borderRadius: 4 },
              mb: 0.5,
            }}
          />
          <Typography variant="caption" sx={{ color: "#888", fontSize: 10 }}>
            {tierInfo.countToNext} más para{" "}
            <strong style={{ color: "#ff0aa2" }}>{tierInfo.nextLabel}</strong>{" "}
            (${tierInfo.nextRate?.toFixed(2)}/nuevo)
          </Typography>
        </>
      )}
      {!tierInfo.nextLabel && (
        <Typography variant="caption" sx={{ color: "#2E7D32", fontWeight: 700, fontSize: 11 }}>
          Nivel máximo
        </Typography>
      )}
    </Box>
  );
}

// ─── Milestone celebration overlay ───────────────────────────────────────────

function MilestoneCelebration({
  count,
  onDone,
}: {
  count: number;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,10,162,0.08)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onDone}
    >
      <Box textAlign="center">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EmojiEventsIcon sx={{ fontSize: 80, color: "#FF9800" }} />
        </motion.div>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ color: "#ff0aa2", mt: 1, letterSpacing: "-0.02em" }}
        >
          ¡{count} nuevos!
        </Typography>
        <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>
          Meta alcanzada
        </Typography>
      </Box>
    </motion.div>
  );
}

// ─── Recent registration pill ─────────────────────────────────────────────────

function RegPill({ reg, idx }: { reg: ParticipationResult; idx: number }) {
  const maskedPhone = reg.customerPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  return (
    <motion.div
      key={reg._id}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 0.75,
          px: 1.5,
          bgcolor: reg.isNewUser ? "rgba(46,125,50,0.06)" : "rgba(255,152,0,0.06)",
          borderRadius: "10px",
          mb: 0.75,
          border: `1px solid ${reg.isNewUser ? "rgba(46,125,50,0.15)" : "rgba(255,152,0,0.15)"}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon
            sx={{ fontSize: 14, color: reg.isNewUser ? "#2E7D32" : "#FF9800" }}
          />
          <Typography variant="caption" sx={{ color: "#333", fontSize: 12, fontFamily: "monospace" }}>
            {maskedPhone}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <Chip
            label={reg.isNewUser ? "Nuevo" : "Existente"}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: reg.isNewUser ? "rgba(46,125,50,0.1)" : "rgba(255,152,0,0.1)",
              color: reg.isNewUser ? "#2E7D32" : "#E65100",
            }}
          />
          <Typography variant="caption" sx={{ color: "#ff0aa2", fontWeight: 700, fontSize: 11 }}>
            +${reg.earningsValue.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.id || user?._id || "";

  const { data: activeShiftData, isLoading: shiftLoading } = useActiveShift(userId);

  // Resolve active sweepstake for the shift's store
  const storeId = activeShiftData?.shift?.storeId;
  const { data: sweepstake } = useQuery({
    queryKey: ["activeSweepstake", storeId],
    queryFn: () => participationService.getActiveSweepstake(storeId!),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });

  // Local state
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [recent, setRecent] = useState<ParticipationResult[]>([]);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [localNewCount, setLocalNewCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local new count from server data
  useEffect(() => {
    if (activeShiftData?.stats?.newUsers !== undefined) {
      setLocalNewCount(activeShiftData.stats.newUsers);
    }
  }, [activeShiftData?.stats?.newUsers]);

  const registerMutation = useMutation({
    mutationFn: (phoneNumber: string) =>
      participationService.register({
        phoneNumber,
        shiftId: activeShiftData!.shift._id,
        promoterId: userId,
        storeId: activeShiftData!.shift.storeId,
        sweepstakeId: sweepstake?._id,
      }),
    onSuccess: (result) => {
      setPhone("");
      setFeedback("success");
      setRecent((prev) => [result, ...prev].slice(0, 8));

      if (result.isNewUser) {
        const newCount = localNewCount + 1;
        setLocalNewCount(newCount);

        // Check milestone
        const prevMilestone = nextMilestone(localNewCount);
        const currMilestone = nextMilestone(newCount);
        if (prevMilestone && currMilestone !== prevMilestone) {
          setMilestone(prevMilestone);
        }
      }

      setTimeout(() => {
        setFeedback("idle");
        inputRef.current?.focus();
      }, 1200);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || "Error al registrar";
      const isDuplicate =
        msg.toLowerCase().includes("ficticio") ||
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("estructura");
      setFeedback(isDuplicate ? "duplicate" : "error");
      setErrorMsg(msg);
      setTimeout(() => {
        setFeedback("idle");
        setErrorMsg("");
      }, 2500);
    },
  });

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value).slice(0, 10);
    setPhone(raw);
    if (feedback !== "idle") setFeedback("idle");
  }, [feedback]);

  const handleSubmit = useCallback(() => {
    const digits = digitsOnly(phone);
    if (digits.length < 10) return;
    if (registerMutation.isPending) return;
    registerMutation.mutate(digits);
  }, [phone, registerMutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  const shift = activeShiftData?.shift;
  const stats = activeShiftData?.stats;
  const tierInfo = activeShiftData?.tierInfo;
  const isReady = !shiftLoading && !!shift;

  // Time remaining
  const timeLeft = shift ? getTimeLeft(shift.endTime) : null;

  if (shiftLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress sx={{ color: "#ff0aa2" }} />
      </Box>
    );
  }

  if (!shift) {
    return (
      <ProtectedRoute requireAuth>
        <AppLayout currentPage="work">
          <Box
            minHeight="80vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={3}
            textAlign="center"
          >
            <Typography variant="h6" fontWeight={700} mb={1}>
              Sin turno activo
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              No tienes un turno activo en este momento.
            </Typography>
            <Box
              component="button"
              onClick={() => router.push("/search-shifts")}
              sx={{
                bgcolor: "#ff0aa2",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: 14,
                px: 4,
                py: 1.5,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Buscar Turnos
            </Box>
          </Box>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const phoneFormatted = formatPhone(phone);
  const isComplete = digitsOnly(phone).length === 10;
  const canSubmit = isComplete && !registerMutation.isPending;

  const feedbackColor =
    feedback === "success" ? "#2E7D32" :
    feedback === "duplicate" ? "#E65100" :
    feedback === "error" ? "#C62828" : "transparent";

  const feedbackMsg =
    feedback === "success" ? (recent[0]?.isNewUser ? "¡Nuevo registro!" : "Registro existente") :
    feedback === "duplicate" ? "Número inválido o ficticio" :
    feedback === "error" ? errorMsg : "";

  return (
    <ProtectedRoute requireAuth>
      <AppLayout currentPage="work" showBottomNav={false}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            maxWidth: 440,
            mx: "auto",
            pb: 4,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "#ff0aa2",
              px: 2,
              pt: 2,
              pb: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <IconButton
              size="small"
              onClick={() => router.push("/dashboard")}
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Box flex={1} minWidth={0}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: "#fff", fontSize: 15 }}
                noWrap
              >
                {shift.storeInfo?.name || "Turno Activo"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                {timeLeft ? `Termina en ${timeLeft}` : "Finalizando"}
              </Typography>
            </Box>
            {/* Mini stats */}
            <Box display="flex" gap={1.5} alignItems="center">
              <Box textAlign="center">
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontSize: 10, display: "block" }}>
                  Nuevos
                </Typography>
                <Typography variant="body2" fontWeight={800} sx={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>
                  {stats?.newUsers ?? 0}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontSize: 10, display: "block" }}>
                  Ganancias
                </Typography>
                <Typography variant="body2" fontWeight={800} sx={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>
                  ${(stats?.totalEarnings ?? 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Body */}
          <Box px={2.5} pt={2.5} flex={1}>
            {/* Tier bar */}
            {tierInfo && <TierBar tierInfo={tierInfo} />}

            {/* First shift badge */}
            {(shift.isFirstShiftEver || shift.isFirstShiftAtStore) && (
              <Box mb={2} display="flex" gap={1}>
                {shift.isFirstShiftEver && (
                  <Chip
                    icon={<EmojiEventsIcon sx={{ fontSize: 14, color: "#FF9800 !important" }} />}
                    label="¡Primer turno!"
                    size="small"
                    sx={{ bgcolor: "#FFF3E0", color: "#E65100", fontWeight: 700, fontSize: 11, height: 24, border: "1px solid #FFB74D" }}
                  />
                )}
                {shift.isFirstShiftAtStore && !shift.isFirstShiftEver && (
                  <Chip
                    label="Primera vez en esta tienda"
                    size="small"
                    sx={{ bgcolor: "#F3E5F5", color: "#6A1B9A", fontWeight: 700, fontSize: 11, height: 24, border: "1px solid #CE93D8" }}
                  />
                )}
              </Box>
            )}

            {/* Phone input */}
            <Typography variant="caption" sx={{ color: "#888", fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", mb: 1 }}>
              Número de teléfono
            </Typography>

            <Box
              sx={{
                position: "relative",
                mb: 1.5,
              }}
            >
              <Box
                component="input"
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                placeholder="(555) 000-0000"
                value={phoneFormatted}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyDown}
                disabled={registerMutation.isPending}
                autoFocus
                sx={{
                  width: "100%",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  border: "none",
                  borderBottom: `3px solid ${
                    feedback === "success" ? "#2E7D32" :
                    feedback === "error" || feedback === "duplicate" ? "#C62828" :
                    isComplete ? "#ff0aa2" : "#e0e0e0"
                  }`,
                  outline: "none",
                  bgcolor: "transparent",
                  color: "#111",
                  py: 1.5,
                  px: 1,
                  borderRadius: 0,
                  transition: "border-color 0.2s",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  "::placeholder": { color: "#ccc" },
                  cursor: "text",
                  display: "block",
                  boxSizing: "border-box",
                }}
              />

              <AnimatePresence>
                {registerMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <CircularProgress size={20} sx={{ color: "#ff0aa2" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Feedback */}
            <AnimatePresence mode="wait">
              {feedbackMsg && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: feedbackColor, fontWeight: 700, fontSize: 13, display: "block", textAlign: "center", mb: 1.5 }}
                  >
                    {feedbackMsg}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                width: "100%",
                padding: "18px 0",
                background: canSubmit ? "#ff0aa2" : "#f0f0f0",
                color: canSubmit ? "#fff" : "#bbb",
                border: "none",
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 17,
                cursor: canSubmit ? "pointer" : "not-allowed",
                letterSpacing: "0.02em",
                fontFamily: "inherit",
                transition: "background 0.2s",
                marginBottom: 24,
              }}
            >
              Registrar Número
            </motion.button>

            {/* Recent registrations */}
            {recent.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", mb: 1 }}>
                  Últimos registros
                </Typography>
                <AnimatePresence initial={false}>
                  {recent.map((r, i) => (
                    <RegPill key={r._id} reg={r} idx={i} />
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </Box>
        </Box>

        {/* Milestone overlay */}
        <AnimatePresence>
          {milestone && (
            <MilestoneCelebration
              count={milestone}
              onDone={() => setMilestone(null)}
            />
          )}
        </AnimatePresence>
      </AppLayout>
    </ProtectedRoute>
  );
}

function getTimeLeft(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Finalizado";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
