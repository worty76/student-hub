import { create } from 'zustand';
import { paymentService, PurchaseHistoryItem, PurchaseHistoryPagination, PurchaseHistoryParams } from '@/services/payment.service';

interface PurchaseStore {
  // State
  purchases: PurchaseHistoryItem[];
  pagination: PurchaseHistoryPagination | null;
  isLoading: boolean;
  error: string | null;
  filters: PurchaseHistoryParams;
  confirmingReceipt: string | null; // orderId being confirmed

  // Actions
  fetchPurchases: (token: string, params?: PurchaseHistoryParams) => Promise<void>;
  confirmReceipt: (token: string, orderId: string) => Promise<void>;
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
  confirmingReceipt: null,
  filters: {
    page: 1,
    limit: 10,
    status: 'completed',
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
        let validPurchases = response.data.purchases;
        
        if (finalParams.status !== 'failed' && finalParams.status !== 'all') {
          validPurchases = response.data.purchases.filter(purchase => 
            purchase.paymentStatus === 'completed' || purchase.paymentStatus === 'pending'
          );
        }
        
        set({
          purchases: validPurchases,
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

  confirmReceipt: async (token: string, orderId: string) => {
    set({ confirmingReceipt: orderId, error: null });
    
    try {
      const response = await paymentService.confirmReceipt(token, orderId);
      
      if (response.success) {
        // Update the specific purchase in the list
        const currentPurchases = get().purchases;
        const updatedPurchases = currentPurchases.map(purchase => {
          if (purchase.orderId === orderId) {
            return {
              ...purchase,
              receivedSuccessfully: response.data.receivedSuccessfully,
              receivedConfirmedAt: response.data.receivedConfirmedAt,
            };
          }
          return purchase;
        });
        
        set({
          purchases: updatedPurchases,
          confirmingReceipt: null,
          error: null,
        });
      } else {
        throw new Error('Không thể xác nhận nhận hàng');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi xác nhận nhận hàng';
      
      set({
        error: errorMessage,
        confirmingReceipt: null,
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
        status: 'completed', // Keep status filter to exclude canceled purchases
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