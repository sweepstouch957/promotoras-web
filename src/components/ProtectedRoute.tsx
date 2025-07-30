'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = require authentication, false = require no authentication
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't - redirect to login
        router.push('/login');
      } else if (!requireAuth && isAuthenticated) {
        // User shouldn't be authenticated but is - redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, requireAuth, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render children if authentication state doesn't match requirement
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

