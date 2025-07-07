import { create } from 'zustand';
import { paymentService, PurchaseHistoryItem, PurchaseHistoryPagination, PurchaseHistoryParams } from '@/services/payment.service';

interface PurchaseStore {
  // State
  purchases: PurchaseHistoryItem[];
  pagination: PurchaseHistoryPagination | null;
  isLoading: boolean;
  error: string | null;
  filters: PurchaseHistoryParams;

  // Actions
  fetchPurchases: (token: string, params?: PurchaseHistoryParams) => Promise<void>;
  setFilters: (filters: Partial<PurchaseHistoryParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  purchases: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  ...initialState,

  fetchPurchases: async (token: string, params?: PurchaseHistoryParams) => {
    set({ isLoading: true, error: null });
    
    try {
      // Merge current filters with new params
      const currentFilters = get().filters;
      const finalParams = { ...currentFilters, ...params };
      
      const response = await paymentService.getPurchaseHistory(token, finalParams);
      
      if (response.success) {
        set({
          purchases: response.data.purchases,
          pagination: response.data.pagination,
          filters: finalParams,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Không thể tải lịch sử mua hàng');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi tải lịch sử mua hàng';
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      
      throw error;
    }
  },

  setFilters: (newFilters: Partial<PurchaseHistoryParams>) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    // Reset to page 1 when filters change (except when specifically changing page)
    if (!('page' in newFilters)) {
      updatedFilters.page = 1;
    }
    
    set({ filters: updatedFilters });
  },

  clearFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
})); 