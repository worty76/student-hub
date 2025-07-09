/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  getPurchaseDetailsForEdit,
  updatePurchaseShippingAddress,
  updatePurchaseNotes,
  cancelPurchase,
} from "@/services/payment.service";
import {
  Loader2,
  MapPin,
  MessageSquare,
  XCircle,
  AlertTriangle,
  Package,
  User,
  Clock,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

// Utility function to format time remaining
const formatTimeRemaining = (timeRemainingMs: number) => {
  if (timeRemainingMs <= 0) return "Hết hạn";

  const hours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

interface PurchaseDetails {
  orderId: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  purchaseDate: string;
  updatedAt: string;
  receivedSuccessfully: boolean;
  receivedSuccessfullyDeadline: string;
  receivedConfirmedAt?: string;
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
      avatar?: string;
    };
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  buyerNotes?: {
    content: string;
    updatedAt: string;
    updatedBy: string;
  };
  sellerNotes?: {
    content: string;
    updatedAt: string;
    updatedBy: string;
  };
  cancellation?: {
    cancelledBy: string;
    reason: string;
    cancelledAt: string;
  };
  timeInfo: {
    hoursSinceOrder: number;
    isWithin6Hours: boolean;
    timeRemainingMs: number;
    editDeadline: string;
  };
  permissions: {
    canEditShipping: boolean;
    canCancel: boolean;
    canAddNotes: boolean;
    userRole: "buyer" | "seller";
  };
}

export default function EditPurchaseDialog({
  isOpen,
  onClose,
  orderId,
  onSuccess,
}: EditPurchaseDialogProps) {
  const { toast } = useToast();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseDetails, setPurchaseDetails] =
    useState<PurchaseDetails | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Form states
  const [newShippingAddress, setNewShippingAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (isOpen && orderId && token) {
      loadPurchaseDetails();
    }
  }, [isOpen, orderId, token]);

  // Initialize and update time remaining
  useEffect(() => {
    if (purchaseDetails?.timeInfo) {
      setTimeRemaining(purchaseDetails.timeInfo.timeRemainingMs);

      // Update every minute
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const orderTime = new Date(purchaseDetails.purchaseDate).getTime();
        const elapsed = currentTime - orderTime;
        const remaining = Math.max(0, 6 * 60 * 60 * 1000 - elapsed);

        setTimeRemaining(remaining);

        // If time is up, reload purchase details to update permissions
        if (remaining === 0) {
          loadPurchaseDetails();
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [purchaseDetails?.timeInfo]);

  const loadPurchaseDetails = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getPurchaseDetailsForEdit(token, orderId);
      if (response.success) {
        setPurchaseDetails(response.purchase);
        setNewShippingAddress(response.purchase.shippingAddress || "");
        setActiveTab("info");
      }
    } catch (error) {
      console.error("Error loading purchase details:", error);
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể tải thông tin đơn hàng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateShippingAddress = async () => {
    if (!token || !newShippingAddress.trim()) return;

    setIsSubmitting(true);
    try {
      await updatePurchaseShippingAddress(
        token,
        orderId,
        newShippingAddress.trim()
      );
      toast({
        title: "Thành công",
        description: "Cập nhật địa chỉ giao hàng thành công",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật địa chỉ giao hàng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!token || !newNotes.trim()) return;

    setIsSubmitting(true);
    try {
      await updatePurchaseNotes(token, orderId, newNotes.trim());
      toast({
        title: "Thành công",
        description: "Cập nhật ghi chú thành công",
      });
      setNewNotes("");
      loadPurchaseDetails(); // Reload to see updated notes
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật ghi chú",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPurchase = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await cancelPurchase(token, orderId, cancelReason.trim() || undefined);
      toast({
        title: "Thành công",
        description: "Hủy đơn hàng thành công",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể hủy đơn hàng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!purchaseDetails && isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đang tải thông tin đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!purchaseDetails) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chỉnh sửa đơn hàng #{purchaseDetails.orderId}
          </DialogTitle>
          <DialogDescription>
            Quản lý thông tin đơn hàng của bạn
          </DialogDescription>

          {/* Time remaining display */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Thời gian chỉnh sửa:
              </span>
              {timeRemaining > 0 ? (
                <span className="text-blue-700">
                  Còn lại {formatTimeRemaining(timeRemaining)} để thay đổi địa
                  chỉ hoặc hủy đơn
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Đã hết thời gian chỉnh sửa (sau 6 giờ kể từ lúc đặt hàng)
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger
              value="shipping"
              disabled={
                !purchaseDetails.permissions.canEditShipping ||
                timeRemaining <= 0
              }
            >
              Địa chỉ
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              disabled={!purchaseDetails.permissions.canAddNotes}
            >
              Ghi chú
            </TabsTrigger>
            <TabsTrigger
              value="cancel"
              disabled={
                !purchaseDetails.permissions.canCancel || timeRemaining <= 0
              }
            >
              Hủy đơn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Mã đơn hàng</Label>
                    <p className="font-semibold">{purchaseDetails.orderId}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Giá trị</Label>
                    <p className="font-bold text-green-600">
                      {formatPrice(purchaseDetails.amount)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">
                      Phương thức thanh toán
                    </Label>
                    <Badge variant="outline">
                      {purchaseDetails.paymentMethod === "cash"
                        ? "Thanh toán khi nhận hàng"
                        : purchaseDetails.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-600">Trạng thái</Label>
                    <Badge
                      className={
                        purchaseDetails.receivedSuccessfully
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {purchaseDetails.receivedSuccessfully
                        ? "Đã nhận hàng"
                        : "Chưa nhận hàng"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-600">Ngày mua</Label>
                    <p>{formatDate.dateTime(purchaseDetails.purchaseDate)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Hạn nhận hàng</Label>
                    <p className="text-orange-600">
                      {formatDate.deadline(
                        purchaseDetails.receivedSuccessfullyDeadline
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">Sản phẩm</Label>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {purchaseDetails.product.images?.[0] && (
                      <img
                        src={purchaseDetails.product.images[0]}
                        alt={purchaseDetails.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">
                        {purchaseDetails.product.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {purchaseDetails.product.seller.name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {purchaseDetails.product.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">
                    Địa chỉ giao hàng hiện tại
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p>{purchaseDetails.shippingAddress}</p>
                  </div>
                </div>

                {/* Show existing notes */}
                {(purchaseDetails.buyerNotes ||
                  purchaseDetails.sellerNotes) && (
                  <div>
                    <Label className="text-gray-600">Ghi chú hiện có</Label>
                    <div className="space-y-2">
                      {purchaseDetails.buyerNotes && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Ghi chú của người mua
                            </span>
                          </div>
                          <p className="text-sm">
                            {purchaseDetails.buyerNotes.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate.dateTime(
                              purchaseDetails.buyerNotes.updatedAt
                            )}
                          </p>
                        </div>
                      )}
                      {purchaseDetails.sellerNotes && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Ghi chú của người bán
                            </span>
                          </div>
                          <p className="text-sm">
                            {purchaseDetails.sellerNotes.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate.dateTime(
                              purchaseDetails.sellerNotes.updatedAt
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Show cancellation info if cancelled */}
                {purchaseDetails.cancellation && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Đơn hàng đã bị hủy</strong>
                      <br />
                      Lý do: {purchaseDetails.cancellation.reason}
                      <br />
                      Thời gian:{" "}
                      {formatDate.dateTime(
                        purchaseDetails.cancellation.cancelledAt
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Cập nhật địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeRemaining <= 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Hết thời gian chỉnh sửa:</strong> Bạn chỉ có thể
                      thay đổi địa chỉ giao hàng trong vòng 6 giờ kể từ khi đặt
                      hàng.
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="shipping-address">
                    Địa chỉ giao hàng mới
                  </Label>
                  <Textarea
                    id="shipping-address"
                    value={newShippingAddress}
                    onChange={(e) => setNewShippingAddress(e.target.value)}
                    placeholder="Nhập địa chỉ giao hàng mới..."
                    rows={3}
                    disabled={timeRemaining <= 0}
                  />
                </div>
                <Button
                  onClick={handleUpdateShippingAddress}
                  disabled={
                    isSubmitting ||
                    !newShippingAddress.trim() ||
                    newShippingAddress.trim() ===
                      purchaseDetails.shippingAddress ||
                    timeRemaining <= 0
                  }
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      {timeRemaining > 0
                        ? "Cập nhật địa chỉ"
                        : "Hết thời gian chỉnh sửa"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Thêm ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">
                    Ghi chú của{" "}
                    {purchaseDetails.permissions.userRole === "buyer"
                      ? "người mua"
                      : "người bán"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Nhập ghi chú của bạn..."
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleUpdateNotes}
                  disabled={isSubmitting || !newNotes.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Lưu ghi chú
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Hủy đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeRemaining <= 0 ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Hết thời gian hủy đơn:</strong> Bạn chỉ có thể hủy
                      đơn hàng trong vòng 6 giờ kể từ khi đặt hàng.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Cảnh báo:</strong> Hành động này không thể hoàn
                      tác. Đơn hàng sẽ bị hủy và sản phẩm sẽ quay lại trạng thái
                      có sẵn.
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="cancel-reason">
                    Lý do hủy đơn (tùy chọn)
                  </Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Bạn có thể hủy đơn hàng mà không cần nhập lý do
                  </p>
                  <Textarea
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn hàng (không bắt buộc)..."
                    rows={3}
                    disabled={timeRemaining <= 0}
                  />
                </div>

                <Button
                  onClick={handleCancelPurchase}
                  disabled={isSubmitting || timeRemaining <= 0}
                  variant="destructive"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang hủy...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      {timeRemaining > 0
                        ? "Hủy đơn hàng"
                        : "Hết thời gian hủy đơn"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
