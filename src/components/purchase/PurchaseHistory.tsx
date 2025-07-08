/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseStore } from "@/store/purchaseStore";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  User,
  Package,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Edit,
} from "lucide-react";
import {
  formatPrice,
  formatDate,
  getConditionColor,
  getStatusColor,
} from "@/lib/utils";
import { PurchaseHistoryItem } from "@/services/payment.service";
import EditPurchaseDialog from "./EditPurchaseDialog";

export default function PurchaseHistory() {
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated, initializeAuth } = useAuthStore();
  const {
    purchases,
    pagination,
    isLoading,
    error,
    confirmingReceipt,
    fetchPurchases,
    confirmReceipt,
    setFilters,
    clearFilters,
    clearError,
  } = usePurchaseStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
    setIsAuthInitialized(true);
  }, [initializeAuth]);

  // Load purchases when auth is ready
  useEffect(() => {
    if (!isAuthInitialized) return;

    if (!isAuthenticated || !token) {
      router.push("/auth/login");
      return;
    }

    loadPurchases();
  }, [isAuthenticated, token, isAuthInitialized]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const loadPurchases = async (params = {}) => {
    if (!token) return;

    try {
      await fetchPurchases(token, params);
    } catch (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải lịch sử mua hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
    loadPurchases({ page: newPage });
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters({ [key]: value });
    loadPurchases({ [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    loadPurchases({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleViewSeller = (sellerId: string) => {
    router.push(`/users/${sellerId}`);
  };

  const handleConfirmReceipt = async (orderId: string) => {
    if (!token) return;

    try {
      await confirmReceipt(token, orderId);
      toast({
        title: "Thành công",
        description: "Đã xác nhận nhận hàng thành công.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Lỗi xác nhận",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xác nhận nhận hàng.",
        variant: "destructive",
      });
    }
  };

  const handleEditPurchase = (orderId: string) => {
    setSelectedOrderId(orderId);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    loadPurchases(); // Reload purchases after successful edit
  };

  // Show loading while auth is initializing
  if (!isAuthInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Đang kiểm tra đăng nhập...
              </h3>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Yêu cầu đăng nhập</h3>
              <p className="text-gray-600 mb-4">
                Vui lòng đăng nhập để xem lịch sử mua hàng
              </p>
              <Button onClick={() => router.push("/auth/login")}>
                Đăng nhập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Lịch sử mua hàng</h1>
        </div>
        <p className="text-gray-600">Quản lý và theo dõi các đơn hàng đã mua</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="failed">Đã hủy</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">Sách</SelectItem>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="clothing">Quần áo</SelectItem>
                  <SelectItem value="furniture">Nội thất</SelectItem>
                  <SelectItem value="vehicles">Xe cộ</SelectItem>
                  <SelectItem value="services">Dịch vụ</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Ngày mua</SelectItem>
                  <SelectItem value="amount">Số tiền</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mới nhất</SelectItem>
                  <SelectItem value="asc">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Purchase List */}
      {!isLoading && purchases.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa thực hiện giao dịch mua hàng nào
              </p>
              <Button onClick={() => router.push("/products")}>
                Khám phá sản phẩm
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && purchases.length > 0 && (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <PurchaseCard
              key={purchase.orderId}
              purchase={purchase}
              onViewProduct={handleViewProduct}
              onViewSeller={handleViewSeller}
              onConfirmReceipt={handleConfirmReceipt}
              onEditPurchase={handleEditPurchase}
              isConfirming={confirmingReceipt === purchase.orderId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="mt-8 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                trong tổng số {pagination.totalItems} đơn hàng
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 &&
                        page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={
                            page === pagination.currentPage
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handlePageChange(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === pagination.currentPage - 2 ||
                      page === pagination.currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <EditPurchaseDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        orderId={selectedOrderId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

// Individual Purchase Card Component
interface PurchaseCardProps {
  purchase: PurchaseHistoryItem;
  onViewProduct: (productId: string) => void;
  onViewSeller: (sellerId: string) => void;
  onConfirmReceipt: (orderId: string) => void;
  onEditPurchase: (orderId: string) => void;
  isConfirming: boolean;
}

function PurchaseCard({
  purchase,
  onViewProduct,
  onViewSeller,
  onConfirmReceipt,
  onEditPurchase,
  isConfirming,
}: PurchaseCardProps) {
  const isCanceled = purchase.paymentStatus === "failed";

  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isCanceled ? "opacity-75 bg-gray-50" : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle
              className={`text-lg font-semibold ${
                isCanceled ? "text-gray-600" : "text-gray-800"
              }`}
            >
              Đơn hàng #{purchase.orderId}
              {isCanceled && (
                <span className="text-red-600 ml-2">(Đã hủy)</span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {formatDate.dateTime(purchase.purchaseDate)}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
              {formatPrice(purchase.amount)}
            </Badge>
            <Badge
              className={`${
                purchase.paymentMethod === "vnpay"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                  : "bg-pink-100 text-pink-800 hover:bg-pink-200 hover:text-pink-900"
              }`}
            >
              {purchase.paymentMethod === "cash"
                ? "Thanh toán khi nhận hàng"
                : purchase.paymentMethod.toUpperCase()}
            </Badge>
            {purchase.paymentStatus === "failed" && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">
                ĐÃ HỦY
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {purchase.product.images && purchase.product.images.length > 0 ? (
                <img
                  src={purchase.product.images[0]}
                  alt={purchase.product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {purchase.product.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {purchase.product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Địa điểm:</span>
                  <span className="font-medium">
                    {purchase.product.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Người bán:</span>
                  <span className="font-medium">
                    {purchase.product.seller.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {purchase.transactionId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {purchase.receivedSuccessfully ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-gray-600">Trạng thái nhận hàng:</span>
                  <span
                    className={`font-medium ${
                      purchase.receivedSuccessfully
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {purchase.receivedSuccessfully
                      ? "Đã nhận được hàng"
                      : "Chưa nhận được hàng"}
                  </span>
                </div>
                {purchase.receivedSuccessfully &&
                  purchase.receivedConfirmedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Ngày xác nhận:</span>
                      <span className="font-medium text-green-600">
                        {formatDate.deadline(purchase.receivedConfirmedAt)}
                      </span>
                    </div>
                  )}
                {!purchase.receivedSuccessfully && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Hạn nhận hàng:</span>
                    <span className="font-medium text-orange-600">
                      {formatDate.deadline(
                        purchase.receivedSuccessfullyDeadline
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Địa chỉ giao hàng:</span>
                </div>
                <p className="text-sm bg-gray-50 p-2 rounded border">
                  {purchase.shippingAddress}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getConditionColor(purchase.product.condition)}>
                {purchase.product.condition}
              </Badge>
              <Badge className={getStatusColor(purchase.product.status)}>
                {purchase.product.status}
              </Badge>
              <Badge variant="outline">{purchase.product.category}</Badge>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onViewProduct(purchase.product._id)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Xem sản phẩm
              </Button>
              <Button
                variant="outline"
                onClick={() => onViewSeller(purchase.product.seller._id)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Xem người bán
              </Button>
              {!purchase.receivedSuccessfully && !isCanceled && (
                <Button
                  onClick={() => onConfirmReceipt(purchase.orderId)}
                  disabled={isConfirming}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xác nhận...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Xác nhận nhận hàng
                    </>
                  )}
                </Button>
              )}
              {!isCanceled && (
                <Button
                  variant="outline"
                  onClick={() => onEditPurchase(purchase.orderId)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
              {isCanceled && (
                <Button
                  variant="outline"
                  disabled
                  className="flex items-center gap-2 text-gray-400"
                >
                  <XCircle className="h-4 w-4" />
                  Đơn hàng đã hủy
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
