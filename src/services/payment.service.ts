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

  static async purchaseWithVNPay(token: string, productId: string, purchaseData: ProductPurchaseRequest = {}): Promise<ProductPurchaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          throw new Error('Yêu cầu không hợp lệ');
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
}

export const paymentService = {
  createMomoPayment: PaymentService.createMomoPayment,
  createVNPayPayment: PaymentService.createVNPayPayment,
  purchaseWithVNPay: PaymentService.purchaseWithVNPay,
}; 