import { create } from 'zustand';
import { AdminService } from '@/services/admin.service';

export interface MonthlyStatistic {
  month: number;
  profit: number;
  transactions: number;
  revenue: number;
}

interface MonthlyStatsState {
  // Data
  monthlyStats: MonthlyStatistic[];
  selectedYear: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedYear: (year: number) => void;
  fetchMonthlyStats: (token: string, year?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MonthlyStatsStore extends MonthlyStatsState {}

export const useMonthlyStatsStore = create<MonthlyStatsStore>((set, get) => ({
  // Initial state
  monthlyStats: [],
  selectedYear: new Date().getFullYear(),
  isLoading: false,
  error: null,

  // Actions
  setSelectedYear: (year: number) => {
    set({ selectedYear: year });
  },

  fetchMonthlyStats: async (token: string, year?: number) => {
    const targetYear = year || get().selectedYear;
    
    set({ 
      isLoading: true, 
      error: null,
      selectedYear: targetYear 
    });

    try {
      const data = await AdminService.getMonthlyProfitStatistics(token, targetYear);

      set({ 
        monthlyStats: data,
        isLoading: false,
        error: null 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi tải dữ liệu thống kê lợi nhuận';
      
      set({ 
        isLoading: false, 
        error: errorMessage,
        monthlyStats: [] // Clear data on error
      });
      
      throw error; // Re-throw for component error handling
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      monthlyStats: [],
      selectedYear: new Date().getFullYear(),
      isLoading: false,
      error: null,
    });
  },
})); 