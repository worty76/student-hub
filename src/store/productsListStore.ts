import { create } from 'zustand';
import { Product, ProductsQueryParams, Pagination } from '@/types/product';
import { ProductService } from '@/services/product.service';

interface ProductsListState {
  // Data state
  allProducts: Product[]; // All products from API
  filteredProducts: Product[]; // Products after filtering and searching
  displayedProducts: Product[]; // Products for current page
  pagination: Pagination | null;
  currentParams: ProductsQueryParams;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Cache management
  lastFetchTime: number | null;
  cacheTimeout: number; // 5 minutes
}

interface ProductsListActions {
  // Fetch products
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchProductsWithParams: (params?: Partial<ProductsQueryParams>) => Promise<void>;
  
  // Pagination actions
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  
  // Filter and search
  updateFilters: (params: Partial<ProductsQueryParams>) => void;
  clearFilters: () => void;
  
  // State management
  clearError: () => void;
  resetState: () => void;
  
  // Utility
  refreshProducts: () => Promise<void>;
}

type ProductsListStore = ProductsListState & ProductsListActions;

const initialState: ProductsListState = {
  allProducts: [],
  filteredProducts: [],
  displayedProducts: [],
  pagination: null,
  currentParams: {
    page: 1,
    limit: 12,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
    status: 'available', // Default to only show available products (hide sold products)
  },
  isLoading: false,
  error: null,
  lastFetchTime: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
};

export const useProductsListStore = create<ProductsListStore>((set, get) => ({
  ...initialState,

  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      // Use paginated API instead
      const result = await ProductService.getProductsWithPagination(get().currentParams);
      
      set({
        allProducts: result.products,
        displayedProducts: result.products,
        pagination: result.pagination,
        isLoading: false,
        lastFetchTime: Date.now(),
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm';
      set({
        isLoading: false,
        error: errorMessage,
        allProducts: [],
        filteredProducts: [],
        displayedProducts: [],
        pagination: null,
      });
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ isLoading: true, error: null });

    try {
      // Use paginated API with category filter
      const params = { 
        ...get().currentParams, 
        category, 
        page: 1 
      };
      
      const result = await ProductService.getProductsWithPagination(params);
      
      set({
        allProducts: result.products,
        displayedProducts: result.products,
        pagination: result.pagination,
        isLoading: false,
        lastFetchTime: Date.now(),
        error: null,
        currentParams: params,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm theo danh mục';
      set({
        isLoading: false,
        error: errorMessage,
        allProducts: [],
        filteredProducts: [],
        displayedProducts: [],
        pagination: null,
      });
    }
  },

  fetchProductsWithParams: async (params?: Partial<ProductsQueryParams>) => {
    set({ isLoading: true, error: null });

    try {
      const newParams = { ...get().currentParams, ...params };
      
      // Reset to page 1 when filters change, but keep the current page if only changing pages
      if (params && !params.page) {
        newParams.page = 1;
      }

      
      const result = await ProductService.getProductsWithPagination(newParams);
      
      set({
        allProducts: result.products,
        displayedProducts: result.products,
        pagination: result.pagination,
        isLoading: false,
        lastFetchTime: Date.now(),
        error: null,
        currentParams: newParams,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm';
      console.error('Error fetching products:', error);
      set({
        isLoading: false,
        error: errorMessage,
        allProducts: [],
        filteredProducts: [],
        displayedProducts: [],
        pagination: null,
      });
    }
  },

  nextPage: () => {
    const { currentParams, pagination } = get();
    if (pagination && currentParams.page && currentParams.page < pagination.pages) {
      const newPage = currentParams.page + 1;
      get().goToPage(newPage);
    }
  },

  previousPage: () => {
    const { currentParams } = get();
    if (currentParams.page && currentParams.page > 1) {
      const newPage = currentParams.page - 1;
      get().goToPage(newPage);
    }
  },

  goToPage: async (page: number) => {
    set({ isLoading: true });
    
    try {
      const newParams = { ...get().currentParams, page };
      const result = await ProductService.getProductsWithPagination(newParams);
      
      set({
        allProducts: result.products,
        displayedProducts: result.products,
        pagination: result.pagination,
        isLoading: false,
        currentParams: newParams,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải trang sản phẩm';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  updateFilters: (params: Partial<ProductsQueryParams>) => {
    const currentParams = get().currentParams;
    const newParams = { ...currentParams, ...params };
    
    // Always reset to page 1 when filters change
    newParams.page = 1;
    
    // Clean up filters to avoid sending empty values
    Object.keys(newParams).forEach(key => {
      const typedKey = key as keyof ProductsQueryParams;
      if (newParams[typedKey] === '' || newParams[typedKey] === null) {
        delete newParams[typedKey];
      }
    });
    
    get().fetchProductsWithParams(newParams);
  },

  clearFilters: () => {
    const defaultParams = {
      page: 1,
      limit: 12,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
      status: 'available',
    };
    get().fetchProductsWithParams(defaultParams);
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },

  refreshProducts: async () => {
    const { currentParams } = get();
    await get().fetchProductsWithParams(currentParams);
  }
})); 