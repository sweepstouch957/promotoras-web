"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, AuthState } from "../types";
import { authService } from "../services/api";
import { cookieAuth } from "../utils/cookieAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  updateUserData: (user: User) => void;
  loginMutation: any;
  logoutMutation: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⛔️ Solo estos roles pueden entrar
const ALLOWED_ROLES = new Set(["merchant", "promotor"]);

function isRoleAllowed(user?: User | null) {
  return !!user && ALLOWED_ROLES.has(String(user.role || "").toLowerCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const queryClient = useQueryClient();

  // Query para validar token al cargar la aplicación
  const { data: validatedUser, isLoading: isValidating } = useQuery({
    queryKey: ["auth", "validate"],
    queryFn: async () => {
      try {
        if (typeof window !== "undefined") {
          const token = cookieAuth.getToken();
          if (!token) {
            throw new Error("No token found");
          }
          const u = await authService.validateToken();
          // 🔐 Validar rol después de validar token
          if (!isRoleAllowed(u)) {
            cookieAuth.clearAuth();
            throw new Error("__role_blocked_validate");
          }
          return u;
        }
        throw new Error("Window not available");
      } catch (error) {
        if (typeof window !== "undefined") {
          cookieAuth.clearAuth();
        }
        throw error;
      }
    },
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 0, // Siempre validar
  });

  // Mutation para login (validación de rol dentro del mutationFn)
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const data = await authService.login(email, password);
      const { user, token } = data || {};
      // 🔐 Validar rol inmediatamente al loguear
      if (!isRoleAllowed(user)) {
        // Limpieza completa y bloqueo
        cookieAuth.clearAuth();
        // feedback opcional
        toast.error(
          `No puedes iniciar sesión con el rol "${
            user?.role ?? "desconocido"
          }". Contacta a soporte.`
        );
        // Lanzar para que mutateAsync rechace
        const err = new Error("__role_blocked");
        // @ts-expect-error attach flag
        err.code = "__role_blocked";
        throw err;
      }
      // Si el rol es válido, persistimos
      cookieAuth.setAuthData(token, user);
      return data;
    },
    onSuccess: (data) => {
      const { user } = data;
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      queryClient.setQueryData(["auth", "user"], user);
      queryClient.setQueryData(["auth", "validate"], user);
    },
    onError: (error: any) => {
      // Si vino por rol bloqueado ya mostramos toast arriba; evitamos duplicar
      if (error?.message !== "__role_blocked") {
        console.error("Login error:", error);
        toast.error(error?.message || "Error al iniciar sesión");
      }
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
      cookieAuth.clearAuth();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      cookieAuth.clearAuth();
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
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<User>;
    }) => {
      return await authService.updateProfile(userId, updates);
    },
    onSuccess: (updatedUser) => {
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      if (typeof window !== "undefined") {
        cookieAuth.setUser(updatedUser);
      }
      queryClient.setQueryData(["auth", "user"], updatedUser);
      queryClient.setQueryData(["auth", "validate"], updatedUser);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  // Efecto para manejar el estado de autenticación basado en la validación
  useEffect(() => {
    if (!isValidating) {
      if (validatedUser) {
        // ✅ Usuario validado por token Y rol
        setAuthState({
          isAuthenticated: true,
          user: validatedUser,
          loading: false,
        });
      } else {
        // Fallback desde cookies
        try {
          if (typeof window !== "undefined") {
            const savedUser = cookieAuth.getUser();
            const savedToken = cookieAuth.getToken();

            if (savedUser && savedToken) {
              // 🔐 Validar rol también en fallback
              if (!isRoleAllowed(savedUser)) {
                cookieAuth.clearAuth();
                setAuthState({
                  isAuthenticated: false,
                  user: null,
                  loading: false,
                });
                toast.error(
                  `No puedes iniciar sesión con el rol "${
                    savedUser?.role ?? "desconocido"
                  }".`
                );
                router.push("/login");
                return;
              }

              setAuthState({
                isAuthenticated: true,
                user: savedUser,
                loading: false,
              });
            } else {
              router.push("/login");
              setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
              });
            }
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedUser, isValidating]);

  // Funciones de compatibilidad
  const login = async (email: string, password: string): Promise<any> => {
    try {
      // ⛔️ Si el rol no está permitido, mutateAsync rechaza con "__role_blocked"
      const response = await loginMutation.mutateAsync({ email, password });
      return response;
    } catch (error: any) {
      // No hacemos toast aquí para evitar duplicados (ya se maneja en onError o mutationFn)
      if (error?.message === "__role_blocked") {
        // Re-emit por si el caller quiere manejarlo
        throw error;
      }
      console.error("Login failed:", error);
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
        console.error("Error updating user:", error);
        const localUpdatedUser = { ...authState.user, ...userData };
        if (typeof window !== "undefined") {
          cookieAuth.setUser(localUpdatedUser);
        }
        setAuthState((prev) => ({
          ...prev,
          user: localUpdatedUser,
        }));
      }
    }
  };

  const updateUserData = (user: User) => {
    if (typeof window !== "undefined") {
      cookieAuth.setUser(user);
    }
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
    queryClient.setQueryData(["auth", "user"], user);
    queryClient.setQueryData(["auth", "validate"], user);
  };

  // Determinar el estado de loading
  const loading =
    authState.loading ||
    isValidating ||
    loginMutation.isPending ||
    logoutMutation.isPending;

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
