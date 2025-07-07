'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    // Extract all URL parameters
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setPaymentDetails(params);
  }, [searchParams]);

  const handleViewOrderHistory = () => {
    // Redirect to orders page if you have one
    router.push('/orders');
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-12 px-6 flex flex-col items-center">
            <CheckCircle className="h-24 w-24 text-white mb-6" />
            <CardTitle className="text-4xl font-bold text-white text-center">
              Thanh toán thành công!
            </CardTitle>
            <p className="text-white/90 mt-4 text-center text-lg">
              Cảm ơn bạn đã mua sản phẩm. Thanh toán của bạn đã được xử lý thành công.
            </p>
          </div>
          
          <CardContent className="pt-8 pb-8 px-8">
            <div className="space-y-8">
              {/* Payment Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiết thanh toán</h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  {paymentDetails.orderId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                      <span className="font-semibold">{paymentDetails.orderId}</span>
                    </div>
                  )}
                  {paymentDetails.amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Số tiền:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          parseInt(paymentDetails.amount)
                        )}
                      </span>
                    </div>
                  )}
                  {paymentDetails.paymentStatus && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Trạng thái:</span>
                      <span className="font-semibold text-green-600">
                        {paymentDetails.paymentStatus}
                      </span>
                    </div>
                  )}
                  {paymentDetails.transId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Mã giao dịch:</span>
                      <span className="font-semibold">{paymentDetails.transId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Bước tiếp theo</h3>
                <p className="text-gray-600 mb-4">
                  Bạn sẽ nhận được email xác nhận đơn hàng. Người bán sẽ liên hệ với bạn để bàn giao sản phẩm.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button
                  size="lg"
                  className="py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  onClick={handleViewOrderHistory}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Xem lịch sử đơn hàng
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="py-6"
                  onClick={handleReturnHome}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Quay lại trang chủ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 