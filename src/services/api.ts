import { User, Shift } from '../types';
import { mockUsers, authenticateUser, getShiftsByUserId, getPerformanceByUserId } from '../data/users';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  async login(email: string, password: string): Promise<User | null> {
    await delay(1000);
    
    const user = authenticateUser(email, password);
    if (user) {
      // Convert to the User type expected by the app
      const appUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        totalShifts: user.totalShifts,
        completedShifts: user.completedShifts,
        upcomingShifts: user.upcomingShifts,
        totalEarnings: user.totalEarnings,
        isFirstLogin: user.isFirstLogin,
      };
      return appUser;
    }
    return null;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      const user = mockUsers[userIndex];
      const appUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        totalShifts: user.totalShifts,
        completedShifts: user.completedShifts,
        upcomingShifts: user.upcomingShifts,
        totalEarnings: user.totalEarnings,
        isFirstLogin: user.isFirstLogin,
      };
      return appUser;
    }
    return null;
  },
};

export const shiftAPI = {
  async getUserShifts(userId: string): Promise<Shift[]> {
    await delay(800);
    const shifts = getShiftsByUserId(userId);
    return shifts.map(shift => ({
      id: shift.id,
      supermarketName: shift.supermarketName,
      address: shift.address,
      distance: shift.distance,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      status: shift.status,
      earnings: shift.earnings,
    }));
  },

  async getAvailableShifts(): Promise<Shift[]> {
    await delay(600);
    // Return some mock available shifts
    return [
      {
        id: '101',
        supermarketName: 'Fresh Market',
        address: 'Fresh Market 111 Main St, New Brunswick, NJ 08901, USA',
        distance: 3,
        date: '2025-08-05',
        startTime: '08:00',
        endTime: '12:00',
        status: 'available',
        earnings: 120,
      },
      {
        id: '102',
        supermarketName: 'IGA Supermarket',
        address: 'IGA Supermarket 222 George St, New Brunswick, NJ 08901, USA',
        distance: 4,
        date: '2025-08-05',
        startTime: '14:00',
        endTime: '18:00',
        status: 'available',
        earnings: 130,
      },
    ];
  },

  async requestShift(userId: string, shiftId: string, date: Date, timeSlot: string): Promise<boolean> {
    await delay(1000);
    // Simulate successful shift request
    console.log(`User ${userId} requested shift ${shiftId} for ${date} at ${timeSlot}`);
    return true;
  },
};

export const performanceAPI = {
  async getUserPerformance(userId: string): Promise<any> {
    await delay(700);
    return getPerformanceByUserId(userId);
  },

  async getUserStats(userId: string): Promise<any> {
    await delay(500);
    
    const userShifts = getShiftsByUserId(userId);
    const completedShifts = userShifts.filter(s => s.status === 'completed');
    const totalEarnings = completedShifts.reduce((sum, s) => sum + (s.earnings || 0), 0);
    
    return {
      totalShifts: userShifts.length,
      completedShifts: completedShifts.length,
      upcomingShifts: userShifts.filter(s => s.status === 'confirmed' || s.status === 'requested').length,
      totalEarnings,
      averageEarningsPerShift: completedShifts.length > 0 ? Math.round(totalEarnings / completedShifts.length) : 0,
      completionRate: userShifts.length > 0 ? Math.round((completedShifts.length / userShifts.length) * 100) : 0,
    };
  },
};

