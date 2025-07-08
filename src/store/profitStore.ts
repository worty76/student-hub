import { create } from 'zustand';

interface MonthlyProfit {
  month: string;
  profit: number;
  transactions: number;
  revenue: number;
}

interface PaymentMethodProfit {
  profit: number;
  transactions: number;
  revenue: number;
}

interface ProfitsByPaymentMethod {
  vnpay: PaymentMethodProfit;
  cash: PaymentMethodProfit;
  [key: string]: PaymentMethodProfit;
}

interface ProfitStatistics {
  totalProfit: number;
  totalTransactions: number;
  totalRevenue: number;
  averageCommissionRate: number;
  monthlyProfits: MonthlyProfit[];
  profitsByPaymentMethod: ProfitsByPaymentMethod;
}

interface ProfitStore {
  // State
  statistics: ProfitStatistics | null;
  loading: boolean;
  error: string | null;
  
  // Date filters
  startDate: string | null;
  endDate: string | null;
  
  // Actions
  setDateFilter: (startDate: string | null, endDate: string | null) => void;
  fetchProfitStatistics: (token: string, startDate?: string, endDate?: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  statistics: null,
  loading: false,
  error: null,
  startDate: null,
  endDate: null,
};

export const useProfitStore = create<ProfitStore>((set) => ({
  ...initialState,

  setDateFilter: (startDate, endDate) => {
    set({ startDate, endDate });
  },

  fetchProfitStatistics: async (token: string, startDate?: string, endDate?: string) => {
    set({ loading: true, error: null });

    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/profits`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Not authenticated');
      }

      if (response.status === 403) {
        throw new Error('Not authorized as admin');
      }

      if (response.status === 500) {
        throw new Error('Server error');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProfitStatistics = await response.json();
      
      set({ 
        statistics: data, 
        loading: false, 
        error: null,
        startDate: startDate || null,
        endDate: endDate || null,
      });

    } catch (error) {
      console.error('Error fetching profit statistics:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch profit statistics',
        statistics: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
})); 