import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  metricsService, 
  shiftService, 
  authService,
  uploadService 
} from '../services/api';
import {
  PromoterStats,
  PromoterMetrics,
  Shift,
  ActiveShift,
  PaginatedResponse,
  UploadResponse
} from '../types';

// Query Keys
export const QUERY_KEYS = {
  PROMOTER_STATS: (promoterId: string) => ['promoter', promoterId, 'stats'],
  PROMOTER_METRICS: (promoterId: string) => ['promoter', promoterId, 'metrics'],
  DASHBOARD_DATA: (promoterId: string) => ['promoter', promoterId, 'dashboard'],
  PROMOTER_SHIFTS: (promoterId: string, page?: number) => ['promoter', promoterId, 'shifts', page],
  ACTIVE_SHIFT: (promoterId: string) => ['promoter', promoterId, 'active-shift'],
  AVAILABLE_SHIFTS: (page?: number) => ['shifts', 'available', page],
  HISTORICAL_DATA: (promoterId: string, period: string) => ['promoter', promoterId, 'historical', period],
} as const;

// Hook para obtener estadísticas del promotor
export const usePromoterStats = (promoterId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROMOTER_STATS(promoterId),
    queryFn: () => metricsService.getPromoterStats(promoterId),
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener métricas del promotor
export const usePromoterMetrics = (promoterId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROMOTER_METRICS(promoterId),
    queryFn: () => metricsService.getPromoterMetrics(promoterId),
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener datos del dashboard
export const useDashboardData = (promoterId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_DATA(promoterId),
    queryFn: () => metricsService.getDashboardData(promoterId),
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 1, // 1 minuto para dashboard (más fresco)
  });
};

// Hook para obtener turnos del promotor
export const usePromoterShifts = (promoterId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROMOTER_SHIFTS(promoterId, page),
    queryFn: () => shiftService.getPromoterShifts(promoterId, page, limit),
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

// Hook para obtener turno activo
export const useActiveShift = (promoterId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVE_SHIFT(promoterId),
    queryFn: () => shiftService.getActiveShift(promoterId),
    enabled: !!promoterId,
    staleTime: 1000 * 30, // 30 segundos (muy fresco para turno activo)
    refetchInterval: 1000 * 60, // Refetch cada minuto
  });
};

// Hook para obtener turnos disponibles
export const useAvailableShifts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.AVAILABLE_SHIFTS(page),
    queryFn: () => shiftService.getAvailableShifts(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// Hook para obtener datos históricos
export const useHistoricalData = (promoterId: string, period: 'week' | 'month' | 'year' = 'week') => {
  return useQuery({
    queryKey: QUERY_KEYS.HISTORICAL_DATA(promoterId, period),
    queryFn: () => metricsService.getHistoricalData(promoterId, period),
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 10, // 10 minutos para datos históricos
  });
};

// Mutaciones
export const useRequestShift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ shiftId, promoterId }: { shiftId: string; promoterId: string }) =>
      shiftService.requestShift(shiftId, promoterId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PROMOTER_SHIFTS(variables.promoterId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.AVAILABLE_SHIFTS() 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DASHBOARD_DATA(variables.promoterId) 
      });
    },
  });
};

export const useCreateShiftRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ shiftId, promoterId }: { shiftId: string; promoterId: string }) =>
      shiftService.createShiftRequest(shiftId, promoterId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PROMOTER_SHIFTS(variables.promoterId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.AVAILABLE_SHIFTS() 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DASHBOARD_DATA(variables.promoterId) 
      });
    },
  });
};

export const useStartShift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ shiftId, promoterId }: { shiftId: string; promoterId: string }) =>
      shiftService.startShift(shiftId, promoterId),
    onSuccess: (data, variables) => {
      // Actualizar turno activo
      queryClient.setQueryData(
        QUERY_KEYS.ACTIVE_SHIFT(variables.promoterId),
        data
      );
      // Invalidar otros queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PROMOTER_SHIFTS(variables.promoterId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.DASHBOARD_DATA(variables.promoterId) 
      });
    },
  });
};

export const useEndShift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      shiftId, 
      promoterId, 
      contactsCaptured 
    }: { 
      shiftId: string; 
      promoterId: string; 
      contactsCaptured: number; 
    }) =>
      shiftService.endShift(shiftId, promoterId, contactsCaptured),
    onSuccess: (data, variables) => {
      // Limpiar turno activo
      queryClient.setQueryData(
        QUERY_KEYS.ACTIVE_SHIFT(variables.promoterId),
        null
      );
      // Invalidar todos los datos del promotor
      queryClient.invalidateQueries({ 
        queryKey: ['promoter', variables.promoterId] 
      });
    },
  });
};

export const useUpdateShiftProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      shiftId, 
      contactsCaptured 
    }: { 
      shiftId: string; 
      contactsCaptured: number; 
    }) =>
      shiftService.updateShiftProgress(shiftId, contactsCaptured),
    onSuccess: (data) => {
      // Actualizar el turno activo en cache
      const promoterId = data.promotorId;
      queryClient.setQueryData(
        QUERY_KEYS.ACTIVE_SHIFT(promoterId),
        data
      );
    },
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadPhoto(file),
    onSuccess: () => {
      // Invalidar datos del usuario para refrescar la foto
      queryClient.invalidateQueries({ 
        queryKey: ['auth', 'user'] 
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      authService.updateProfile(userId, updates),
    onSuccess: (data) => {
      // Actualizar el usuario en cache
      queryClient.setQueryData(['auth', 'user'], data);
    },
  });
};