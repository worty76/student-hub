import { create } from 'zustand';
import { User } from '@/types/auth';
import { Product } from '@/types/product';
import { UserService } from '@/services/user.service';
import { ProductService } from '@/services/product.service';

interface PublicUserState {
  users: Record<string, User>; // Cache users by ID
  userProducts: Record<string, Product[]>; // Cache products by user ID
  isLoading: boolean;
  isLoadingProducts: boolean;
  error: string | null;
  productsError: string | null;
  currentUser: User | null; // Currently viewed user
  currentUserProducts: Product[] | null; // Products of currently viewed user
}

interface PublicUserActions {
  fetchUser: (id: string) => Promise<void>;
  fetchUserProducts: (userId: string) => Promise<void>;
  clearCurrentUser: () => void;
  clearError: () => void;
  clearProductsError: () => void;
}

interface PublicUserStore extends PublicUserState, PublicUserActions {}

export const usePublicUserStore = create<PublicUserStore>((set, get) => ({
  // State
  users: {},
  userProducts: {},
  isLoading: false,
  isLoadingProducts: false,
  error: null,
  productsError: null,
  currentUser: null,
  currentUserProducts: null,

  // Actions
  fetchUser: async (id: string) => {
    // Check if user is already cached
    const { users } = get();
    if (users[id]) {
      set({ currentUser: users[id], error: null });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const user = await UserService.getUserById(id);
      set({ 
        users: { ...users, [id]: user },
        currentUser: user,
        isLoading: false, 
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải thông tin người dùng';
      set({ 
        error: errorMessage,
        currentUser: null,
        isLoading: false 
      });
      throw error;
    }
  },

  fetchUserProducts: async (userId: string) => {
    // Check if products are already cached
    const { userProducts } = get();
    if (userProducts[userId]) {
      set({ currentUserProducts: userProducts[userId], productsError: null });
      return;
    }

    set({ isLoadingProducts: true, productsError: null });
    
    try {
      const products = await ProductService.getUserProductsByUserId(userId);
      set({ 
        userProducts: { ...userProducts, [userId]: products },
        currentUserProducts: products,
        isLoadingProducts: false, 
        productsError: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm của người dùng';
      set({ 
        productsError: errorMessage,
        currentUserProducts: null,
        isLoadingProducts: false 
      });
      throw error;
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null, currentUserProducts: null, error: null, productsError: null });
  },

  clearError: () => {
    set({ error: null });
  },

  clearProductsError: () => {
    set({ productsError: null });
  },
})); 