import { create } from 'zustand';
import { Product, ProductsQueryParams, Pagination } from '@/types/product';
import { productService } from '@/services/product.service';

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
  
  // Internal methods
  applyFiltersAndPagination: () => void;
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
    sortBy: 'createdAt',
    sortOrder: 'desc',
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
      const products = await productService.getAllProducts();
      
      set({
        allProducts: products,
        isLoading: false,
        lastFetchTime: Date.now(),
        error: null,
      });
      
      // Apply filters and pagination after fetching
      get().applyFiltersAndPagination();
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

  applyFiltersAndPagination: () => {
    const { allProducts, currentParams } = get();
    
    if (allProducts.length === 0) {
      set({
        filteredProducts: [],
        displayedProducts: [],
        pagination: null,
      });
      return;
    }

    let filtered = [...allProducts];

    // Apply search filter
    if (currentParams.search) {
      const searchTerm = currentParams.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (currentParams.category) {
      filtered = filtered.filter(product => product.category === currentParams.category);
    }

    // Apply condition filter
    if (currentParams.condition) {
      filtered = filtered.filter(product => product.condition === currentParams.condition);
    }

    // Apply status filter
    if (currentParams.status) {
      filtered = filtered.filter(product => product.status === currentParams.status);
    }

    // Apply price range filter
    if (currentParams.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= currentParams.minPrice!);
    }
    if (currentParams.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= currentParams.maxPrice!);
    }

    // Apply location filter
    if (currentParams.location) {
      const locationTerm = currentParams.location.toLowerCase();
      filtered = filtered.filter(product => 
        product.location?.toLowerCase().includes(locationTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { sortBy = 'createdAt', sortOrder = 'desc' } = currentParams;
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'favorites':
          aValue = a.favorites || 0;
          bValue = b.favorites || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    // Calculate pagination
    const { page = 1, limit = 12 } = currentParams;
    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const displayedProducts = filtered.slice(startIndex, endIndex);

    const pagination: Pagination = {
      total,
      page,
      limit,
      pages,
    };

    set({
      filteredProducts: filtered,
      displayedProducts,
      pagination,
    });
  },

  nextPage: () => {
    const { pagination, currentParams } = get();
    if (pagination && pagination.page < pagination.pages) {
      set({
        currentParams: { ...currentParams, page: pagination.page + 1 }
      });
      get().applyFiltersAndPagination();
    }
  },

  previousPage: () => {
    const { pagination, currentParams } = get();
    if (pagination && pagination.page > 1) {
      set({
        currentParams: { ...currentParams, page: pagination.page - 1 }
      });
      get().applyFiltersAndPagination();
    }
  },

  goToPage: (page: number) => {
    const { pagination, currentParams } = get();
    if (pagination && page >= 1 && page <= pagination.pages && page !== pagination.page) {
      set({
        currentParams: { ...currentParams, page }
      });
      get().applyFiltersAndPagination();
    }
  },

  updateFilters: (params: Partial<ProductsQueryParams>) => {
    const { currentParams } = get();
    const newParams = {
      ...currentParams,
      ...params,
      page: 1, // Reset to first page when filters change
    };
    
    set({ currentParams: newParams });
    get().applyFiltersAndPagination();
  },

  clearFilters: () => {
    const defaultParams = {
      page: 1,
      limit: 12,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };
    
    set({ currentParams: defaultParams });
    get().applyFiltersAndPagination();
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },

  refreshProducts: async () => {
    await get().fetchAllProducts();
  },
})); 