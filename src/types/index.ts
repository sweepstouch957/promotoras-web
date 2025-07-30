export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  totalShifts: number;
  completedShifts: number;
  upcomingShifts: number;
  totalEarnings: number;
  isFirstLogin?: boolean;
}

export interface Shift {
  id: string;
  supermarketName: string;
  address: string;
  distance: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'requested' | 'confirmed' | 'completed' | 'active';
  earnings?: number;
  numbersCollected?: number;
  promotorId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ActiveShift {
  id: string;
  promotorId: string;
  supermarketName: string;
  address: string;
  startTime: string;
  endTime: string;
  numbersCollected: number;
  timeRemaining: string;
  status: 'active' | 'paused' | 'completed';
  targetContacts: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Performance {
  totalShifts: number;
  totalEarnings: number;
  averagePerShift: number;
  currentShift?: CurrentShift;
  goalProgress: number;
  historicalData: HistoricalData[];
}

export interface CurrentShift {
  supermarketName: string;
  address: string;
  startTime: string;
  endTime: string;
  numbersCollected: number;
  timeRemaining: string;
}

export interface HistoricalData {
  day: string;
  earnings: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface ShiftRequest {
  shiftId: string;
  date: string;
  timeSlot: string;
}

// Nuevos tipos para el backend
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PromoterMetrics {
  totalShifts: number;
  completedShifts: number;
  totalEarnings: number;
  averageEarningsPerShift: number;
  completionRate: number;
  currentStreak: number;
  bestMonth: {
    month: string;
    earnings: number;
  };
}

export interface PromoterStats {
  today: {
    shiftsCompleted: number;
    earnings: number;
    contactsCaptured: number;
  };
  thisWeek: {
    shiftsCompleted: number;
    earnings: number;
    contactsCaptured: number;
  };
  thisMonth: {
    shiftsCompleted: number;
    earnings: number;
    contactsCaptured: number;
  };
  allTime: PromoterMetrics;
}

export interface UploadResponse {
  url: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Estados de carga
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

