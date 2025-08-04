import axios, { AxiosInstance, AxiosResponse } from "axios";
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
  PaginatedResponse,
  Pagination,
} from "../types";
import { cookieAuth } from "../utils/cookieAuth";

// Configuración de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api";

interface PaginatedShiftResponse {
  shifts: Shift[];
  pagination: Pagination;
}

// Instancia de Axios configurada
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor para agregar token de autenticación
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = cookieAuth.getToken();
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
        if (typeof window !== "undefined") {
          cookieAuth.clearAuth();
          window.location.href = "/login";
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
}

// Servicio de Autenticación
export class AuthService extends BaseApiService {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const loginData: LoginRequest = { email, password };
    const response: any = await this.api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      loginData
    );

    if (typeof window !== "undefined") {
      cookieAuth.setAuthData(response.data.token, response.data.user);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      if (typeof window !== "undefined") {
        cookieAuth.clearAuth();
      }
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const response: any = await this.api.patch<ApiResponse<User>>(
      `/auth/users/profile/${userId}/`,
      updates
    );
    return response.data;
  }

  async uploadProfileImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("photo", file);

    const response: any = await this.api.post<ApiResponse<UploadResponse>>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  async validateToken(): Promise<User> {
    const response: any = await this.api.get<ApiResponse<User>>("/auth/me");
    return response.data.user;
  }
}

// Servicio de Turnos
export class ShiftService extends BaseApiService {
  async getAvailableShifts(
    page = 1,
    limit = 10
  ): Promise<PaginatedShiftResponse> {
    const response = await this.api.get<PaginatedShiftResponse>(
      `/promoter/shifts/available?page=${page}&limit=${limit}`
    );
    return response.data;
  }
  async getPromoterShifts(
    promoterId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Shift>> {
    const response: any = await this.api.get<
      ApiResponse<PaginatedResponse<Shift>>
    >(`/promoter/shifts/promoter/${promoterId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getActiveShift(promoterId: string): Promise<ActiveShift | null> {
    try {
      const response: any = await this.api.get<ApiResponse<ActiveShift>>(
        `/promoter/shifts/active/${promoterId}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async requestShift(shiftId: string, promoterId: string): Promise<Shift> {
    const response: any = await this.api.post<ApiResponse<Shift>>(
      `/promoter/shifts/${shiftId}/request`,
      {
        promoterId,
      }
    );
    return response.data;
  }

  async createShiftRequest(shiftId: string, promoterId: string): Promise<Shift> {
    const response: any = await this.api.post<ApiResponse<Shift>>(
      `/promoter/shifts/requests`,
      {
        shiftId,
        promoterId,
      }
    );  
    return response.data; 
  }

  async startShift(shiftId: string, promoterId: string): Promise<ActiveShift> {
    const response: any = await this.api.post<ApiResponse<ActiveShift>>(
      `/promoter/shifts/${shiftId}/start`,
      {
        promoterId,
      }
    );
    return response.data;
  }

  async endShift(
    shiftId: string,
    promoterId: string,
    contactsCaptured: number
  ): Promise<Shift> {
    const response: any = await this.api.post<ApiResponse<Shift>>(
      `/promoter/shifts/${shiftId}/end`,
      {
        promoterId,
        contactsCaptured,
      }
    );
    return response.data;
  }

  async updateShiftProgress(
    shiftId: string,
    contactsCaptured: number
  ): Promise<ActiveShift> {
    const response: any = await this.api.put<ApiResponse<ActiveShift>>(
      `/promoter/shifts/${shiftId}/progress`,
      {
        contactsCaptured,
      }
    );
    return response.data;
  }
}

// Servicio de Métricas
export class MetricsService extends BaseApiService {
  async getPromoterStats(promoterId: string): Promise<PromoterStats> {
    const response: any = await this.api.get<ApiResponse<PromoterStats>>(
      `/promoter/metrics/promoter/${promoterId}/stats`
    );
    return response.data;
  }

  async getPromoterMetrics(promoterId: string): Promise<PromoterMetrics> {
    const response: any = await this.api.get<ApiResponse<PromoterMetrics>>(
      `/promoter/metrics/promoter/${promoterId}`
    );
    return response.data;
  }

  async getHistoricalData(
    promoterId: string,
    period: "week" | "month" | "year" = "week"
  ): Promise<any[]> {
    const response: any = await this.api.get<ApiResponse<any[]>>(
      `/promoter/metrics/promoter/${promoterId}/historical?period=${period}`
    );
    return response.data;
  }

  async getDashboardData(promoterId: string): Promise<{
    stats: PromoterStats;
    recentShifts: Shift[];
    activeShift: ActiveShift | null;
  }> {
    const response: any = await this.api.get<
      ApiResponse<{
        stats: PromoterStats;
        recentShifts: Shift[];
        activeShift: ActiveShift | null;
      }>
    >(`/promoter/metrics/promoter/${promoterId}/dashboard`);
    return response.data;
  }
}

// Servicio de Upload
export class UploadService extends BaseApiService {
  async uploadPhoto(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "profile_photos");

    const response: any = await this.api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

// Instancias de servicios exportadas
export const authService = new AuthService();
export const shiftService = new ShiftService();
export const metricsService = new MetricsService();
export const uploadService = new UploadService();

export const authAPI = {
  login: (email: string, password: string) =>
    authService.login(email, password),
  updateUser: (userId: string, updates: Partial<User>) =>
    authService.updateProfile(userId, updates),
};

export const shiftAPI = {
  getUserShifts: (userId: string) => shiftService.getPromoterShifts(userId),
  getAvailableShifts: () => shiftService.getAvailableShifts(),
  requestShift: (userId: string, shiftId: string) =>
    shiftService.requestShift(shiftId, userId),
  createShiftRequest: (userId: string, shiftId: string) =>
    shiftService.createShiftRequest(shiftId, userId),
};

export const performanceAPI = {
  getUserPerformance: (userId: string) =>
    metricsService.getPromoterMetrics(userId),
  getUserStats: (userId: string) => metricsService.getPromoterStats(userId),
};
