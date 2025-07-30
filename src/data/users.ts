// Base de datos simulada de usuarios
export interface UserData {
  id: string;
  email: string;
  password: string;
  name: string;
  profileImage?: string;
  totalShifts: number;
  completedShifts: number;
  upcomingShifts: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
  hoursWorked: number;
  joinDate: string;
  phone: string;
  address: string;
  isFirstLogin?: boolean;
}

export interface ShiftData {
  id: string;
  userId: string;
  supermarketName: string;
  address: string;
  distance: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'requested' | 'confirmed' | 'completed' | 'cancelled';
  earnings: number;
  rating?: number;
}

export interface PerformanceData {
  userId: string;
  weeklyData: Array<{
    day: string;
    horas: number;
    ganancias: number;
  }>;
  monthlyData: Array<{
    mes: string;
    turnos: number;
    ganancias: number;
  }>;
}

// Usuarios simulados
export const mockUsers: UserData[] = [
  {
    id: '1',
    email: 'maria@example.com',
    password: 'password123',
    name: 'María González',
    totalShifts: 15,
    completedShifts: 12,
    upcomingShifts: 2,
    totalEarnings: 1875,
    averageRating: 4.8,
    completionRate: 95,
    hoursWorked: 48,
    joinDate: '2024-01-15',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    isFirstLogin: false, // Ya no es primer login
    profileImage: '/profile_picture.png', // Ya tiene foto por defecto
  },
  {
    id: '2',
    email: 'ana@example.com',
    password: 'password456',
    name: 'Ana Rodríguez',
    totalShifts: 8,
    completedShifts: 6,
    upcomingShifts: 1,
    totalEarnings: 750,
    averageRating: 4.5,
    completionRate: 88,
    hoursWorked: 24,
    joinDate: '2024-03-20',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    isFirstLogin: true, // Primer login, necesita subir foto
  },
  {
    id: '3',
    email: 'sofia@example.com',
    password: 'password789',
    name: 'Sofía Martínez',
    totalShifts: 22,
    completedShifts: 20,
    upcomingShifts: 3,
    totalEarnings: 2750,
    averageRating: 4.9,
    completionRate: 98,
    hoursWorked: 88,
    joinDate: '2023-11-10',
    phone: '+1 (555) 456-7890',
    address: '789 Pine St, Queens, NY 11375',
    isFirstLogin: false, // Ya no es primer login
    profileImage: '/profile_picture.png',
  },
  {
    id: '4',
    email: 'carlos@example.com',
    password: 'password101',
    name: 'Carlos Hernández',
    totalShifts: 5,
    completedShifts: 4,
    upcomingShifts: 1,
    totalEarnings: 625,
    averageRating: 4.2,
    completionRate: 80,
    hoursWorked: 20,
    joinDate: '2024-06-01',
    phone: '+1 (555) 111-2222',
    address: '321 Elm St, Manhattan, NY 10002',
    isFirstLogin: true, // Primer login, necesita subir foto
  },
  {
    id: '5',
    email: 'lucia@example.com',
    password: 'password202',
    name: 'Lucía Fernández',
    totalShifts: 12,
    completedShifts: 10,
    upcomingShifts: 2,
    totalEarnings: 1500,
    averageRating: 4.7,
    completionRate: 92,
    hoursWorked: 40,
    joinDate: '2024-02-14',
    phone: '+1 (555) 333-4444',
    address: '654 Cedar Ave, Bronx, NY 10451',
    isFirstLogin: true, // Primer login, necesita subir foto
  },
  {
    id: '6',
    email: 'diego@example.com',
    password: 'password303',
    name: 'Diego Morales',
    totalShifts: 18,
    completedShifts: 16,
    upcomingShifts: 2,
    totalEarnings: 2250,
    averageRating: 4.6,
    completionRate: 89,
    hoursWorked: 72,
    joinDate: '2023-12-05',
    phone: '+1 (555) 555-6666',
    address: '987 Birch Rd, Staten Island, NY 10301',
    isFirstLogin: false, // Ya no es primer login
    profileImage: '/profile_picture.png',
  },
];

// Turnos simulados por usuario
export const mockShifts: ShiftData[] = [
  // Turnos para María (userId: '1')
  {
    id: '1',
    userId: '1',
    supermarketName: 'CTown Supermarket',
    address: 'CTown Supermarket 272 Maple St, Perth Amboy, NJ 08861, USA',
    distance: 4,
    date: '2025-07-25',
    startTime: '08:00',
    endTime: '12:00',
    status: 'completed',
    earnings: 125,
    rating: 5,
  },
  {
    id: '2',
    userId: '1',
    supermarketName: 'Stop & Shop',
    address: 'Stop & Shop 150 Smith St, Perth Amboy, NJ 08861, USA',
    distance: 3,
    date: '2025-07-28',
    startTime: '09:00',
    endTime: '13:00',
    status: 'confirmed',
    earnings: 125,
  },
  {
    id: '3',
    userId: '1',
    supermarketName: 'ShopRite',
    address: 'ShopRite 365 Convery Blvd, Perth Amboy, NJ 08861, USA',
    distance: 5,
    date: '2025-07-30',
    startTime: '10:00',
    endTime: '14:00',
    status: 'available',
    earnings: 125,
  },
  
  // Turnos para Ana (userId: '2')
  {
    id: '4',
    userId: '2',
    supermarketName: 'Whole Foods Market',
    address: 'Whole Foods Market 95 E Houston St, New York, NY 10012, USA',
    distance: 2,
    date: '2025-07-26',
    startTime: '11:00',
    endTime: '15:00',
    status: 'completed',
    earnings: 140,
    rating: 4,
  },
  {
    id: '5',
    userId: '2',
    supermarketName: 'Trader Joe\'s',
    address: 'Trader Joe\'s 142 E 14th St, New York, NY 10003, USA',
    distance: 1,
    date: '2025-07-29',
    startTime: '14:00',
    endTime: '18:00',
    status: 'confirmed',
    earnings: 140,
  },
  
  // Turnos para Sofía (userId: '3')
  {
    id: '6',
    userId: '3',
    supermarketName: 'Key Food Supermarket',
    address: 'Key Food Supermarket 43-01 Queens Blvd, Sunnyside, NY 11104, USA',
    distance: 3,
    date: '2025-07-24',
    startTime: '07:00',
    endTime: '11:00',
    status: 'completed',
    earnings: 130,
    rating: 5,
  },
  {
    id: '7',
    userId: '3',
    supermarketName: 'Associated Supermarket',
    address: 'Associated Supermarket 40-11 Queens Blvd, Elmhurst, NY 11373, USA',
    distance: 4,
    date: '2025-07-27',
    startTime: '12:00',
    endTime: '16:00',
    status: 'confirmed',
    earnings: 130,
  },
  {
    id: '8',
    userId: '3',
    supermarketName: 'Fine Fare Supermarket',
    address: 'Fine Fare Supermarket 37-11 Junction Blvd, Corona, NY 11368, USA',
    distance: 6,
    date: '2025-08-01',
    startTime: '08:00',
    endTime: '12:00',
    status: 'available',
    earnings: 130,
  },
];

// Datos de rendimiento por usuario
export const mockPerformanceData: PerformanceData[] = [
  // Rendimiento para María (userId: '1')
  {
    userId: '1',
    weeklyData: [
      { day: 'Lun', horas: 4, ganancias: 125 },
      { day: 'Mar', horas: 0, ganancias: 0 },
      { day: 'Mié', horas: 4, ganancias: 125 },
      { day: 'Jue', horas: 0, ganancias: 0 },
      { day: 'Vie', horas: 4, ganancias: 125 },
      { day: 'Sáb', horas: 0, ganancias: 0 },
      { day: 'Dom', horas: 0, ganancias: 0 },
    ],
    monthlyData: [
      { mes: 'Ene', turnos: 3, ganancias: 375 },
      { mes: 'Feb', turnos: 2, ganancias: 250 },
      { mes: 'Mar', turnos: 4, ganancias: 500 },
      { mes: 'Abr', turnos: 3, ganancias: 375 },
      { mes: 'May', turnos: 2, ganancias: 250 },
      { mes: 'Jun', turnos: 1, ganancias: 125 },
    ],
  },
  
  // Rendimiento para Ana (userId: '2')
  {
    userId: '2',
    weeklyData: [
      { day: 'Lun', horas: 0, ganancias: 0 },
      { day: 'Mar', horas: 4, ganancias: 140 },
      { day: 'Mié', horas: 0, ganancias: 0 },
      { day: 'Jue', horas: 4, ganancias: 140 },
      { day: 'Vie', horas: 0, ganancias: 0 },
      { day: 'Sáb', horas: 4, ganancias: 140 },
      { day: 'Dom', horas: 0, ganancias: 0 },
    ],
    monthlyData: [
      { mes: 'Ene', turnos: 1, ganancias: 140 },
      { mes: 'Feb', turnos: 1, ganancias: 140 },
      { mes: 'Mar', turnos: 2, ganancias: 280 },
      { mes: 'Abr', turnos: 1, ganancias: 140 },
      { mes: 'May', turnos: 2, ganancias: 280 },
      { mes: 'Jun', turnos: 1, ganancias: 140 },
    ],
  },
  
  // Rendimiento para Sofía (userId: '3')
  {
    userId: '3',
    weeklyData: [
      { day: 'Lun', horas: 4, ganancias: 130 },
      { day: 'Mar', horas: 4, ganancias: 130 },
      { day: 'Mié', horas: 4, ganancias: 130 },
      { day: 'Jue', horas: 0, ganancias: 0 },
      { day: 'Vie', horas: 4, ganancias: 130 },
      { day: 'Sáb', horas: 4, ganancias: 130 },
      { day: 'Dom', horas: 0, ganancias: 0 },
    ],
    monthlyData: [
      { mes: 'Ene', turnos: 4, ganancias: 520 },
      { mes: 'Feb', turnos: 3, ganancias: 390 },
      { mes: 'Mar', turnos: 5, ganancias: 650 },
      { mes: 'Abr', turnos: 4, ganancias: 520 },
      { mes: 'May', turnos: 3, ganancias: 390 },
      { mes: 'Jun', turnos: 3, ganancias: 390 },
    ],
  },
];

// Función para obtener usuario por email y password
export const authenticateUser = (email: string, password: string): UserData | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};

// Función para obtener turnos por usuario
export const getShiftsByUserId = (userId: string): ShiftData[] => {
  return mockShifts.filter(shift => shift.userId === userId);
};

// Función para obtener datos de rendimiento por usuario
export const getPerformanceByUserId = (userId: string): PerformanceData | null => {
  return mockPerformanceData.find(perf => perf.userId === userId) || null;
};

// Función para obtener usuario por ID
export const getUserById = (userId: string): UserData | null => {
  return mockUsers.find(user => user.id === userId) || null;
};

// Función para actualizar datos del usuario
export const updateUser = (userId: string, updates: Partial<UserData>): UserData | null => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  }
  return null;
};

