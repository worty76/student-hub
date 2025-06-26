'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  LogIn,
  Shield,
  CheckCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import { useRouter } from 'next/navigation';

const chartConfig = {
  users: {
    label: "Người dùng",
    color: "hsl(var(--chart-1))",
  },
  products: {
    label: "Sản phẩm", 
    color: "hsl(var(--chart-2))",
  },
  sales: {
    label: "Doanh số",
    color: "hsl(var(--chart-3))",
  },
  available: {
    label: "Có sẵn",
    color: "hsl(var(--chart-4))",
  },
} as const;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AdminOverview() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { 
    dashboardStats, 
    dashboardLoading, 
    dashboardError, 
    fetchDashboardStats, 
    clearDashboardError 
  } = useAdminStore();

  useEffect(() => {
    if (token && isAuthenticated) {
      fetchDashboardStats(token);
    }
  }, [token, isAuthenticated, fetchDashboardStats]);

  const handleRefresh = () => {
    if (token) {
      clearDashboardError();
      fetchDashboardStats(token);
    }
  };

  const handleAuthError = () => {
    if (dashboardError?.includes('Bạn không có quyền truy cập') || dashboardError?.includes('Quyền truy cập bị từ chối')) {
      router.push('/auth/login');
    }
  };

  // Transform categoryStats for pie chart
  const categoryChartData = dashboardStats.categoryStats?.map(cat => ({
    category: cat._id === 'books' ? 'Sách' : 
              cat._id === 'clothing' ? 'Quần áo' :
              cat._id === 'electronics' ? 'Điện tử' :
              cat._id === 'sports' ? 'Thể thao' :
              cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
    count: cat.count,
    _id: cat._id
  })) || [];

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: dashboardStats.counts?.users?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Tổng sản phẩm',
      value: dashboardStats.counts?.products?.toLocaleString() || '0',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Sản phẩm có sẵn',
      value: dashboardStats.counts?.availableProducts?.toLocaleString() || '0',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Sản phẩm đã bán',
      value: dashboardStats.counts?.soldProducts?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Tỷ lệ bán hàng',
      value: dashboardStats.counts?.products ? 
        `${Math.round((dashboardStats.counts.soldProducts / dashboardStats.counts.products) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Danh mục sản phẩm',
      value: dashboardStats.categoryStats?.length?.toString() || '0',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  // Error state for auth issues
  if (dashboardError?.includes('Bạn không có quyền truy cập') || dashboardError?.includes('Quyền truy cập bị từ chối')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              {dashboardError?.includes('Bạn không có quyền truy cập') ? (
                <LogIn className="h-6 w-6 text-red-600" />
              ) : (
                <Shield className="h-6 w-6 text-red-600" />
              )}
            </div>
            <CardTitle className="text-red-900">Không có quyền truy cập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {dashboardError?.includes('Bạn không có quyền truy cập') 
                ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                : 'Bạn cần quyền admin để truy cập trang này.'
              }
            </p>
            <Button onClick={handleAuthError} className="w-full">
              {dashboardError?.includes('Bạn không có quyền truy cập') ? 'Đăng nhập lại' : 'Liên hệ quản trị viên'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng bạn trở lại! Đây là tình hình hoạt động của nền tảng.</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={dashboardLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Error Alert */}
      {dashboardError && !dashboardError.includes('Bạn không có quyền truy cập') && !dashboardError.includes('Quyền truy cập bị từ chối') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {dashboardError}
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2 text-red-600" 
              onClick={handleRefresh}
            >
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Categories Chart - Only show if API provides category data */}
      {categoryChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Phân bố danh mục sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sales Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê bán hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Tổng sản phẩm</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {dashboardStats.counts?.products || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Có sẵn</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {dashboardStats.counts?.availableProducts || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Đã bán</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {dashboardStats.counts?.soldProducts || 0}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Tỷ lệ bán hàng</span>
                    <span className="text-lg font-bold text-gray-900">
                      {dashboardStats.counts?.products ? 
                        `${Math.round((dashboardStats.counts.soldProducts / dashboardStats.counts.products) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: dashboardStats.counts?.products ? 
                          `${Math.round((dashboardStats.counts.soldProducts / dashboardStats.counts.products) * 100)}%` : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Data Message - Show when no API data is available */}
      {!dashboardLoading && !dashboardError && (!dashboardStats.counts?.users && !dashboardStats.counts?.products && !dashboardStats.categoryStats?.length) && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dữ liệu</h3>
            <p className="text-gray-500 mb-4">Dữ liệu thống kê sẽ xuất hiện khi hệ thống có hoạt động.</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Kiểm tra lại
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 