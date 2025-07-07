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
  CheckCircle,
  Banknote
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
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
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
          className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0 ${className}`}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isAvailable ? 'Mua ngay' : 'Hết hàng'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[520px] shadow-2xl border-0">
        {purchaseSuccess ? (
          <>
            <DialogHeader className="pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-green-700">
                  Mua sắm thành công!
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  {successMessage}
                </DialogDescription>
              </div>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                Xác nhận mua sắm
              </DialogTitle>
              <DialogDescription className="text-gray-600 pt-2">
                Hoàn thành thông tin mua sắm dưới đây. Thanh toán sẽ được thực hiện khi nhận hàng.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Product Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">{productTitle}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Giá:</span>
                      <p className="font-bold text-2xl text-green-600">{formatPrice(price)}</p>
                    </div>
                    {sellerName && (
                      <div>
                        <span className="text-gray-600">Người bán:</span>
                        <p className="font-semibold text-gray-800">{sellerName}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600 text-sm">Thanh toán:</span>
                      <span className="font-semibold text-green-600">Thanh toán khi nhận hàng</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <Label htmlFor="shippingAddress" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-blue-600" />
                  </div>
                  Địa chỉ giao hàng *
                </Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Nhập địa chỉ đầy đủ để giao hàng..."
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (errors.shippingAddress) {
                      setErrors(prev => ({ ...prev, shippingAddress: undefined }));
                    }
                  }}
                  className={`resize-none transition-all duration-200 ${errors.shippingAddress ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                  rows={3}
                />
                {errors.shippingAddress && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">!</span>
                    {errors.shippingAddress}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isLoading || !shippingAddress.trim()}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
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