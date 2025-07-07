const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub.onrender.com/api';

export interface MomoPaymentRequest {
  productId: string;
}

export interface MomoPaymentResponse {
  success: boolean;
  payUrl: string;
  orderId: string;
}

export interface VNPayPaymentRequest {
  productId: string;
  bankCode?: string;
  locale?: string;
}

export interface VNPayPaymentResponse {
  success: boolean;
  payUrl: string;
  orderId: string;
}

export interface ProductPurchaseRequest {
  shippingAddress: string;
  bankCode?: string;
  locale?: string;
}

export interface ProductPurchaseResponse {
  success: boolean;
  payUrl: string;
  orderId: string;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

export interface PurchaseHistoryItem {
  orderId: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  shippingAddress: string;
  purchaseDate: string;
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    condition: string;
    status: string;
    location: string;
    seller: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
  };
}

export interface PurchaseHistoryPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PurchaseHistoryResponse {
  success: boolean;
  data: {
    purchases: PurchaseHistoryItem[];
    pagination: PurchaseHistoryPagination;
  };
}

export interface PurchaseHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}

export class PaymentService {
  static async createMomoPayment(token: string, productId: string): Promise<MomoPaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/momo/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 400) {
          throw new Error('Yêu cầu không hợp lệ');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        throw new Error(data.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      }

      return data as MomoPaymentResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Có lỗi xảy ra khi xử lý thanh toán');
    }
  }

  static async createVNPayPayment(token: string, paymentData: VNPayPaymentRequest): Promise<VNPayPaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/vnpay/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: paymentData.productId,
          bankCode: paymentData.bankCode || 'NCB',
          locale: paymentData.locale || 'vn',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 400) {
          throw new Error('Yêu cầu không hợp lệ');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        throw new Error(data.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      }

      return data as VNPayPaymentResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Có lỗi xảy ra khi xử lý thanh toán VNPAY');
    }
  }

  static async purchaseWithVNPay(token: string, productId: string, purchaseData: ProductPurchaseRequest): Promise<ProductPurchaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: purchaseData.shippingAddress,
          bankCode: purchaseData.bankCode || 'NCB',
          locale: purchaseData.locale || 'vn',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập lại');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Yêu cầu không hợp lệ');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        throw new Error(data.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      }

      return data as ProductPurchaseResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Có lỗi xảy ra khi xử lý thanh toán VNPAY');
    }
  }

  static async getPurchaseHistory(token: string, params: PurchaseHistoryParams = {}): Promise<PurchaseHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/payments/purchases${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        
        throw new Error(data.message || 'Có lỗi xảy ra khi tải lịch sử mua hàng');
      }

      return data as PurchaseHistoryResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Có lỗi xảy ra khi tải lịch sử mua hàng');
    }
  }
}

export const paymentService = {
  createMomoPayment: PaymentService.createMomoPayment,
  createVNPayPayment: PaymentService.createVNPayPayment,
  purchaseWithVNPay: PaymentService.purchaseWithVNPay,
  getPurchaseHistory: PaymentService.getPurchaseHistory,
}; 