import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Shift, 
  ActiveShift,
  LoginRequest, 
  LoginResponse, 
  PromoterStats, 
  PromoterMetrics,
  UploadResponse,
  ApiResponse,
  PaginatedResponse
} from '../types';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

// Instancia de Axios configurada
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para agregar token de autenticación
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('sweepstouch_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado o inválido
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sweepstouch_token');
          localStorage.removeItem('sweepstouch_user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Clase base para servicios API
abstract class BaseApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = createApiInstance();
  }

  protected async handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>
  ): Promise<T> {
    try {
      const response = await request;
      const { data } = response.data;
      if (response.data.success && data) {
        return data;
      }
      throw new Error(response.data.message || 'Error en la respuesta de la API');
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error de conexión con el servidor'
      );
    }
  }
}

// Servicio de Autenticación
export class AuthService extends BaseApiService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const loginData: LoginRequest = { email, password };
    const response = await this.api.post<ApiResponse<LoginResponse>>('/auth/login', loginData);
    
    const result = await this.handleRequest(Promise.resolve(response));
    
    // Guardar token en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sweepstouch_token', result.token);
      localStorage.setItem('sweepstouch_user', JSON.stringify(result.user));
    }
    
    return result;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sweepstouch_token');
        localStorage.removeItem('sweepstouch_user');
      }
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.handleRequest(
      this.api.put<ApiResponse<User>>(`/auth/profile/${userId}`, updates)
    );
  }

  async uploadProfileImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.handleRequest(
      this.api.post<ApiResponse<UploadResponse>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  async validateToken(): Promise<User> {
    return this.handleRequest(
      this.api.get<ApiResponse<User>>('/auth/validate')
    );
  }
}

// Servicio de Turnos
export class ShiftService extends BaseApiService {
  async getAvailableShifts(page = 1, limit = 10): Promise<PaginatedResponse<Shift>> {
    return this.handleRequest(
      this.api.get<ApiResponse<PaginatedResponse<Shift>>>(
        `/shifts/available?page=${page}&limit=${limit}`
      )
    );
  }

  async getPromoterShifts(promoterId: string, page = 1, limit = 10): Promise<PaginatedResponse<Shift>> {
    return this.handleRequest(
      this.api.get<ApiResponse<PaginatedResponse<Shift>>>(
        `/shifts/promoter/${promoterId}?page=${page}&limit=${limit}`
      )
    );
  }

  async getActiveShift(promoterId: string): Promise<ActiveShift | null> {
    try {
      return await this.handleRequest(
        this.api.get<ApiResponse<ActiveShift>>(`/shifts/active/${promoterId}`)
      );
    } catch (error) {
      // Si no hay turno activo, retornar null
      return null;
    }
  }

  async requestShift(shiftId: string, promoterId: string): Promise<Shift> {
    return this.handleRequest(
      this.api.post<ApiResponse<Shift>>(`/shifts/${shiftId}/request`, { promoterId })
    );
  }

  async startShift(shiftId: string, promoterId: string): Promise<ActiveShift> {
    return this.handleRequest(
      this.api.post<ApiResponse<ActiveShift>>(`/shifts/${shiftId}/start`, { promoterId })
    );
  }

  async endShift(shiftId: string, promoterId: string, contactsCaptured: number): Promise<Shift> {
    return this.handleRequest(
      this.api.post<ApiResponse<Shift>>(`/shifts/${shiftId}/end`, { 
        promoterId, 
        contactsCaptured 
      })
    );
  }

  async updateShiftProgress(shiftId: string, contactsCaptured: number): Promise<ActiveShift> {
    return this.handleRequest(
      this.api.put<ApiResponse<ActiveShift>>(`/shifts/${shiftId}/progress`, { 
        contactsCaptured 
      })
    );
  }
}

// Servicio de Métricas
export class MetricsService extends BaseApiService {
  async getPromoterStats(promoterId: string): Promise<PromoterStats> {
    return this.handleRequest(
      this.api.get<ApiResponse<PromoterStats>>(`/metrics/promoter/${promoterId}/stats`)
    );
  }

  async getPromoterMetrics(promoterId: string): Promise<PromoterMetrics> {
    return this.handleRequest(
      this.api.get<ApiResponse<PromoterMetrics>>(`/metrics/promoter/${promoterId}`)
    );
  }

  async getHistoricalData(promoterId: string, period: 'week' | 'month' | 'year' = 'week'): Promise<any[]> {
    return this.handleRequest(
      this.api.get<ApiResponse<any[]>>(`/metrics/promoter/${promoterId}/historical?period=${period}`)
    );
  }

  async getDashboardData(promoterId: string): Promise<{
    stats: PromoterStats;
    recentShifts: Shift[];
    activeShift: ActiveShift | null;
  }> {
    return this.handleRequest(
      this.api.get<ApiResponse<{
        stats: PromoterStats;
        recentShifts: Shift[];
        activeShift: ActiveShift | null;
      }>>(`/metrics/promoter/${promoterId}/dashboard`)
    );
  }
}

// Servicio de Upload
export class UploadService extends BaseApiService {
  async uploadPhoto(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.handleRequest(
      this.api.post<ApiResponse<UploadResponse>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }
}

// Instancias de servicios exportadas
export const authService = new AuthService();
export const shiftService = new ShiftService();
export const metricsService = new MetricsService();
export const uploadService = new UploadService();

// Exportaciones de compatibilidad (para no romper código existente)
export const authAPI = {
  login: (email: string, password: string) => authService.login(email, password),
  updateUser: (userId: string, updates: Partial<User>) => authService.updateProfile(userId, updates),
};

export const shiftAPI = {
  getUserShifts: (userId: string) => shiftService.getPromoterShifts(userId),
  getAvailableShifts: () => shiftService.getAvailableShifts(),
  requestShift: (userId: string, shiftId: string) => shiftService.requestShift(shiftId, userId),
};

export const performanceAPI = {
  getUserPerformance: (userId: string) => metricsService.getPromoterMetrics(userId),
  getUserStats: (userId: string) => metricsService.getPromoterStats(userId),
};

