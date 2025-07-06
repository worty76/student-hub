import { create } from 'zustand';
import { User } from '@/types/auth';
import { Product, ProductsQueryParams, Pagination, ProductReport, ProductReportsQueryParams } from '@/types/product';
import { AdminService, AdminApiError } from '@/services/admin.service';

interface DashboardStats {
  counts?: {
    users: number;
    products: number;
    availableProducts: number;
    soldProducts: number;
  };
  categoryStats?: Array<{
    _id: string;
    count: number;
  }>;
}

interface ProductsStats {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
  pendingProducts: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}

interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
  deletingUserId: string | null;
  dashboardStats: DashboardStats;
  dashboardLoading: boolean;
  dashboardError: string | null;
  
  // Products state
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  productsPagination: Pagination | null;
  productsStats: ProductsStats | null;
  productsStatsLoading: boolean;
  currentProductsPage: number;
  productsFilters: ProductsQueryParams;
  deletingProductId: string | null;
  
  // Product Reports state
  productReports: ProductReport[];
  reportsLoading: boolean;
  reportsError: string | null;
  reportsPagination: Pagination | null;
  currentReportsPage: number;
  reportsFilters: ProductReportsQueryParams;
}

interface AdminStore extends AdminState {
  fetchAllUsers: (token: string) => Promise<void>;
  deleteUser: (token: string, userId: string) => Promise<void>;
  clearError: () => void;
  setUserStatus: (userId: string, status: string) => void;
  fetchDashboardStats: (token: string) => Promise<void>;
  clearDashboardError: () => void;
  
  // Products actions
  fetchAllProducts: (token: string, params?: ProductsQueryParams) => Promise<void>;
  deleteProduct: (token: string, productId: string) => Promise<void>;
  setProductsPage: (page: number) => void;
  setProductsFilters: (filters: Partial<ProductsQueryParams>) => void;
  clearProductsError: () => void;
  generateProductsStats: () => void;
  
  // Product approval actions
  fetchPendingProducts: (token: string, params?: ProductsQueryParams) => Promise<void>;
  approveProduct: (token: string, productId: string) => Promise<void>;
  rejectProduct: (token: string, productId: string, reason?: string) => Promise<void>;
  
  // Product Reports actions
  fetchAllProductReports: (token: string, params?: ProductReportsQueryParams) => Promise<void>;
  setReportsPage: (page: number) => void;
  setReportsFilters: (filters: Partial<ProductReportsQueryParams>) => void;
  clearReportsError: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  deletingUserId: null,
  dashboardStats: {},
  dashboardLoading: false,
  dashboardError: null,
  
  // Products initial state
  products: [],
  productsLoading: false,
  productsError: null,
  productsPagination: null,
  productsStats: null,
  productsStatsLoading: false,
  currentProductsPage: 1,
  productsFilters: {},
  deletingProductId: null,
  
  // Product Reports initial state
  productReports: [],
  reportsLoading: false,
  reportsError: null,
  reportsPagination: null,
  currentReportsPage: 1,
  reportsFilters: {},

  fetchAllUsers: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const users = await AdminService.getAllUsers(token);
      set({ 
        users, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            error: 'Bạn không có quyền truy cập', 
            loading: false,
            users: []
          });
        } else if (error.status === 403) {
          set({ 
            error: 'Quyền truy cập bị từ chối', 
            loading: false,
            users: []
          });
        } else {
          set({ 
            error: error.message, 
            loading: false,
            users: []
          });
        }
      } else {
        set({ 
          error: 'Lỗi tải người dùng', 
          loading: false,
          users: []
        });
      }
    }
  },

  deleteUser: async (token: string, userId: string) => {
    set({ deletingUserId: userId, error: null });
    try {
      await AdminService.deleteUser(token, userId);
      
      // Remove user from the list after successful deletion
      const { users } = get();
      const updatedUsers = users.filter(user => user._id !== userId);
      
      set({ 
        users: updatedUsers, 
        deletingUserId: null, 
        error: null 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        set({ 
          error: error.message, 
          deletingUserId: null 
        });
      } else {
        set({ 
          error: 'Lỗi xóa người dùng', 
          deletingUserId: null 
        });
      }
      throw error; // Re-throw to allow component to handle it
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUserStatus: (userId: string, status: string) => {
    const { users } = get();
    const updatedUsers = users.map(user => 
      user._id === userId 
        ? { ...user, status } 
        : user
    );
    set({ users: updatedUsers });
  },

  fetchDashboardStats: async (token: string) => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const data = await AdminService.getDashboardStats(token);
      set({ 
        dashboardStats: data, 
        dashboardLoading: false, 
        dashboardError: null 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            dashboardError: 'Bạn không có quyền truy cập', 
            dashboardLoading: false,
            dashboardStats: {}
          });
        } else if (error.status === 403) {
          set({ 
            dashboardError: 'Quyền truy cập bị từ chối - Cần quyền admin', 
            dashboardLoading: false,
            dashboardStats: {}
          });
        } else {
          set({ 
            dashboardError: error.message, 
            dashboardLoading: false,
            dashboardStats: {}
          });
        }
      } else {
        set({ 
          dashboardError: 'Không thể tải dữ liệu dashboard', 
          dashboardLoading: false,
          dashboardStats: {}
        });
      }
    }
  },

  clearDashboardError: () => {
    set({ dashboardError: null });
  },

  // Products actions implementation
  fetchAllProducts: async (token: string, params?: ProductsQueryParams) => {
    set({ productsLoading: true, productsError: null });
    try {
      const response = await AdminService.getAllProducts(token, params);
      set({ 
        products: response.products, 
        productsPagination: response.pagination,
        productsLoading: false, 
        productsError: null,
        currentProductsPage: response.pagination.page 
      });
      
      // Generate statistics after fetching products
      get().generateProductsStats();
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            productsError: 'Unauthorized - Please login again', 
            productsLoading: false,
            products: []
          });
        } else if (error.status === 403) {
          set({ 
            productsError: 'Forbidden – Admin access required', 
            productsLoading: false,
            products: []
          });
        } else {
          set({ 
            productsError: error.message, 
            productsLoading: false,
            products: []
          });
        }
      } else {
        set({ 
          productsError: 'Failed to load products', 
          productsLoading: false,
          products: []
        });
      }
    }
  },

  deleteProduct: async (token: string, productId: string) => {
    set({ deletingProductId: productId, productsError: null });
    try {
      await AdminService.deleteProduct(token, productId);
      
      // Remove product from the list after successful deletion
      const { products } = get();
      const updatedProducts = products.filter(product => product._id !== productId);
      
      set({ 
        products: updatedProducts, 
        deletingProductId: null, 
        productsError: null 
      });
      
      // Regenerate statistics after deletion
      get().generateProductsStats();
    } catch (error) {
      if (error instanceof AdminApiError) {
        let errorMessage = '';
        if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn';
        } else if (error.status === 403) {
          errorMessage = 'Forbidden – Admin access required';
        } else if (error.status === 404) {
          errorMessage = 'Product not found';
        } else {
          errorMessage = error.message;
        }
        
        set({ 
          productsError: errorMessage, 
          deletingProductId: null 
        });
      } else {
        set({ 
          productsError: 'Lỗi xóa sản phẩm', 
          deletingProductId: null 
        });
      }
      throw error; // Re-throw to allow component to handle it
    }
  },

  setProductsPage: (page: number) => {
    set({ currentProductsPage: page });
  },

  setProductsFilters: (filters: Partial<ProductsQueryParams>) => {
    const currentFilters = get().productsFilters;
    set({ 
      productsFilters: { ...currentFilters, ...filters },
      currentProductsPage: 1 // Reset to first page when filters change
    });
  },

  clearProductsError: () => {
    set({ productsError: null });
  },

  generateProductsStats: () => {
    const { products } = get();
    set({ productsStatsLoading: true });
    
    try {
      const totalProducts = products.length;
      const availableProducts = products.filter(p => p.status === 'available').length;
      const soldProducts = products.filter(p => p.status === 'sold').length;
      const pendingProducts = products.filter(p => p.status === 'pending').length;
      
      // Category breakdown
      const categoryMap = new Map<string, number>();
      products.forEach(product => {
        const category = product.category || 'Unknown';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }));
      
      // Status breakdown
      const statusMap = new Map<string, number>();
      products.forEach(product => {
        const status = product.status || 'Unknown';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
      
      const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count
      }));
      
      const stats: ProductsStats = {
        totalProducts,
        availableProducts,
        soldProducts,
        pendingProducts,
        categoryBreakdown,
        statusBreakdown
      };
      
      set({ 
        productsStats: stats,
        productsStatsLoading: false 
      });
    } catch (error) {
      console.error('Error generating products stats:', error);
      set({ productsStatsLoading: false });
    }
  },

  // Product approval actions implementation
  fetchPendingProducts: async (token: string, params?: ProductsQueryParams) => {
    set({ productsLoading: true, productsError: null });
    try {
      const response = await AdminService.getPendingProducts(token, params);
      set({ 
        products: response.products, 
        productsPagination: response.pagination,
        productsLoading: false, 
        productsError: null,
        currentProductsPage: response.pagination.page 
      });
      get().generateProductsStats(); // Regenerate stats for pending products
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            productsError: 'Unauthorized - Please login again', 
            productsLoading: false,
            products: []
          });
        } else if (error.status === 403) {
          set({ 
            productsError: 'Forbidden – Admin access required', 
            productsLoading: false,
            products: []
          });
        } else {
          set({ 
            productsError: error.message, 
            productsLoading: false,
            products: []
          });
        }
      } else {
        set({ 
          productsError: 'Failed to load pending products', 
          productsLoading: false,
          products: []
        });
      }
    }
  },

  approveProduct: async (token: string, productId: string) => {
    set({ productsError: null });
    try {
      await AdminService.approveProduct(token, productId);
      // Remove from pending list and add to approved list
      const { products } = get();
      const updatedProducts = products.filter(p => p._id !== productId);
      set({ products: updatedProducts });
      get().generateProductsStats(); // Regenerate stats
    } catch (error) {
      if (error instanceof AdminApiError) {
        let errorMessage = '';
        if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn';
        } else if (error.status === 403) {
          errorMessage = 'Forbidden – Admin access required';
        } else if (error.status === 404) {
          errorMessage = 'Product not found';
        } else {
          errorMessage = error.message;
        }
        set({ productsError: errorMessage });
      } else {
        set({ productsError: 'Lỗi phê duyệt sản phẩm' });
      }
      throw error; // Re-throw to allow component to handle it
    }
  },

  rejectProduct: async (token: string, productId: string, reason?: string) => {
    set({ productsError: null });
    try {
      await AdminService.rejectProduct(token, productId, reason);
      // Remove from pending list
      const { products } = get();
      const updatedProducts = products.filter(p => p._id !== productId);
      set({ products: updatedProducts });
      get().generateProductsStats(); // Regenerate stats
    } catch (error) {
      if (error instanceof AdminApiError) {
        let errorMessage = '';
        if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn';
        } else if (error.status === 403) {
          errorMessage = 'Forbidden – Admin access required';
        } else if (error.status === 404) {
          errorMessage = 'Product not found';
        } else {
          errorMessage = error.message;
        }
        set({ productsError: errorMessage });
      } else {
        set({ productsError: 'Lỗi từ chối sản phẩm' });
      }
      throw error; // Re-throw to allow component to handle it
    }
  },

  // Product Reports actions implementation
  fetchAllProductReports: async (token: string, params?: ProductReportsQueryParams) => {
    set({ reportsLoading: true, reportsError: null });
    try {
      const response = await AdminService.getAllProductReports(token, params);
      set({ 
        productReports: response.reports, 
        reportsPagination: response.pagination,
        reportsLoading: false, 
        reportsError: null,
        currentReportsPage: response.pagination.page 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            reportsError: 'Unauthorized', 
            reportsLoading: false,
            productReports: []
          });
        } else if (error.status === 403) {
          set({ 
            reportsError: 'Forbidden – Admin access required', 
            reportsLoading: false,
            productReports: []
          });
        } else {
          set({ 
            reportsError: error.message, 
            reportsLoading: false,
            productReports: []
          });
        }
      } else {
        set({ 
          reportsError: 'Failed to load product reports', 
          reportsLoading: false,
          productReports: []
        });
      }
    }
  },

  setReportsPage: (page: number) => {
    set({ currentReportsPage: page });
  },

  setReportsFilters: (filters: Partial<ProductReportsQueryParams>) => {
    const currentFilters = get().reportsFilters;
    set({ 
      reportsFilters: { ...currentFilters, ...filters },
      currentReportsPage: 1 // Reset to first page when filters change
    });
  },

  clearReportsError: () => {
    set({ reportsError: null });
  },
})); 