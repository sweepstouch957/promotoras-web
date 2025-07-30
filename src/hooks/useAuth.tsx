'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  updateUserData: (user: User) => void; // Nueva función para actualizar datos directamente
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('sweepstouch_user');
          if (savedUser) {
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
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const user = await authAPI.login(email, password);
      
      if (user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sweepstouch_user', JSON.stringify(user));
        }
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
        return true;
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sweepstouch_user');
    }
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  const updateUser = async (userData: Partial<User>) => {
    if (authState.user) {
      try {
        // Call API to update user
        const updatedUser = await authAPI.updateUser(authState.user.id, userData);
        if (updatedUser) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('sweepstouch_user', JSON.stringify(updatedUser));
          }
          setAuthState(prev => ({
            ...prev,
            user: updatedUser,
          }));
        }
      } catch (error) {
        console.error('Error updating user:', error);
        // Fallback to local update if API fails
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
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    updateUserData,
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

