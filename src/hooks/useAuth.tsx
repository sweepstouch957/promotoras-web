'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, AuthState } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  updateUserData: (user: User) => void;
  loginMutation: any;
  logoutMutation: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const queryClient = useQueryClient();

  // Query para validar token al cargar la aplicación
  const { data: validatedUser, isLoading: isValidating } = useQuery({
    queryKey: ['auth', 'validate'],
    queryFn: async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('sweepstouch_token');
          if (!token) {
            throw new Error('No token found');
          }
          return await authService.validateToken();
        }
        throw new Error('Window not available');
      } catch (error) {
        // Si falla la validación, limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sweepstouch_token');
          localStorage.removeItem('sweepstouch_user');
        }
        throw error;
      }
    },
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 0, // Siempre validar
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await authService.login(email, password);
    },
    onSuccess: (data) => {
      
      const { user } = data;      
      
      // Actualizar estado local
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });

      // Actualizar cache de React Query
      queryClient.setQueryData(['auth', 'user'], user);
      queryClient.setQueryData(['auth', 'validate'], user);
    },
    onError: (error) => {
      console.error('Login error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });

      // Limpiar cache de React Query
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Aún así limpiar el estado local
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      queryClient.clear();
    },
  });

  // Mutation para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      return await authService.updateProfile(userId, updates);
    },
    onSuccess: (updatedUser) => {
      // Actualizar estado local
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      // Actualizar localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('sweepstouch_user', JSON.stringify(updatedUser));
      }

      // Actualizar cache de React Query
      queryClient.setQueryData(['auth', 'user'], updatedUser);
      queryClient.setQueryData(['auth', 'validate'], updatedUser);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });

  // Efecto para manejar el estado de autenticación basado en la validación
  useEffect(() => {
    if (!isValidating) {
      if (validatedUser) {
        setAuthState({
          isAuthenticated: true,
          user: validatedUser,
          loading: false,
        });
      } else {
        // Intentar cargar desde localStorage como fallback
        try {
          if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('sweepstouch_user');
            const savedToken = localStorage.getItem('sweepstouch_token');
            
            if (savedUser && savedToken) {
              const user = JSON.parse(savedUser);
              setAuthState({
                isAuthenticated: true,
                user,
                loading: false,
              });
            } else {
              setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
              });
            }
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      }
    }
  }, [validatedUser, isValidating]);

  // Funciones de compatibilidad
  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response= loginMutation.mutateAsync({ email, password });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const updateUser = async (userData: Partial<User>) => {
    if (authState.user) {
      try {
        await updateProfileMutation.mutateAsync({
          userId: authState.user.id,
          updates: userData,
        });
      } catch (error) {
        console.error('Error updating user:', error);
        // Fallback a actualización local si la API falla
        const localUpdatedUser = { ...authState.user, ...userData };
        if (typeof window !== 'undefined') {
          localStorage.setItem('sweepstouch_user', JSON.stringify(localUpdatedUser));
        }
        setAuthState(prev => ({
          ...prev,
          user: localUpdatedUser,
        }));
      }
    }
  };

  const updateUserData = (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sweepstouch_user', JSON.stringify(user));
    }
    setAuthState(prev => ({
      ...prev,
      user,
    }));
    
    // Actualizar cache de React Query
    queryClient.setQueryData(['auth', 'user'], user);
    queryClient.setQueryData(['auth', 'validate'], user);
  };

  // Determinar el estado de loading
  const loading = authState.loading || isValidating || loginMutation.isPending || logoutMutation.isPending;

  const value: AuthContextType = {
    ...authState,
    loading,
    login,
    logout,
    updateUser,
    updateUserData,
    loginMutation,
    logoutMutation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

