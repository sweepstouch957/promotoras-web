'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileSelector from '../../components/ProfileSelector';
import Logo from '../../components/Logo';
import { CircularProgress, Alert } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/welcome');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido.');
      return;
    }

    try {
      setError(null);
      const data = await login(email, password);      
      if (data.data.success) {
        const { user } = data.data;
        console.log('Login successful:', user);
        
        // Obtener datos del usuario después del login exitoso
        if (!user?.profileImage) {
          console.log('Necesita configurar foto de perfil');
          setShowProfileSelector(true);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleProfileSelected = (profileImage: string) => {
    setShowProfileSelector(false);
  };

  const handleProfileSelectorClose = () => {
    setShowProfileSelector(false);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const isLoading = loginMutation?.isPending || false;

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="mobile-container">
        <div className="login-container">
          <a 
            href="#" 
            onClick={handleBack} 
            className="login-back-button"
            style={{ 
              opacity: isLoading ? 0.5 : 1,
              pointerEvents: isLoading ? 'none' : 'auto'
            }}
          >
            ← Atrás
          </a>
          
          <h1 className="login-title">Ingresa a Tu Cuenta</h1>
          <p className="login-subtitle">
            Aquí puedes ver tu progreso y gestionar tus turnos.
          </p>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom: '16px' }}>
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ fontSize: '14px' }}
              >
                {error}
              </Alert>
            </div>
          )}

          <div className="login-form">
            <input
              type="email"
              placeholder="Ingresa correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              disabled={isLoading}
              style={{ 
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
            />
            
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'text'
                }}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="password-toggle"
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="remember-checkbox">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              />
              <label 
                htmlFor="remember"
                style={{ 
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                Recuérdame
              </label>
            </div>

            <button 
              onClick={handleLogin} 
              className="login-button"
              disabled={isLoading || !email || !password}
              style={{ 
                opacity: (isLoading || !email || !password) ? 0.5 : 1,
                cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading && <CircularProgress size={20} sx={{ color: 'white' }} />}
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>

          <div className="login-logo">
            <Logo size="small" />
          </div>

          {/* Profile Selector Modal */}
          <ProfileSelector
            open={showProfileSelector}
            onClose={handleProfileSelectorClose}
            onProfileSelected={handleProfileSelected}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

