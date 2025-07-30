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
  Checkbox,
  Button,
  FormControlLabel,
  CircularProgress,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import { Stack } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginMutation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const theme = useTheme();

  const handleBack = () => {
    router.push("/welcome");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido.");
      return;
    }

    try {
      setError(null);
      const data = await login(email, password);
      if (data.success) {
        const { user } = data;
        if (!user?.profileImage) {
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
        bgcolor="#e6e6e6"
        px={2}
      >
        <Box textAlign="center" mb={4}>
          <Logo size="large" />
          <Typography mt={2} fontSize={14}>
            ¡Comencemos! Ingresa a tu cuenta.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setOpenDrawer(true)}
          sx={{
            backgroundColor: "#ff0080",
            color: "white",
            fontWeight: "bold",
            borderRadius: 99,
            fontSize: 16,
            px: 5,
            py: 1.5,
            "&:hover": { backgroundColor: "#e60073" },
          }}
        >
          Ingresar
        </Button>

        <SwipeableDrawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              height: "90vh",
              maxWidth: 480,
              mx: "auto",
              p: 3,
            },
          }}
        >
         <Stack direction="row" justifyContent="flex-start">
           <Button
            onClick={handleBack}
            disabled={isLoading}
            sx={{ mb: 2, fontSize: 14 }}
          >
            ← Atrás
          </Button>
         </Stack>

          <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
            Ingresa a Tu Cuenta
          </Typography>
          <Typography variant="body2" textAlign="center" mb={3}>
            Aquí puedes ver tu progreso y gestionar tus turnos.
          </Typography>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2, fontSize: "14px" }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ingresa correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <Box position="relative" mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                sx={{ color: "#ff0080" }}
              />
            }
            label={
              <Typography fontSize={14} color="#ff0080">
                Recuérdame
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            sx={{
              backgroundColor: "#ff0080",
              color: "white",
              fontWeight: "bold",
              py: 1.5,
              borderRadius: 99,
              fontSize: 16,
              "&:hover": { backgroundColor: "#e60073" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {isLoading && (
              <CircularProgress size={20} sx={{ color: "white" }} />
            )}
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>

          <Box mt={4} textAlign="center">
             <Image 
              src={Sweepstouch}
              alt="Sweepstouch Logo"
              width={200}
              height={80}
              style={{ margin: "0 auto", display: "block",objectFit: "contain" }}
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
