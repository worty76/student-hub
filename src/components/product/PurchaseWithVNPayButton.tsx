import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/payment.service';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface PurchaseWithVNPayButtonProps {
  productId: string;
  className?: string;
}

export function PurchaseWithVNPayButton({ productId, className }: PurchaseWithVNPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuthStore();

  const handlePurchaseWithVNPay = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Đăng nhập yêu cầu",
        description: "Vui lòng đăng nhập để tiếp tục thanh toán",
        variant: "destructive",
      });
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);
      // Using the new purchase endpoint
      const response = await paymentService.purchaseWithVNPay(token, productId);
      
      if (response.success && response.payUrl) {
        // Show success toast with product info
        toast({
          title: "Đang chuyển hướng đến trang thanh toán",
          description: `Đang xử lý thanh toán cho ${response.product.title}`,
        });
        
        // Redirect to VNPAY payment page
        window.location.href = response.payUrl;
      } else {
        toast({
          title: "Lỗi thanh toán",
          description: "Không thể khởi tạo thanh toán VNPAY",
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Lỗi thanh toán",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePurchaseWithVNPay} 
      disabled={isLoading}
      className={`bg-gradient-to-r from-[#0066b3] to-[#005399] hover:from-[#005399] hover:to-[#004077] text-white flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Thanh toán với VNPAY</span>
          </div>
        </>
      )}
    </Button>
  );
} 