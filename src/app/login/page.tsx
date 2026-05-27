"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProfileSelector from "../../components/ProfileSelector";
import Sweepstouch from "@public/sweepstouch.png";
import Logo from "../../components/Logo";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  SwipeableDrawer,
  Stack,
  Fade,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithAccessCode, loginMutation } = useAuth();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleBack = () => {
    router.push("/welcome");
  };

  const handleLogin = async () => {
    setError(null);
    let data;

    try {
      if (tabIndex === 0) {
        if (!email || !password) {
          setError("Por favor completa todos los campos.");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Por favor ingresa un email válido.");
          return;
        }
        data = await login(email, password);
      } else {
        if (!accessCode) {
          setError("Por favor ingresa tu código de acceso.");
          return;
        }
        data = await loginWithAccessCode(accessCode);
      }

      if (data && data.success) {
        const { user } = data;
        if (!user?.profileImage || user.profileImage === "default-profile.png") {
          setShowProfileSelector(true);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      setError(
        error.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const isLoading = loginMutation?.isPending || false;

  return (
    <ProtectedRoute requireAuth={false}>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
        px={2}
      >
        {/* Background pattern */}
        <Box sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,0,128,0.06) 0%, transparent 55%), radial-gradient(circle at 75% 80%, rgba(233,30,99,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <style>{`
          @keyframes rise {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <Fade in timeout={700}>
          <Box
            textAlign="center"
            zIndex={1}
            sx={{ animation: "rise 0.6s ease-out both" }}
            mb={7}
          >
            <Logo size="large" />
            <Typography
              mt={3}
              fontSize={22}
              color="#111"
              fontWeight={700}
              letterSpacing="-0.01em"
              lineHeight={1.2}
            >
              Portal de Impulsadoras
            </Typography>
            <Typography fontSize={14} color="#888" mt={1}>
              Gestiona tus turnos y ganancias en un solo lugar.
            </Typography>
          </Box>
        </Fade>

        <Fade in timeout={900}>
          <Box zIndex={1} width="100%" maxWidth={320} textAlign="center">
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpenDrawer(true)}
              sx={{
                backgroundColor: "#ff0080",
                color: "white",
                fontWeight: 700,
                borderRadius: "14px",
                fontSize: 16,
                py: 1.75,
                boxShadow: "0 6px 24px rgba(255,0,128,0.28)",
                textTransform: "none",
                letterSpacing: "0.01em",
                "&:hover": {
                  backgroundColor: "#e60073",
                  boxShadow: "0 8px 32px rgba(255,0,128,0.38)",
                },
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Fade>

        <SwipeableDrawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: "auto",
              maxHeight: "92vh",
              maxWidth: 480,
              mx: "auto",
              pt: 1.5,
              pb: 5,
              px: { xs: 3, sm: 4 },
              background: "#fff",
              boxShadow: "0 -4px 40px rgba(0,0,0,0.10)",
            },
          }}
        >
          {/* Handle */}
          <Box sx={{ width: 36, height: 4, bgcolor: "#e0e0e0", borderRadius: 2, mx: "auto", mb: 2.5 }} />

          <Stack direction="row" justifyContent="flex-start" mb={2}>
            <Button
              onClick={handleBack}
              disabled={isLoading}
              sx={{
                color: "#888",
                fontSize: 13,
                p: 0,
                minWidth: "auto",
                textTransform: "none",
                "&:hover": { color: "#333", background: "transparent" },
              }}
            >
              ← Atrás
            </Button>
          </Stack>

          <Typography variant="h5" fontWeight={800} mb={0.5} color="#111" letterSpacing="-0.01em">
            Bienvenida
          </Typography>
          <Typography variant="body2" mb={3} color="#888" fontSize={14}>
            Ingresa con tu correo o código de acceso.
          </Typography>

          {/* Tab toggle */}
          <Box
            sx={{
              display: "flex",
              bgcolor: "#f5f5f5",
              borderRadius: "12px",
              p: "3px",
              mb: 3,
            }}
          >
            {["Correo", "Código"].map((label, i) => (
              <Box
                key={i}
                onClick={() => setTabIndex(i)}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  py: 0.875,
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  transition: "all 0.2s",
                  bgcolor: tabIndex === i ? "#fff" : "transparent",
                  color: tabIndex === i ? "#ff0080" : "#888",
                  boxShadow: tabIndex === i ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  userSelect: "none",
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                mb: 2.5,
                fontSize: 13,
                borderRadius: "10px",
                bgcolor: "rgba(239,68,68,0.07)",
                color: "#c62828",
                border: "1px solid rgba(239,68,68,0.18)",
                "& .MuiAlert-icon": { color: "#c62828" },
              }}
            >
              {error}
            </Alert>
          )}

          {tabIndex === 0 && (
            <Fade in={tabIndex === 0} timeout={300}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "#ccc", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    sx: fieldSx,
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#ccc", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "#bbb" }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: fieldSx,
                  }}
                  sx={{ mb: 3 }}
                />
              </Box>
            </Fade>
          )}

          {tabIndex === 1 && (
            <Fade in={tabIndex === 1} timeout={300}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Código de acceso"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlinedIcon sx={{ color: "#ccc", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    sx: fieldSx,
                  }}
                  sx={{ mb: 3 }}
                />
              </Box>
            </Fade>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading || (tabIndex === 0 ? !email || !password : !accessCode)}
            sx={{
              bgcolor: "#ff0080",
              color: "#fff",
              fontWeight: 700,
              py: 1.625,
              borderRadius: "12px",
              fontSize: 15,
              textTransform: "none",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 16px rgba(255,0,128,0.32)",
              "&:hover": {
                bgcolor: "#e60073",
                boxShadow: "0 6px 20px rgba(255,0,128,0.28)",
              },
              "&:disabled": { bgcolor: "#f0f0f0", color: "#bbb", boxShadow: "none" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "#ff0080" }} />
            ) : (
              "Entrar"
            )}
          </Button>

          <Box mt={4} textAlign="center">
            <Image
              src={Sweepstouch}
              alt="Sweepstouch Logo"
              width={140}
              height={52}
              style={{ margin: "0 auto", display: "block", objectFit: "contain", opacity: 0.6 }}
            />
          </Box>

          <ProfileSelector
            open={showProfileSelector}
            onClose={() => setShowProfileSelector(false)}
            onProfileSelected={() => setShowProfileSelector(false)}
          />
        </SwipeableDrawer>
      </Box>
    </ProtectedRoute>
  );
}

const fieldSx = {
  borderRadius: "12px",
  color: "#333",
  bgcolor: "#fafafa",
  "& fieldset": { borderColor: "#ebebeb" },
  "&:hover fieldset": { borderColor: "rgba(255,0,128,0.4)" },
  "&.Mui-focused fieldset": { borderColor: "#ff0080" },
  "& input": { color: "#333", fontSize: 14 },
};
