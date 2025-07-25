import { CreateProductRequest, CreateProductResponse, EditProductRequest, EditProductResponse, DeleteProductResponse, Product, BuyProductRequest, BuyProductResponse, BuyProductError, ReportProductRequest, ReportProductResponse, ReportProductError, ProductsQueryParams, ProductsResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy sản phẩm nào');
        }
        throw new Error(`Lỗi khi tải sản phẩm: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải sản phẩm');
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy sản phẩm nào trong danh mục này');
        }
        throw new Error(`Lỗi khi tải sản phẩm: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải sản phẩm theo danh mục');
    }
  }

  static async createProduct(token: string, productData: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      const formData = new FormData();
      
      if (productData._id) {
        formData.append('_id', productData._id);
      }
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('condition', productData.condition);
      formData.append('status', productData.status);
      formData.append('seller', productData.seller);
      formData.append('location', productData.location);

      // Handle images - can be files or URLs
      productData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        } else {
          formData.append('images', image);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('❌ API request failed with status:', response.status);
        
        if (response.status === 401) {
          console.log('❌ 401 Unauthorized - token invalid or expired');
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 400) {
          console.log('❌ 400 Bad Request - validation errors:', data);
          return {
            success: false,
            message: data.message || 'Dữ liệu không hợp lệ',
            errors: data.errors || {},
          };
        }
        
        if (response.status === 500) {
          console.log('❌ 500 Server Error:', data);
          throw new Error('Lỗi máy chủ. Vui lòng kiểm tra lại dữ liệu và thử lại sau.');
        }
        
        console.log('❌ Other error status:', response.status, data);
        throw new Error(data.message || `Lỗi khi đăng bán sản phẩm: ${response.statusText}`);
      }

      const successResponse = {
        success: true,
        message: data.message || 'Sản phẩm đã được đăng bán thành công',
        product: data,
      };
      
      return successResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi đăng bán sản phẩm');
    }
  }

  static async getProduct(productId: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${response.statusText}`);
      }

      const product: Product = await response.json();
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy thông tin sản phẩm');
    }
  }

  static async editProduct(productId: string, token: string, productData: EditProductRequest): Promise<EditProductResponse> {
    try {
      const formData = new FormData();
      formData.append('_id', productData._id);
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('condition', productData.condition);
      formData.append('status', productData.status);
      formData.append('seller', productData.seller);
      formData.append('location', productData.location);

      // Handle images - can be files or URLs
      productData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        } else {
          formData.append('images', image);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 403) {
          throw new Error('Bạn không có quyền chỉnh sửa sản phẩm này');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        if (response.status === 400) {
          // Return validation errors
          return {
            success: false,
            message: data.message || 'Dữ liệu không hợp lệ',
            errors: data.errors || {},
          };
        }
        
        if (response.status === 500) {
          console.log('❌ 500 Server Error:', data);
          throw new Error('Lỗi máy chủ. Vui lòng kiểm tra lại dữ liệu và thử lại sau.');
        }
        
        throw new Error(data.message || `Lỗi khi chỉnh sửa sản phẩm: ${response.statusText}`);
      }

      // Success response (200 OK)
      const successResponse = {
        success: true,
        message: data.message || 'Sản phẩm đã được cập nhật thành công',
        product: data,
      };
      
      return successResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi chỉnh sửa sản phẩm');
    }
  }

  static async getUserProducts(token: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        throw new Error(`Lỗi khi lấy thông tin sản phẩm của người dùng: ${response.statusText}`);
      }

      const products: Product[] = await response.json();
      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy thông tin sản phẩm của người dùng');
    }
  }

  static async getUserProductsByUserId(userId: string, token?: string): Promise<Product[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/products/user/${userId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        if (response.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
        throw new Error(`Lỗi khi lấy thông tin sản phẩm của người dùng: ${response.statusText}`);
      }

      const products: Product[] = await response.json();
      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy thông tin sản phẩm của người dùng');
    }
  }

  static async deleteProduct(productId: string, token: string): Promise<DeleteProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 403) {
          throw new Error('Bạn không có quyền xóa sản phẩm này');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi xóa sản phẩm: ${response.statusText}`);
      }

      // Success response (200 OK)
      return {
        success: true,
        message: data.message || 'Sản phẩm đã được xóa thành công',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi xóa sản phẩm');
    }
  }

  static async buyProduct(productId: string, token: string, buyData: BuyProductRequest): Promise<BuyProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyData),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: BuyProductError = {
          message: data.message || 'Lỗi khi mua sản phẩm',
          code: response.status
        };

        if (response.status === 401) {
          error.message = 'Vui lòng đăng nhập lại';
          throw error;
        }
        
        if (response.status === 400) {
          error.message = 'Sản phẩm không có sẵn';
          throw error;
        }
        
        if (response.status === 404) {
          error.message = 'Sản phẩm không tồn tại';
          throw error;
        }
        
        throw error;
      }

      // Success response (200 OK)
      return {
        success: true,
        message: data.message || 'Sản phẩm đã được mua thành công',
        orderId: data.orderId,
        orderDetails: data.orderDetails
      };
    } catch (error) {
      if (error instanceof Error || (error && typeof error === 'object' && 'code' in error)) {
        throw error;
      }
      throw new Error('Lỗi khi mua sản phẩm');
    }
  }

  static async reportProduct(productId: string, token: string, reportData: ReportProductRequest): Promise<ReportProductResponse> {
    try {
      console.log(`Reporting product with ID ${productId}`, reportData);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      console.log('Report API response:', response.status, data);

      if (!response.ok) {
        const error: ReportProductError = {
          message: data.message || 'Lỗi khi báo cáo sản phẩm',
          code: response.status
        };

        if (response.status === 401) {
          error.message = 'Vui lòng đăng nhập lại';
          throw error;
        }
        
        if (response.status === 400) {
          // Enhanced error message by including the server's response
          error.message = `Dữ liệu nhập không hợp lệ: ${data.details || data.message || ''}`;
          console.error('Validation error details:', data);
          throw error;
        }
        
        if (response.status === 404) {
          error.message = 'Sản phẩm không tồn tại';
          throw error;
        }
        
        throw error;
      }

      return {
        success: true,
        message: data.message || 'Báo cáo sản phẩm thành công',
        reportId: data.reportId
      };
    } catch (error) {
      if (error instanceof Error || (error && typeof error === 'object' && 'code' in error)) {
        throw error;
      }
      throw new Error('Lỗi khi báo cáo sản phẩm');
    }
  }

  static async searchProducts(query: string, params: Omit<ProductsQueryParams, 'search'> = {}): Promise<ProductsResponse> {
    try {
      // Build query string from params (excluding search since it's in the URL)
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.category) queryParams.set('category', params.category);
      if (params.condition) queryParams.set('condition', params.condition);
      if (params.status) queryParams.set('status', params.status);
      if (params.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
      if (params.location) queryParams.set('location', params.location);
      if (params.sortBy) queryParams.set('sort', params.sortBy);
      if (params.sortOrder) queryParams.set('order', params.sortOrder);

      const queryString = queryParams.toString();
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_BASE_URL}/products/search/${encodedQuery}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Return empty result for no matches instead of throwing error
          return {
            products: [],
            pagination: {
              total: 0,
              page: params.page || 1,
              limit: params.limit || 12,
              pages: 0
            }
          };
        }
        throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different API response formats
      if (data.products && Array.isArray(data.products)) {
        return {
          products: data.products,
          pagination: data.pagination || {
            total: data.products.length,
            page: params.page || 1,
            limit: params.limit || 12,
            pages: Math.ceil(data.products.length / (params.limit || 12))
          }
        };
      } else if (Array.isArray(data)) {
        const products = data;
        const total = products.length;
        const limit = params.limit || 12;
        const page = params.page || 1;
        const pages = Math.ceil(total / limit);
        
        // Manual pagination if API doesn't support it
        const paginatedProducts = products.slice((page - 1) * limit, page * limit);
        
        return {
          products: paginatedProducts,
          pagination: {
            total,
            page,
            limit,
            pages
          }
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tìm kiếm sản phẩm');
    }
  }

  static async getProductsWithPagination(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    try {
      // If there's a search query, use the search endpoint instead
      if (params.search && params.search.trim()) {
        const { search, ...otherParams } = params;
        return this.searchProducts(search, otherParams);
      }

      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.category) queryParams.set('category', params.category);
      if (params.condition) queryParams.set('condition', params.condition);
      if (params.status) queryParams.set('status', params.status);
      if (params.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
      if (params.location) queryParams.set('location', params.location);
      if (params.sortBy) queryParams.set('sort', params.sortBy);
      if (params.sortOrder) queryParams.set('order', params.sortOrder);

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy sản phẩm nào');
        }
        throw new Error(`Lỗi khi tải sản phẩm: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.products && Array.isArray(data.products)) {
        return {
          products: data.products,
          pagination: data.pagination || {
            total: data.products.length,
            page: params.page || 1,
            limit: params.limit || 10,
            pages: Math.ceil(data.products.length / (params.limit || 10))
          }
        };
      } else if (Array.isArray(data)) {
        const products = data;
        const total = products.length;
        const limit = params.limit || 10;
        const page = params.page || 1;
        const pages = Math.ceil(total / limit);
        
        const paginatedProducts = products.slice((page - 1) * limit, page * limit);
        
        return {
          products: paginatedProducts,
          pagination: {
            total,
            page,
            limit,
            pages
          }
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải sản phẩm');
    }
  }
}

export const productService = {
  getAllProducts: ProductService.getAllProducts,
  createProduct: ProductService.createProduct,
  editProduct: ProductService.editProduct,
  deleteProduct: ProductService.deleteProduct,
  getProduct: ProductService.getProduct,
  getUserProducts: ProductService.getUserProducts,
  getUserProductsByUserId: ProductService.getUserProductsByUserId,
  buyProduct: ProductService.buyProduct,
  reportProduct: ProductService.reportProduct,
  getProductsWithPagination: ProductService.getProductsWithPagination,
  searchProducts: ProductService.searchProducts,
}; 