'use client';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function WelcomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="mobile-container">
        <div className="welcome-container">
          <div className="welcome-content">
            <div className="welcome-logo">
              <Logo size="large" />
            </div>
            
            <div className="welcome-text">
              ¡Comencemos! Ingresa a tu cuenta.
            </div>

            <button
              className="welcome-button"
              onClick={handleLogin}
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

