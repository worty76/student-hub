'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShoppingCart,
  RotateCcw,
} from 'lucide-react';
import { getCategoryLabel, getStatusLabel } from '@/types/product';
import { AdminProductsDataTable } from './AdminProductsDataTable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`p-2 sm:p-3 rounded-lg ${color} flex-shrink-0`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold truncate">{value.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsCharts() {
  const { productsStats, productsStatsLoading } = useAdminStore();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (productsStatsLoading || !productsStats) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-gray-500 text-sm">Đang tải biểu đồ...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Phân tích trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-gray-500 text-sm">Đang tải biểu đồ...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryChartData = productsStats.categoryBreakdown.map(item => ({
    category: getCategoryLabel(item.category),
    count: item.count
  }));

  const statusChartData = productsStats.statusBreakdown.map(item => ({
    status: getStatusLabel(item.status),
    count: item.count
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Phân bố theo danh mục</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={{
              count: {
                label: "Sản phẩm",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px] sm:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={categoryChartData}
                margin={{ 
                  top: 5, 
                  right: 10, 
                  left: 10, 
                  bottom: isMobile ? 70 : 80 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  angle={isMobile ? -90 : -45}
                  textAnchor="end"
                  height={isMobile ? 70 : 80}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 35 : 50}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-count)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Phân tích trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={{
              count: {
                label: "Sản phẩm",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] sm:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={!isMobile 
                    ? ({ status, percent }) => 
                        `${status} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    : false
                  }
                  outerRadius={isMobile ? 65 : 85}
                  innerRadius={isMobile ? 25 : 35}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="white"
                  strokeWidth={2}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminAllProducts() {
  const { token } = useAuthStore();
  const { 
    products,
    productsLoading, 
    productsError, 
    productsStats,
    deletingProductId,
    fetchAllProducts,
    clearProductsError 
  } = useAdminStore();

  useEffect(() => {
    if (token) {
      fetchAllProducts(token, { page: 1, limit: 1000 }); // Lấy nhiều sản phẩm để hiển thị local pagination
    }
  }, [token, fetchAllProducts]);

  const handleRefresh = async () => {
    if (!token) return;
    await fetchAllProducts(token, { page: 1, limit: 1000 });
  };

  if (productsError) {
    return (
      <div className="h-full max-h-[calc(100vh-200px)] overflow-y-auto space-y-6 pr-2">
        <div className="flex justify-between items-center sticky top-0 bg-background z-10 pb-4">
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
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

  return (
    <div className="space-y-6 pr-2">
      <div className="flex justify-between items-center sticky top-0 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex items-center gap-2">
          {deletingProductId && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              Đang xóa sản phẩm...
            </div>
          )}
          <Button onClick={handleRefresh} variant="outline" disabled={productsLoading}>
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

      {/* Thẻ thống kê */}
      {productsStats && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng sản phẩm"
            value={productsStats.totalProducts}
            icon={<Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Còn hàng"
            value={productsStats.availableProducts}
            icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Đã bán"
            value={productsStats.soldProducts}
            icon={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            color="bg-blue-600"
          />
          <StatsCard
            title="Đang chờ"
            value={productsStats.pendingProducts}
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            color="bg-yellow-500"
          />
        </div>
      )}

      {/* Biểu đồ */}
      <ProductsCharts />

      {/* Bảng dữ liệu sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </CardHeader>
        <CardContent>
          <AdminProductsDataTable 
            data={products} 
            isLoading={productsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 