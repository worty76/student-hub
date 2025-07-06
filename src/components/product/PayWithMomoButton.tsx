import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/payment.service';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';

interface PayWithMomoButtonProps {
  productId: string;
  className?: string;
}

export function PayWithMomoButton({ productId, className }: PayWithMomoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuthStore();

  const handlePayWithMomo = async () => {
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
      const response = await paymentService.createMomoPayment(token, productId);
      
      if (response.success && response.payUrl) {
        // Redirect to MoMo payment page
        window.location.href = response.payUrl;
      } else {
        toast({
          title: "Lỗi thanh toán",
          description: "Không thể khởi tạo thanh toán MoMo",
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
      onClick={handlePayWithMomo} 
      disabled={isLoading}
      className={`bg-[#ae2070] hover:bg-[#8e1a5c] text-white flex items-center gap-2 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span>Đang xử lý...</span>
        </div>
      ) : (
        <>
          <Image 
            src="/momo-logo.png" 
            alt="MoMo Logo" 
            width={24} 
            height={24}
            className="rounded-sm"
          />
          <span>Thanh toán với MoMo</span>
        </>
      )}
    </Button>
  );
} 