import { User } from '@/types/auth';
import { ProductsResponse, ProductsQueryParams, ProductReportsResponse, ProductReportsQueryParams } from '@/types/product';
import { MonthlyStatistic } from '@/store/monthlyStatsStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface DashboardStatsResponse {
  counts: {
    users: number;
    products: number;
    availableProducts: number;
    soldProducts: number;
  };
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
}

export class AdminService {
  static async getAllUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Bạn không có quyền truy cập', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Quyền truy cập bị từ chối', 403);
        }
        
        throw new AdminApiError(
          errorData.message || `Lỗi tải người dùng: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      console.log('Admin API response:', data);
      
      // Handle different possible response structures
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        // If response is an object, try to find the users array
        if (Array.isArray(data.users)) {
          return data.users;
        } else if (Array.isArray(data.data)) {
          return data.data;
        } else {
          console.error('Unexpected response structure from API:', data);
          throw new AdminApiError('Invalid response format: expected array of users', 500);
        }
      } else {
        console.error('Unexpected response type from API:', typeof data, data);
        throw new AdminApiError('Invalid response format: expected array of users', 500);
      }
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to fetch users', 500);
    }
  }

  static async deleteUser(token: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Phiên đăng nhập đã hết hạn', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Không có quyền admin để xóa người dùng', 403);
        }
        
        if (response.status === 404) {
          throw new AdminApiError('Không tìm thấy người dùng', 404);
        }
        
        throw new AdminApiError(
          errorData.message || `Lỗi xóa người dùng: ${response.statusText}`,
          response.status
        );
      }

      // For 200 status, we don't need to return anything
      console.log('User deleted successfully');
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to delete user', 500);
    }
  }

  static async getDashboardStats(token: string): Promise<DashboardStatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Bạn không có quyền truy cập', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Quyền truy cập bị từ chối - Cần quyền admin', 403);
        }
        
        throw new AdminApiError(
          errorData.message || `Lỗi tải dữ liệu dashboard: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      console.log('Dashboard API response:', data);
      
      return data;
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Không thể tải dữ liệu dashboard', 500);
    }
  }

  static async getAllProducts(token: string, params?: ProductsQueryParams): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/products/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized - Please login again', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        throw new AdminApiError(
          errorData.message || `Error fetching products: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to fetch products', 500);
    }
  }

  static async deleteProduct(token: string, productId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized - Please login again', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        if (response.status === 404) {
          throw new AdminApiError('Product not found', 404);
        }
        
        throw new AdminApiError(
          errorData.message || `Error deleting product: ${response.statusText}`,
          response.status
        );
      }

      // For 200 status, we don't need to return anything
      console.log('Product deleted successfully by admin');
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to delete product', 500);
    }
  }

  static async getAllProductReports(token: string, params?: ProductReportsQueryParams): Promise<ProductReportsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.reason) queryParams.append('reason', params.reason);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/products/admin/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        throw new AdminApiError(
          errorData.message || `Error fetching product reports: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      console.log('Admin Product Reports API response:', data);
      
      return data;
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to fetch product reports', 500);
    }
  }

  static async getPendingProducts(token: string, params?: ProductsQueryParams): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/products/admin/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        throw new AdminApiError(
          errorData.message || `Error fetching pending products: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to fetch pending products', 500);
    }
  }

  static async approveProduct(token: string, productId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/${productId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        if (response.status === 404) {
          throw new AdminApiError('Product not found', 404);
        }
        
        if (response.status === 400) {
          throw new AdminApiError('Product is not pending approval', 400);
        }
        
        throw new AdminApiError(
          errorData.message || `Error approving product: ${response.statusText}`,
          response.status
        );
      }

      console.log('Product approved successfully');
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to approve product', 500);
    }
  }

  static async rejectProduct(token: string, productId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/${productId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Unauthorized', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Forbidden – Admin access required', 403);
        }
        
        if (response.status === 404) {
          throw new AdminApiError('Product not found', 404);
        }
        
        if (response.status === 400) {
          throw new AdminApiError('Product is not pending approval', 400);
        }
        
        throw new AdminApiError(
          errorData.message || `Error rejecting product: ${response.statusText}`,
          response.status
        );
      }

      console.log('Product rejected successfully');
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Failed to reject product', 500);
    }
  }

  static async getMonthlyProfitStatistics(token: string, year?: number): Promise<MonthlyStatistic[]> {
    try {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append('year', year.toString());

      const url = `${API_BASE_URL}/admin/profits/monthly${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new AdminApiError('Không được xác thực', 401);
        }
        
        if (response.status === 403) {
          throw new AdminApiError('Không có quyền admin', 403);
        }

        if (response.status === 500) {
          throw new AdminApiError('Lỗi server', 500);
        }
        
        throw new AdminApiError(
          errorData.message || `Lỗi tải dữ liệu thống kê lợi nhuận: ${response.statusText}`,
          response.status
        );
      }

      const data: MonthlyStatistic[] = await response.json();
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new AdminApiError('Định dạng phản hồi không hợp lệ: mong muốn mảc tháng thống kê lợi nhuận', 500);
      }

      // Ensure we have all 12 months with default values
      const completeMonthlyStats: MonthlyStatistic[] = [];
      for (let month = 1; month <= 12; month++) {
        const existingData = data.find(item => item.month === month);
        completeMonthlyStats.push(existingData || {
          month,
          profit: 0,
          transactions: 0,
          revenue: 0,
        });
      }

      return completeMonthlyStats;
    } catch (error) {
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        throw new AdminApiError(error.message, 500);
      }
      
      throw new AdminApiError('Lỗi tải dữ liệu thống kê lợi nhuận', 500);
    }
  }
}

export class AdminApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
} 