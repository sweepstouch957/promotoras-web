'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileSelector from '../../components/ProfileSelector';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [loginUser, setLoginUser] = useState<any>(null);

  const handleBack = () => {
    router.push('/welcome');
  };

  const handleLogin = async () => {
    if (email && password) {
      const success = await login(email, password);
      if (success) {
        // Esperar un momento para que el localStorage se actualice
        setTimeout(() => {
          const userData = JSON.parse(localStorage.getItem('sweepstouch_user') || '{}');
          console.log('Usuario logueado:', userData);
          console.log('¿Es primer login?:', userData.isFirstLogin);
          
          if (userData.isFirstLogin === true) {
            // Redirigir a upload-photo para primer login
            console.log('Redirigiendo a upload-photo');
            router.push('/upload-photo');
          } else {
            console.log('Redirigiendo a dashboard');
            router.push('/dashboard');
          }
        }, 100);
      } else {
        // Handle login error
        console.error('Login failed');
        alert('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
      }
    } else {
      alert('Por favor completa todos los campos.');
    }
  };

  const handleProfileSelected = (profileImage: string) => {
    setShowProfileSelector(false);
    router.push('/dashboard');
  };

  const handleProfileSelectorClose = () => {
    setShowProfileSelector(false);
    router.push('/dashboard');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="mobile-container">
        <div className="login-container">
          <a href="#" onClick={handleBack} className="login-back-button">
            ← Atrás
          </a>
          
          <h1 className="login-title">Ingresa a Tu Cuenta</h1>
          <p className="login-subtitle">
            Aquí puedes ver tu progreso y gestionar tus turnos.
          </p>

          <div className="login-form">
            <input
              type="email"
              placeholder="Ingresa correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="password-toggle"
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
              />
              <label htmlFor="remember">Recuérdame</label>
            </div>

            <button onClick={handleLogin} className="login-button">
              Ingresar
            </button>
          </div>

          <div className="login-logo">
            <Logo size="small" />
          </div>

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

