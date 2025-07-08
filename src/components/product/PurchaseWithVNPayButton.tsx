/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paymentService } from "@/services/payment.service";
import { productService } from "@/services/product.service";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import { CreditCard, Loader2, MapPin } from "lucide-react";
import { Product } from "@/types/product";

interface PurchaseWithVNPayButtonProps {
  productId: string;
  className?: string;
}

export function PurchaseWithVNPayButton({
  productId,
  className,
}: PurchaseWithVNPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuthStore();

  // Fetch product details when dialog opens
  useEffect(() => {
    if (isDialogOpen && productId && !product) {
      fetchProductDetails();
    }
  }, [isDialogOpen, productId]);

  const fetchProductDetails = async () => {
    try {
      const productData = await productService.getProduct(productId);
      setProduct(productData);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sản phẩm",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const getSellerName = (seller: string | { name?: string } | undefined) => {
    if (typeof seller === "string") return seller;
    return seller?.name || "Unknown";
  };

  const handleButtonClick = () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Đăng nhập yêu cầu",
        description: "Vui lòng đăng nhập để tiếp tục thanh toán",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!shippingAddress.trim()) {
      toast({
        title: "Địa chỉ giao hàng yêu cầu",
        description: "Vui lòng nhập địa chỉ giao hàng",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Using the new purchase endpoint with shipping address
      const response = await paymentService.purchaseWithVNPay(
        token!,
        productId,
        {
          shippingAddress: shippingAddress.trim(),
          bankCode: "NCB",
          locale: "vn",
        }
      );

      if (response.success && response.payUrl) {
        // Show success toast with product info
        toast({
          title: "Đang chuyển hướng đến trang thanh toán",
          description: `Đang xử lý thanh toán cho ${response.product.title}`,
        });

        // Close dialog before redirect
        setIsDialogOpen(false);

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
    <>
      <Button
        onClick={handleButtonClick}
        disabled={isLoading}
        size="lg"
        className={`bg-gradient-to-r from-[#0066b3] to-[#005399] hover:from-[#005399] hover:to-[#004077] text-white flex items-center justify-center gap-2 ${className} border-0`}
      >
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <span>Thanh toán với VNPAY</span>
        </div>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[520px] bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              Xác nhận thanh toán VNPAY
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              Hoàn thành thông tin dưới đây để tiến hành thanh toán an toàn qua
              VNPAY.
            </DialogDescription>
          </DialogHeader>

          {product && (
            <div className="space-y-6">
              {/* Product Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 leading-tight">
                        {product.title}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-gray-500 text-sm font-medium">
                        Giá thanh toán
                      </span>
                      <p className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 text-sm font-medium">
                        Người bán
                      </span>
                      <p className="font-semibold text-gray-700">
                        {getSellerName(product.seller)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-200">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm font-medium">
                        Phương thức thanh toán
                      </span>
                      <p className="font-semibold text-blue-600">VNPAY</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <Label
                  htmlFor="shippingAddress"
                  className="flex items-center gap-2 text-base font-semibold text-gray-700"
                >
                  <div className="p-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  Địa chỉ giao hàng *
                </Label>
                <Input
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng đầy đủ (ví dụ: Đại học FPT, Hà Nội)..."
                  className="w-full h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-base"
                  required
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="h-12 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isLoading || !shippingAddress.trim()}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý thanh toán...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Thanh toán ngay
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
