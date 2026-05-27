export interface User {
  id: string;
  _id: string;
  email: string;
  name: string;
  profileImage?: string;
  totalShifts: number;
  completedShifts: number;
  firstName: string;
  lastName: string;
  upcomingShifts: number;
  role: "promoter" | "admin" | "supervisor";
  totalEarnings: number;
  isFirstLogin?: boolean;
  accessCode?: string;
  phoneNumber?: string;
  address?: string;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Shift {
  _id: string;
  storeId: string;
  startTime: string;
  endTime: string;
  date: string;
  status: "available" | "requested" | "confirmed" | "completed" | "active";
  approvedByAdmin: boolean;
  totalParticipations: number;
  newParticipations: number;
  existingParticipations: number;
  totalEarnings: number;
  hourlyRate: number;
  participationBonus: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  storeInfo: {
    _id: string;
    name: string;
    address: string;
    zipCode: string;
    image: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
    customerCount: number;
    type: string;
    provider: string;
    slug: string;
    active: boolean;
    owner: string;
    createdAt: string;
    updatedAt: string;
    twilioPhoneNumber: string;
    twilioPhoneNumberSid: string;
    twilioPhoneNumberFriendlyName: string;
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
  status: "active" | "paused" | "completed";
  targetContacts: number;
}

export interface EarningsTier {
  label: string;
  ratePerNew: number;
  maxCount: number | null;
  isCurrent: boolean;
}

export interface TierInfo {
  tiers: EarningsTier[];
  currentTierIdx: number;
  currentRate: number;
  currentLabel: string;
  nextRate: number | null;
  nextLabel: string | null;
  progressToNext: number;
  countToNext: number;
  newUsersCount: number;
}

export interface ShiftWithStatsResponse {
  shift: {
    _id: string;
    storeId: string;
    sweepstakeId: string;
    startTime: string;
    endTime: string;
    date: string;
    status: "active" | "paused" | "completed";
    approvedByAdmin: boolean;
    totalParticipations: number;
    newParticipations: number;
    existingParticipations: number;
    totalEarnings: number;
    hourlyRate: number;
    participationBonus: number;
    participationPoint: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    requestedBy: string;
    isFirstShiftAtStore?: boolean;
    isFirstShiftEver?: boolean;

    promoterId: {
      _id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
    };

    storeInfo: {
      _id: string;
      name: string;
      address: string;
      zipCode: string;
      owner: string;
      ownerId: string;
      description: string;
      image: string;
      active: boolean;
      subscription: string | null;
      createdAt: string;
      updatedAt: string;
      type: string;
      slug: string;
      provider: string;
      customerCount: number;
      twilioPhoneNumber: string;
      twilioPhoneNumberFriendlyName: string;
      twilioPhoneNumberSid: string;
      verifiedByTwilio: boolean;
      id: string;
      location: {
        type: "Point";
        coordinates: [number, number];
      };
    };
  };

  stats: {
    totalParticipations: number;
    newUsers: number;
    existingUsers: number;
    totalPoints: number;
    totalEarnings: number;
  };

  tierInfo?: TierInfo;
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
  promoterId: string;
  promoterInfo: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    rating: number;
  };
  period: string; // Ej: 'all'
  detailedMetrics: {
    earnings: {
      totalEarnings: number;
      totalParticipations: number;
      newCustomerEarnings: number;
      existingCustomerEarnings: number;
      newCustomers: number;
      existingCustomers: number;
      earningsBreakdown: {
        newCustomers: string; // Ej: "0 × $1.00 = $0.00"
        existingCustomers: string; // Ej: "0 × $0.10 = $0.00"
        total: string; // Ej: "$0.00"
      };
    };
    earningsByStore: {
      storeId: string;
      storeName: string;
      totalEarnings: number;
      participations: number;
    }[];
    shifts: {
      total: number;
      completed: number;
      active: number;
      available: number;
      totalHours: number;
      averageParticipationsPerShift: string; // Ej: "3.33"
    };
  };
}

export interface PromoterStats {
  totalEarnings: number;
  totalParticipations: number;
  newCustomers: number;
  existingCustomers: number;
  totalShifts: number;
  completedShifts: number;
  activeShifts: number;
  averageEarningsPerShift: number;
  averageParticipationsPerShift: number;
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

export interface ParticipationResult {
  _id: string;
  customerPhone: string;
  isNewUser: boolean;
  earningsValue: number;
  pointsEarned: number;
  registeredAt: string;
  shiftId: string;
  storeId: string;
  method: string;
}

export interface RegisterParticipationPayload {
  phoneNumber: string;
  countryCode?: string;
  shiftId: string;
  promoterId: string;
  storeId: string;
  sweepstakeId?: string;
}

export interface ActiveSweepstake {
  _id: string;
  name: string;
  storeId: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface ShiftAssignedNotification {
  type: "SHIFT_ASSIGNED";
  shiftId: string;
  storeId: string;
  startTime: string;
  endTime: string;
  heldUsd: number;
  message: string;
  timestamp: string;
  storeName?: string;
}
