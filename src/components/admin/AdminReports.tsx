'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { AdminProductReportsDataTable } from './AdminProductReportsDataTable';

export function AdminReports() {
  const { token } = useAuthStore();
  const {
    productReports,
    reportsLoading,
    reportsError,
    reportsPagination,
    currentReportsPage,
    reportsFilters,
    fetchAllProductReports,
    setReportsPage,
    setReportsFilters,
    clearReportsError
  } = useAdminStore();

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (token) {
      fetchAllProductReports(token, {
        page: currentReportsPage,
        limit: 20,
        ...reportsFilters
      });
    }
  }, [token, currentReportsPage, reportsFilters, fetchAllProductReports]);

  const handleRefresh = () => {
    if (token) {
      clearReportsError();
      fetchAllProductReports(token, {
        page: currentReportsPage,
        limit: 20,
        ...reportsFilters
      });
      setLastRefresh(new Date());
    }
  };

  const handlePageChange = (page: number) => {
    setReportsPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    const filterValue = status === 'all' ? undefined : status;
    setReportsFilters({ 
      ...reportsFilters, 
      status: filterValue as 'pending' | 'reviewed' | 'dismissed' | undefined 
    });
  };

  const handleReasonFilterChange = (reason: string) => {
    const filterValue = reason === 'all' ? undefined : reason;
    setReportsFilters({ 
      ...reportsFilters, 
      reason: filterValue 
    });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Báo cáo sản phẩm
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và xem xét các báo cáo về sản phẩm từ người dùng
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Cập nhật lần cuối: {lastRefresh.toLocaleTimeString('vi-VN')}
          </span>
          <Button
            onClick={handleRefresh}
            disabled={reportsLoading}
            size="sm"
            variant="outline"
          >
            {reportsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng báo cáo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportsPagination?.total || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {productReports.filter(report => report.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xem xét</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {productReports.filter(report => report.status === 'reviewed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã bỏ qua</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {productReports.filter(report => report.status === 'dismissed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {reportsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{reportsError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearReportsError}
              className="ml-2"
            >
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminProductReportsDataTable
            data={productReports || []}
            isLoading={reportsLoading}
            currentPage={currentReportsPage}
            totalPages={reportsPagination?.pages || 1}
            onPageChange={handlePageChange}
            onStatusFilterChange={handleStatusFilterChange}
            onReasonFilterChange={handleReasonFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
} 