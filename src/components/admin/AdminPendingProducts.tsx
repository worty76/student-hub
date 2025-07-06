"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { AdminProductsDataTable } from "./AdminProductsDataTable";

export function AdminPendingProducts() {
  const { token } = useAuthStore();
  const {
    products,
    productsLoading,
    productsError,
    fetchPendingProducts,
    clearProductsError,
  } = useAdminStore();

  useEffect(() => {
    if (token) {
      fetchPendingProducts(token, { page: 1, limit: 1000 });
    }
  }, [token, fetchPendingProducts]);

  const handleRefresh = async () => {
    if (!token) return;
    await fetchPendingProducts(token, { page: 1, limit: 1000 });
  };

  if (productsError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sản phẩm chờ duyệt</h1>
          <Button onClick={handleRefresh} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {productsError}
            <Button
              onClick={clearProductsError}
              variant="link"
              className="ml-2 h-auto p-0"
            >
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const pendingCount = products.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm chờ duyệt</h1>
          <p className="text-gray-600 mt-1">
            Xem xét và phê duyệt các sản phẩm từ người dùng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={productsLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Show delete error if any */}
      {productsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {productsError}
            <Button
              onClick={clearProductsError}
              variant="link"
              className="ml-2 h-auto p-0"
            >
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-yellow-500">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sản phẩm chờ duyệt
              </p>
              <p className="text-2xl font-bold">
                {pendingCount.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm chờ duyệt</CardTitle>
          <p className="text-sm text-muted-foreground">
            Phê duyệt hoặc từ chối các sản phẩm được đăng bởi người dùng
          </p>
        </CardHeader>
        <CardContent>
          <AdminProductsDataTable data={products} isLoading={productsLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
