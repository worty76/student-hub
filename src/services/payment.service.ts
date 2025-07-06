import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub.onrender.com/api';

export interface MomoPaymentRequest {
  productId: string;
}

export interface MomoPaymentResponse {
  success: boolean;
  payUrl: string;
  orderId: string;
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
}

export const paymentService = {
  createMomoPayment: PaymentService.createMomoPayment,
}; 