'use client';

import { useEffect } from 'react';
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsCharts() {
  const { productsStats, productsStatsLoading } = useAdminStore();

  if (productsStatsLoading || !productsStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Đang tải biểu đồ...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Phân tích trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Đang tải biểu đồ...</div>
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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Phân bố theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Sản phẩm",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân tích trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Sản phẩm",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => 
                    `${status} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Tổng sản phẩm"
            value={productsStats.totalProducts}
            icon={<Package className="w-5 h-5 text-white" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Còn hàng"
            value={productsStats.availableProducts}
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Đã bán"
            value={productsStats.soldProducts}
            icon={<ShoppingCart className="w-5 h-5 text-white" />}
            color="bg-blue-600"
          />
          <StatsCard
            title="Đang chờ"
            value={productsStats.pendingProducts}
            icon={<Clock className="w-5 h-5 text-white" />}
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