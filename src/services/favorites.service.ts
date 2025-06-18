const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub-production.up.railway.app/api';

export interface FavoriteProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  status: string;
  seller: string;
  location: string;
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export class FavoritesService {
  static async addToFavorites(productId: string, token: string): Promise<FavoriteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            return {
              success: false,
              message: 'Sản phẩm đã có trong danh sách yêu thích',
            };
          case 401:
            throw new Error('Bạn không có quyền thêm sản phẩm vào danh sách yêu thích');
          case 404:
            return {
              success: false,
              message: 'Sản phẩm không tồn tại',
            };
          default:
            throw new Error(data.message || `Lỗi khi thêm sản phẩm vào danh sách yêu thích: ${response.statusText}`);
        }
      }

      // Success (200)
      return {
        success: true,
        message: 'Sản phẩm đã được thêm vào danh sách yêu thích',
        data: data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi thêm sản phẩm vào danh sách yêu thích');
    }
  }

  static async removeFromFavorites(productId: string, token: string): Promise<FavoriteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error('Bạn không có quyền xóa sản phẩm khỏi danh sách yêu thích');
          case 404:
            return {
              success: false,  
              message: 'Sản phẩm không tồn tại',
            };
          default:
            throw new Error(data.message || `Lỗi khi xóa sản phẩm khỏi danh sách yêu thích: ${response.statusText}`);
        }
      }

      return {
        success: true,
        message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích',
        data: data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi xóa sản phẩm khỏi danh sách yêu thích');
    }
  }

  static async getFavorites(token: string): Promise<FavoriteProduct[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/favorites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error('Bạn không có quyền truy cập danh sách yêu thích');
          case 404:
            throw new Error('Danh sách yêu thích không tồn tại');
          default:
            throw new Error(`Lỗi khi lấy danh sách yêu thích: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy danh sách yêu thích');
    }
  }
} 