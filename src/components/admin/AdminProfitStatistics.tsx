'use client';

import React, { useEffect, useState } from 'react';
import { useResponsiveChart, formatChartValue } from '@/hooks/useResponsiveChart';
import { useAuthStore } from '@/store/authStore';
import { useProfitStore } from '@/store/profitStore';
import { AdminMonthlyProfitStats } from './AdminMonthlyProfitStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Utility functions for date formatting
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatMonthYear = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  return `${month}/${year}`;
};



interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <Card className="@container">
      <CardContent className="p-3 @sm:p-4 @md:p-6">
        <div className="flex items-center space-x-2 @sm:space-x-3 @md:space-x-4">
          <div className={`p-1.5 @sm:p-2 @md:p-3 rounded-lg ${color} flex-shrink-0`}>
            <div className="w-4 h-4 @sm:w-5 @sm:h-5 text-white">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs @sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-sm @sm:text-lg @md:text-2xl font-bold truncate">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyRevenueChart() {
  const { statistics } = useProfitStore();
  const chartConfig = useResponsiveChart({ baseHeight: 300 });

  if (!statistics?.monthlyProfits?.length) {
    return (
      <Card className="@container">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm @sm:text-base @lg:text-lg">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-[${chartConfig.chartHeight}px] flex items-center justify-center`}>
            <p className="text-gray-500 text-xs @sm:text-sm">Không có dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = statistics.monthlyProfits.map(item => ({
    month: formatMonthYear(item.month),
    revenue: item.revenue,
    transactions: item.transactions,
    profit: item.profit,
  }));

  return (
    <Card className="@container">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm @sm:text-base @lg:text-lg">Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent className="p-2 @sm:p-3 @md:p-6">
        <ChartContainer
          config={{
            revenue: {
              label: "Doanh thu",
              color: "hsl(var(--chart-1))",
            },
            transactions: {
              label: "Giao dịch",
              color: "hsl(var(--chart-2))",
            },
          }}
          className={`h-[${chartConfig.chartHeight}px] w-full`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={chartConfig.margins}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={chartConfig.gridStroke}
                vertical={!chartConfig.isXSmall}
              />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: chartConfig.fontSize.tick }}
                tickLine={{ stroke: chartConfig.axisStroke }}
                axisLine={{ stroke: chartConfig.axisStroke }}
                angle={chartConfig.tickAngle}
                textAnchor={chartConfig.textAnchor}
                height={chartConfig.xAxisHeight}
                interval={chartConfig.tickInterval}
                minTickGap={chartConfig.minTickGap}
              />
              <YAxis 
                tick={{ fontSize: chartConfig.fontSize.tick }}
                tickLine={{ stroke: chartConfig.axisStroke }}
                axisLine={{ stroke: chartConfig.axisStroke }}
                width={chartConfig.yAxisWidth}
                tickFormatter={(value) => formatChartValue(value, 'number', chartConfig.isMedium)}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name === 'revenue' ? formatChartValue(Number(value), 'currency') : value,
                  name === 'revenue' ? 'Doanh thu' : 'Giao dịch'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: chartConfig.fontSize.tooltip,
                  padding: chartConfig.isSmall ? '6px' : '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={chartConfig.strokeWidth}
                name="Doanh thu"
                dot={{ 
                  fill: 'var(--color-revenue)', 
                  strokeWidth: 2, 
                  r: chartConfig.dotRadius 
                }}
                activeDot={{ 
                  r: chartConfig.activeDotRadius, 
                  stroke: 'var(--color-revenue)', 
                  strokeWidth: 2,
                  fill: 'white'
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function PaymentMethodRevenueChart() {
  const { statistics } = useProfitStore();
  const chartConfig = useResponsiveChart({ baseHeight: 300 });

  if (!statistics?.profitsByPaymentMethod) {
    return (
      <Card className="@container">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm @sm:text-base @lg:text-lg">Doanh thu theo phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-[${chartConfig.chartHeight}px] flex items-center justify-center`}>
            <p className="text-gray-500 text-xs @sm:text-sm">Không có dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(statistics.profitsByPaymentMethod).map(([method, data]) => ({
    method: method.toUpperCase(),
    revenue: data.revenue,
    transactions: data.transactions,
    profit: data.profit,
  }));

  return (
    <Card className="@container">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm @sm:text-base @lg:text-lg">Doanh thu theo phương thức thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="p-2 @sm:p-3 @md:p-6">
        <ChartContainer
          config={{
            revenue: {
              label: "Doanh thu",
              color: "hsl(var(--chart-1))",
            },
          }}
          className={`h-[${chartConfig.chartHeight}px] w-full`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={chartConfig.margins}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={chartConfig.gridStroke}
                vertical={!chartConfig.isXSmall}
              />
              <XAxis 
                dataKey="method" 
                tick={{ fontSize: chartConfig.fontSize.tick }}
                tickLine={{ stroke: chartConfig.axisStroke }}
                axisLine={{ stroke: chartConfig.axisStroke }}
                angle={chartConfig.tickAngle}
                textAnchor={chartConfig.textAnchor}
                height={chartConfig.xAxisHeight}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: chartConfig.fontSize.tick }}
                tickLine={{ stroke: chartConfig.axisStroke }}
                axisLine={{ stroke: chartConfig.axisStroke }}
                width={chartConfig.yAxisWidth}
                tickFormatter={(value) => formatChartValue(value, 'number', chartConfig.isMedium)}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [
                  formatChartValue(Number(value), 'currency'),
                  'Doanh thu'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: chartConfig.fontSize.tooltip,
                  padding: chartConfig.isSmall ? '6px' : '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-revenue)" 
                radius={[chartConfig.barRadius, chartConfig.barRadius, 0, 0]}
                stroke="var(--color-revenue)"
                strokeWidth={0}
                maxBarSize={chartConfig.maxBarSize}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AdminProfitStatistics() {
  const { token } = useAuthStore();
  const { 
    statistics, 
    loading, 
    error, 
    startDate, 
    endDate,
    fetchProfitStatistics, 
    setDateFilter, 
    clearError 
  } = useProfitStore();

  const [displayStartDate, setDisplayStartDate] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState('');

  useEffect(() => {
    if (token) {
      fetchProfitStatistics(token);
    }
  }, [token, fetchProfitStatistics]);

  // Update display dates when store dates change
  useEffect(() => {
    setDisplayStartDate(startDate ? formatDateForDisplay(startDate) : '');
    setDisplayEndDate(endDate ? formatDateForDisplay(endDate) : '');
  }, [startDate, endDate]);

  const handleDateFilter = () => {
    if (!token) return;
    
    const apiStartDate = displayStartDate ? formatDateForAPI(displayStartDate) : undefined;
    const apiEndDate = displayEndDate ? formatDateForAPI(displayEndDate) : undefined;
    
    setDateFilter(apiStartDate || null, apiEndDate || null);
    fetchProfitStatistics(token, apiStartDate, apiEndDate);
  };

  const handleRefresh = () => {
    if (!token) return;
    
    const apiStartDate = startDate || undefined;
    const apiEndDate = endDate || undefined;
    
    fetchProfitStatistics(token, apiStartDate, apiEndDate);
  };

  const handleClearDates = () => {
    setDisplayStartDate('');
    setDisplayEndDate('');
    if (token) {
      setDateFilter(null, null);
      fetchProfitStatistics(token);
    }
  };

  if (error && (error === 'Not authenticated' || error === 'Not authorized as admin')) {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Thống kê lợi nhuận</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error === 'Not authenticated' ? 'Chưa xác thực' : 'Không có quyền truy cập quản trị'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 @container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">Thống kê lợi nhuận</h1>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={loading}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Date Filter Section */}
      <Card className="@container">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm @sm:text-base @lg:text-lg">
            <Calendar className="w-4 h-4 @sm:w-5 @sm:h-5" />
            Bộ lọc thời gian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 @sm:p-4 @md:p-6">
          <div className="flex flex-col gap-4">
            {/* Date Inputs Row */}
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-3 @sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs @sm:text-sm">Từ ngày (DD-MM-YYYY)</Label>
                <Input
                  id="startDate"
                  type="text"
                  placeholder="01-01-2024"
                  value={displayStartDate}
                  onChange={(e) => setDisplayStartDate(e.target.value)}
                  pattern="\d{2}-\d{2}-\d{4}"
                  className="text-xs @sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs @sm:text-sm">Đến ngày (DD-MM-YYYY)</Label>
                <Input
                  id="endDate"
                  type="text"
                  placeholder="31-12-2024"
                  value={displayEndDate}
                  onChange={(e) => setDisplayEndDate(e.target.value)}
                  pattern="\d{2}-\d{2}-\d{4}"
                  className="text-xs @sm:text-sm"
                />
              </div>
            </div>
            {/* Buttons Row */}
            <div className="flex flex-col @sm:flex-row gap-2 @sm:gap-3">
              <Button 
                onClick={handleDateFilter} 
                disabled={loading}
                className="flex-1 @sm:flex-none text-xs @sm:text-sm"
                size="sm"
              >
                Áp dụng bộ lọc
              </Button>
              <Button 
                onClick={handleClearDates} 
                variant="outline" 
                disabled={loading}
                className="flex-1 @sm:flex-none text-xs @sm:text-sm"
                size="sm"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && error !== 'Not authenticated' && error !== 'Not authorized as admin' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs sm:text-sm">
            {error}
            <Button 
              onClick={clearError} 
              variant="link" 
              className="ml-2 h-auto p-0 text-xs sm:text-sm"
            >
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="@container">
              <CardContent className="p-3 @sm:p-4 @md:p-6">
                <div className="animate-pulse">
                  <div className="h-3 @sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 @sm:h-6 @md:h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Metric Cards */}
      {statistics && !loading && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3">
          <MetricCard
            title="Tổng giao dịch"
            value={statistics.totalTransactions.toLocaleString('vi-VN')}
            icon={<Users className="w-full h-full" />}
            color="bg-blue-500"
          />
          <MetricCard
            title="Tổng doanh thu"
            value={formatCurrency(statistics.totalRevenue)}
            icon={<TrendingUp className="w-full h-full" />}
            color="bg-purple-500"
          />
          <MetricCard
            title="Tỷ lệ hoa hồng trung bình"
            value={`${(statistics.averageCommissionRate * 100).toFixed(2)}%`}
            icon={<CreditCard className="w-full h-full" />}
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Charts */}
      {statistics && !loading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 @4xl:grid-cols-2">
          <MonthlyRevenueChart />
          <PaymentMethodRevenueChart />
        </div>
      )}

      {/* Monthly Profit Statistics */}
      <Card>
        <AdminMonthlyProfitStats />
      </Card>
      

      {/* No Data State */}
      {!statistics && !loading && !error && (
        <Card className="@container">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 text-xs @sm:text-sm">Không có dữ liệu thống kê</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 