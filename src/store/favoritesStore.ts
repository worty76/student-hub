import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoritesService, FavoriteProduct } from '@/services/favorites.service';

interface FavoritesState {
  favoriteProducts: Set<string>;
  favoriteProductsData: FavoriteProduct[];
  isLoading: boolean;
  error: string | null;
}

interface FavoritesActions {
  addToFavorites: (productId: string, token: string) => Promise<{ success: boolean; message: string }>;
  removeFromFavorites: (productId: string, token: string) => Promise<{ success: boolean; message: string }>;
  toggleFavorite: (productId: string, token: string) => Promise<{ success: boolean; message: string }>;
  loadFavorites: (token: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearError: () => void;
  setFavorites: (productIds: string[]) => void;
}

interface FavoritesStore extends FavoritesState, FavoritesActions {}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteProducts: new Set<string>(),
      favoriteProductsData: [],
      isLoading: false,
      error: null,

      addToFavorites: async (productId: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await FavoritesService.addToFavorites(productId, token);
          
          if (response.success) {
            set((state) => ({
              favoriteProducts: new Set([...state.favoriteProducts, productId]),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.message });
          }
          
          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error adding to favorites';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      removeFromFavorites: async (productId: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await FavoritesService.removeFromFavorites(productId, token);
          
          if (response.success) {
            set((state) => {
              const newFavorites = new Set(state.favoriteProducts);
              newFavorites.delete(productId);
              return {
                favoriteProducts: newFavorites,
                isLoading: false,
              };
            });
          } else {
            set({ isLoading: false, error: response.message });
          }
          
          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error removing from favorites';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      toggleFavorite: async (productId: string, token: string) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        
        if (isFavorite(productId)) {
          return await removeFromFavorites(productId, token);
        } else {
          return await addToFavorites(productId, token);
        }
      },

      loadFavorites: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const favorites = await FavoritesService.getFavorites(token);
          const favoriteIds = favorites.map((product) => product._id);
          
          set({
            favoriteProducts: new Set(favoriteIds),
            favoriteProductsData: favorites,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error loading favorites';
          set({ isLoading: false, error: errorMessage });
        }
      },

      isFavorite: (productId: string) => {
        return get().favoriteProducts.has(productId);
      },

      clearError: () => {
        set({ error: null });
      },

      setFavorites: (productIds: string[]) => {
        set({ favoriteProducts: new Set(productIds) });
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({
        favoriteProducts: Array.from(state.favoriteProducts),
        favoriteProductsData: state.favoriteProductsData,
      }),
      version: 1,
      merge: (persistedState, currentState) => {
        const typed = persistedState as { favoriteProducts?: string[]; favoriteProductsData?: FavoriteProduct[] } | undefined;
        return {
          ...currentState,
          favoriteProducts: new Set(typed?.favoriteProducts || []),
          favoriteProductsData: typed?.favoriteProductsData || [],
        };
      },
    }
  )
); 