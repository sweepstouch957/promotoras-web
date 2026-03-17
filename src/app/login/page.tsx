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
  SwipeableDrawer,
  Stack,
  Tabs,
  Tab,
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
  const [rememberMe, setRememberMe] = useState(false);
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
          background: "linear-gradient(135deg, #ffffff 0%, #fef2f8 50%, #fce7f3 100%)",
          position: "relative",
          overflow: "hidden"
        }}
        px={2}
      >
        {/* Animated decorative blobs */}
        <Box sx={{
          position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(255,0,128,0.15) 0%, rgba(255,0,128,0) 70%)',
          borderRadius: '50%', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite'
        }}/>
        <Box sx={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, rgba(255,105,180,0) 70%)',
          borderRadius: '50%', filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite reverse'
        }}/>

        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
              100% { transform: translateY(0px) scale(1); }
            }
          `}
        </style>

        <Fade in timeout={1000}>
          <Box textAlign="center" mb={6} zIndex={1}>
            <Logo size="large" />
            <Typography mt={3} fontSize={18} color="#333333" fontWeight="500" letterSpacing={1}>
              Bienvenido a Sweepstouch
            </Typography>
            <Typography fontSize={14} color="#666666" mt={1}>
              Tu espacio para gestionar turnos y más.
            </Typography>
          </Box>
        </Fade>

        <Fade in timeout={1500}>
          <Button
            variant="contained"
            onClick={() => setOpenDrawer(true)}
            sx={{
              backgroundColor: "#ff0080",
              color: "white",
              fontWeight: "600",
              borderRadius: "20px",
              fontSize: 16,
              px: 6,
              py: 1.8,
              boxShadow: "0 8px 32px rgba(255,0,128,0.3)",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": { 
                backgroundColor: "#e60073",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(255,0,128,0.4)",
              },
              zIndex: 1
            }}
          >
            Iniciar Sesión
          </Button>
        </Fade>

        <SwipeableDrawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: "auto",
              maxHeight: "90vh",
              maxWidth: 480,
              mx: "auto",
              pt: 2,
              pb: 4,
              px: { xs: 3, sm: 4 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 0, 128, 0.1)",
              boxShadow: "0 -10px 40px rgba(255,0,128,0.15)",
            },
          }}
        >
          {/* Drawer Handle */}
          <Box sx={{ width: 40, height: 4, bgcolor: "rgba(0,0,0,0.1)", borderRadius: 2, mx: "auto", mb: 3 }} />

          <Stack direction="row" justifyContent="flex-start" mb={1}>
            <Button
              onClick={handleBack}
              disabled={isLoading}
              sx={{ color: "#666", fontSize: 14, p: 0, minWidth: 'auto', textTransform: 'none', "&:hover": { color: "#333", background: "transparent" } }}
            >
              ← Atrás
            </Button>
          </Stack>

          <Typography variant="h5" fontWeight={700} textAlign="center" mb={1} color="#333">
            Ingresa a Tu Cuenta
          </Typography>
          <Typography variant="body2" textAlign="center" mb={3} color="#666">
            Selecciona tu método de ingreso
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            variant="fullWidth"
            sx={{
              mb: 3,
              minHeight: 44,
              background: "rgba(255,0,128,0.05)",
              borderRadius: "12px",
              p: 0.5,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab 
              label="Email" 
              sx={{
                minHeight: 36,
                textTransform: 'none',
                fontWeight: 600,
                color: tabIndex === 0 ? "white" : "#666",
                background: tabIndex === 0 ? "#ff0080" : "transparent",
                borderRadius: "10px",
                transition: "all 0.3s",
                "&.Mui-selected": { color: "white" }
              }} 
            />
            <Tab 
              label="Código" 
              sx={{
                minHeight: 36,
                textTransform: 'none',
                fontWeight: 600,
                color: tabIndex === 1 ? "white" : "#666",
                background: tabIndex === 1 ? "#ff0080" : "transparent",
                borderRadius: "10px",
                transition: "all 0.3s",
                "&.Mui-selected": { color: "white" }
              }} 
            />
          </Tabs>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 3, fontSize: "14px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", color: "#d32f2f", border: "1px solid rgba(239, 68, 68, 0.2)" }}
            >
              {error}
            </Alert>
          )}

          {tabIndex === 0 && (
            <Fade in={tabIndex === 0} timeout={400}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ingresa correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{color:"#ff0080"}}/></InputAdornment>,
                    sx: { borderRadius: "12px", color: "#333", background: "white", "& fieldset": { borderColor: "rgba(0,0,0,0.1)" }, "&:hover fieldset": { borderColor: "rgba(255,0,128,0.5)" }, "&.Mui-focused fieldset": { borderColor: "#ff0080" }, "& input": { color: "#333" } }
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{color:"#ff0080"}}/></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "#666" }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px", color: "#333", background: "white", "& fieldset": { borderColor: "rgba(0,0,0,0.1)" }, "&:hover fieldset": { borderColor: "rgba(255,0,128,0.5)" }, "&.Mui-focused fieldset": { borderColor: "#ff0080" }, "& input": { color: "#333" }  }
                  }}
                  sx={{ mb: 1 }}
                />
              </Box>
            </Fade>
          )}

          {tabIndex === 1 && (
            <Fade in={tabIndex === 1} timeout={400}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Ingresa tu Código de Acceso"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><VpnKeyOutlinedIcon sx={{color:"#ff0080"}}/></InputAdornment>,
                    sx: { borderRadius: "12px", color: "#333", background: "white", "& fieldset": { borderColor: "rgba(0,0,0,0.1)" }, "&:hover fieldset": { borderColor: "rgba(255,0,128,0.5)" }, "&.Mui-focused fieldset": { borderColor: "#ff0080" }, "& input": { color: "#333" } }
                  }}
                  sx={{ mb: 1 }}
                />
              </Box>
            </Fade>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                sx={{ color: "#666", "&.Mui-checked": { color: "#ff0080" } }}
              />
            }
            label={
              <Typography fontSize={14} color="#666">
                Recuérdame
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading || (tabIndex === 0 ? (!email || !password) : (!accessCode))}
            sx={{
              backgroundColor: "#ff0080",
              color: "white",
              fontWeight: "600",
              py: 1.5,
              borderRadius: "12px",
              fontSize: 16,
              textTransform: "none",
              boxShadow: "0 4px 14px 0 rgba(255,0,128,0.39)",
              "&:hover": { backgroundColor: "#e60073", boxShadow: "0 6px 20px rgba(255,0,128,0.23)" },
              "&:disabled": { backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.3)" }
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: "#ff0080" }} /> : "Continuar"}
          </Button>

          <Box mt={4} textAlign="center">
             <Image 
              src={Sweepstouch}
              alt="Sweepstouch Logo"
              width={160}
              height={60}
              style={{ margin: "0 auto", display: "block", objectFit: "contain" }}
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
