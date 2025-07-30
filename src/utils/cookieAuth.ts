import Cookies from 'js-cookie';
import { User } from '../types';

// Configuración de cookies
const COOKIE_CONFIG = {
  expires: 7, // 7 días
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict' as const, // Protección CSRF
  path: '/', // Disponible en toda la aplicación
};

// Nombres de las cookies
const COOKIE_NAMES = {
  TOKEN: 'sweepstouch_token',
  USER: 'sweepstouch_user',
} as const;

/**
 * Utilidades para manejar cookies de autenticación
 */
export const cookieAuth = {
  /**
   * Obtiene el token de autenticación desde las cookies
   */
  getToken(): string | null {
    return Cookies.get(COOKIE_NAMES.TOKEN) || null;
  },

  /**
   * Guarda el token de autenticación en cookies
   */
  setToken(token: string): void {
    Cookies.set(COOKIE_NAMES.TOKEN, token, COOKIE_CONFIG);
  },

  /**
   * Elimina el token de autenticación
   */
  removeToken(): void {
    Cookies.remove(COOKIE_NAMES.TOKEN, { path: '/' });
  },

  /**
   * Obtiene los datos del usuario desde las cookies
   */
  getUser(): User | null {
    try {
      const userStr = Cookies.get(COOKIE_NAMES.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return null;
    }
  },

  /**
   * Guarda los datos del usuario en cookies
   */
  setUser(user: User): void {
    Cookies.set(COOKIE_NAMES.USER, JSON.stringify(user), COOKIE_CONFIG);
  },

  /**
   * Elimina los datos del usuario
   */
  removeUser(): void {
    Cookies.remove(COOKIE_NAMES.USER, { path: '/' });
  },

  /**
   * Limpia todas las cookies de autenticación
   */
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  /**
   * Verifica si el usuario está autenticado (tiene token y datos de usuario)
   */
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  },

  /**
   * Guarda tanto el token como los datos del usuario
   */
  setAuthData(token: string, user: User): void {
    this.setToken(token);
    this.setUser(user);
  },
};