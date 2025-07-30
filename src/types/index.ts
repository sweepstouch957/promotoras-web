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
  status: 'available' | 'requested' | 'confirmed' | 'completed';
  earnings?: number;
  numbersCollected?: number;
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

