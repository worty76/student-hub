'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { ProductService } from '@/services/product.service';
import { BuyProductRequest, BuyProductError } from '@/types/product';
import { 
  Loader2, 
  ShoppingCart, 
  CreditCard, 
  MapPin,
  CheckCircle 
} from 'lucide-react';

interface BuyProductButtonProps {
  productId: string;
  productTitle: string;
  price: number;
  isAvailable: boolean;
  sellerName?: string;
  className?: string;
}

export default function BuyProductButton({
  productId,
  productTitle,
  price,
  isAvailable,
  sellerName,
  className
}: BuyProductButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [errors, setErrors] = useState<{ shippingAddress?: string }>({});
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: { shippingAddress?: string } = {};
    
    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = 'Địa chỉ giao hàng bắt buộc điền';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Xin hãy đăng nhập để mua sắm"
      });
      router.push('/auth/login');
      return;
    }

    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Sản phẩm không khả dụng", 
        description: "Sản phẩm này không còn khả dụng để mua"
      });
      return;
    }

    setIsOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    setErrors({});

    try {
      const buyData: BuyProductRequest = {
        paymentMethod: 'cash',
        shippingAddress: shippingAddress.trim()
      };

      const response = await ProductService.buyProduct(productId, token, buyData);

      if (response.success) {
        // Show success state in modal
        setPurchaseSuccess(true);
        setSuccessMessage(response.message);
        setIsLoading(false);
        
        // Auto-close dialog and navigate after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setPurchaseSuccess(false);
          setShippingAddress('');
          setSuccessMessage('');
          
          // Show toast notification
          toast({
            title: "Mua sắm thành công!",
            description: response.message,
          });
          
          // Navigate to appropriate page
          if (response.orderId) {
            router.push(`/orders/${response.orderId}`);
          } else {
            router.push('/products');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Buy product error:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const buyError = error as BuyProductError;
        
        switch (buyError.code) {
          case 401:
            toast({
              variant: "destructive",
              title: "Không được phép",
              description: "Xin hãy đăng nhập lại để tiếp tục"
            });
            router.push('/auth/login');
            break;
          case 400:
            toast({
              variant: "destructive",
              title: "Mua sắm thất bại",
              description: "Dữ liệu nhập không hợp lệ hoặc sản phẩm không khả dụng"
            });
            break;
          case 404:
            toast({
              variant: "destructive",
              title: "Sản phẩm không tồn tại",
              description: "Sản phẩm bạn đang cố mua không còn tồn tại"
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Mua sắm thất bại",
              description: buyError.message || "Đã xảy ra lỗi không xác định"
            });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Mua sắm thất bại",
          description: "Đã xảy ra lỗi không xác định. Xin hãy thử lại."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setShippingAddress('');
    setErrors({});
    setPurchaseSuccess(false);
    setSuccessMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleBuyClick}
          disabled={!isAvailable}
          size="lg"
          className={`w-full ${className}`}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isAvailable ? 'Mua ngay' : 'Hết hàng'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        {purchaseSuccess ? (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <DialogTitle className="text-2xl text-green-600">
                  Mua sắm thành công!
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {successMessage}
                </DialogDescription>
              </div>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Xác nhận mua sắm
              </DialogTitle>
              <DialogDescription>
                Hoàn thành thông tin mua sắm dưới đây. Thanh toán sẽ được thực hiện khi nhận hàng.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Product Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-lg">{productTitle}</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá:</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
                </div>
                {sellerName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Người bán:</span>
                    <span className="font-medium">{sellerName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thanh toán:</span>
                  <span className="font-medium">Thanh toán khi nhận hàng</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <Label htmlFor="shippingAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ giao hàng *
                </Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Enter your complete shipping address..."
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (errors.shippingAddress) {
                      setErrors(prev => ({ ...prev, shippingAddress: undefined }));
                    }
                  }}
                  className={errors.shippingAddress ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.shippingAddress && (
                  <p className="text-sm text-red-600">{errors.shippingAddress}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Xác nhận mua sắm
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 