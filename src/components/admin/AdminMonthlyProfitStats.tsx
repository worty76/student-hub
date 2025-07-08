'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useMonthlyStatsStore, MonthlyStatistic } from '@/store/monthlyStatsStore';
import { useResponsiveChart, formatChartValue } from '@/hooks/useResponsiveChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  CreditCard,
  Users,
  Calendar,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';

// Month names for display
const MONTH_NAMES = [
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
  'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
];

// Generate year options (current year ± 5 years)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 2; i >= currentYear - 8; i--) {
    years.push(i);
  }
  return years;
};

// Chart type toggle
type ChartType = 'line' | 'bar';

// Summary metrics component
function SummaryMetrics({ data }: { data: MonthlyStatistic[] }) {
  const totalRevenue = data.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = data.reduce((sum, month) => sum + month.transactions, 0);
  const averageMonthlyRevenue = totalRevenue / 12;

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 @xl:grid-cols-4">
      <Card className="@container">
        <CardContent className="p-3 @sm:p-4 @md:p-6">
          <div className="flex items-center space-x-2 @sm:space-x-3">
            <div className="p-2 @sm:p-3 rounded-lg bg-blue-100 flex-shrink-0">
              <DollarSign className="w-4 h-4 @sm:w-5 @sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs @sm:text-sm font-medium text-muted-foreground truncate">
                Tổng doanh thu
              </p>
              <p className="text-sm @sm:text-lg @md:text-xl font-bold truncate">
                {formatChartValue(totalRevenue, 'currency')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="@container">
        <CardContent className="p-3 @sm:p-4 @md:p-6">
          <div className="flex items-center space-x-2 @sm:space-x-3">
            <div className="p-2 @sm:p-3 rounded-lg bg-purple-100 flex-shrink-0">
              <Users className="w-4 h-4 @sm:w-5 @sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs @sm:text-sm font-medium text-muted-foreground truncate">
                Giao dịch
              </p>
              <p className="text-sm @sm:text-lg @md:text-xl font-bold truncate">
                {formatChartValue(totalTransactions, 'number')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="@container">
        <CardContent className="p-3 @sm:p-4 @md:p-6">
          <div className="flex items-center space-x-2 @sm:space-x-3">
            <div className="p-2 @sm:p-3 rounded-lg bg-orange-100 flex-shrink-0">
              <CreditCard className="w-4 h-4 @sm:w-5 @sm:h-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs @sm:text-sm font-medium text-muted-foreground truncate">
                Doanh thu trung bình tháng
              </p>
              <p className="text-sm @sm:text-lg @md:text-xl font-bold truncate">
                {formatChartValue(averageMonthlyRevenue, 'currency')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Monthly data table component
function MonthlyDataTable({ data }: { data: MonthlyStatistic[] }) {
  return (
    <Card className="@container">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm @sm:text-base @lg:text-lg">
          Thống kê lợi nhuận theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 @sm:p-4 @md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 @sm:p-3 text-xs @sm:text-sm font-medium text-muted-foreground">
                  Tháng
                </th>
                <th className="text-right p-2 @sm:p-3 text-xs @sm:text-sm font-medium text-muted-foreground">
                  Doanh thu
                </th>
                <th className="text-right p-2 @sm:p-3 text-xs @sm:text-sm font-medium text-muted-foreground">
                  Giao dịch
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((monthData) => (
                <tr key={monthData.month} className="border-b hover:bg-muted/50">
                  <td className="p-2 @sm:p-3 text-xs @sm:text-sm font-medium">
                    {MONTH_NAMES[monthData.month - 1]}
                  </td>
                  <td className="text-right p-2 @sm:p-3 text-xs @sm:text-sm">
                    {formatChartValue(monthData.revenue, 'currency')}
                  </td>
                  <td className="text-right p-2 @sm:p-3 text-xs @sm:text-sm">
                    {formatChartValue(monthData.transactions, 'number')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Chart component
function MonthlyProfitChart({ 
  data, 
  chartType,
  onChartTypeChange 
}: { 
  data: MonthlyStatistic[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}) {
  const chartConfig = useResponsiveChart({ baseHeight: 350 });

  // Prepare chart data with month names
  const chartData = data.map(item => ({
    ...item,
    monthName: MONTH_NAMES[item.month - 1],
  }));

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;

  return (
    <Card className="@container">
      <CardHeader className="pb-3">
        <div className="flex flex-col @sm:flex-row items-start @sm:items-center justify-between gap-3">
          <CardTitle className="text-sm @sm:text-base @lg:text-lg">
            Biểu đồ doanh thu theo tháng
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChartTypeChange('line')}
              className="text-xs @sm:text-sm"
            >
              <LineChartIcon className="w-3 h-3 @sm:w-4 @sm:h-4 mr-1" />
              Biểu đồ đường
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChartTypeChange('bar')}
              className="text-xs @sm:text-sm"
            >
              <BarChart3 className="w-3 h-3 @sm:w-4 @sm:h-4 mr-1" />
              Biểu đồ cột
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 @sm:p-4 @md:p-6">
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            profit: {
              label: "Profit",
              color: "hsl(var(--chart-2))",
            },
          }}
          className={`h-[${chartConfig.chartHeight}px] w-full`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData} margin={chartConfig.margins}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={chartConfig.gridStroke}
                vertical={chartConfig.showVerticalGrid}
              />
              <XAxis 
                dataKey="monthName" 
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
                  formatChartValue(Number(value), 'currency'),
                  name === 'revenue' ? 'Revenue' : 'Profit'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: chartConfig.fontSize.tooltip,
                  padding: chartConfig.isSmall ? '6px' : '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              
              {chartType === 'line' ? (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={chartConfig.strokeWidth}
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
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="var(--color-profit)" 
                    strokeWidth={chartConfig.strokeWidth}
                    dot={{ 
                      fill: 'var(--color-profit)', 
                      strokeWidth: 2, 
                      r: chartConfig.dotRadius 
                    }}
                    activeDot={{ 
                      r: chartConfig.activeDotRadius, 
                      stroke: 'var(--color-profit)', 
                      strokeWidth: 2,
                      fill: 'white'
                    }}
                  />
                </>
              ) : (
                <>
                  <Bar 
                    dataKey="revenue" 
                    fill="var(--color-revenue)" 
                    radius={[chartConfig.barRadius, chartConfig.barRadius, 0, 0]}
                    maxBarSize={chartConfig.maxBarSize / 2}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="var(--color-profit)" 
                    radius={[chartConfig.barRadius, chartConfig.barRadius, 0, 0]}
                    maxBarSize={chartConfig.maxBarSize / 2}
                  />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Main component
export function AdminMonthlyProfitStats() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { 
    monthlyStats, 
    selectedYear, 
    isLoading, 
    error, 
    setSelectedYear, 
    fetchMonthlyStats, 
    clearError 
  } = useMonthlyStatsStore();

  const [chartType, setChartType] = useState<ChartType>('line');
  const yearOptions = generateYearOptions();

  // Initial data fetch
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/auth/login');
      return;
    }

    fetchMonthlyStats(token).catch((error) => {
      console.error('Failed to fetch monthly statistics:', error);
    });
  }, [isAuthenticated, token, fetchMonthlyStats, router]);

  // Handle year change
  const handleYearChange = async (year: string) => {
    const yearNumber = parseInt(year);
    setSelectedYear(yearNumber);
    
    if (token) {
      try {
        await fetchMonthlyStats(token, yearNumber);
      } catch (error) {
        console.error('Failed to fetch data for year:', yearNumber, error);
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (token) {
      try {
        await fetchMonthlyStats(token, selectedYear);
      } catch (error) {
        console.error('Failed to refresh monthly statistics:', error);
      }
    }
  };

  // Handle auth errors
  if (error === 'Not authenticated') {
    router.push('/auth/login');
    return null;
  }

  if (error === 'Not authorized as admin') {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Thống kê lợi nhuận theo tháng</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Bạn không có quyền admin để xem trang này.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 @container">
      {/* Header */}
      <div className="flex flex-col @sm:flex-row justify-between items-start @sm:items-center gap-3 @sm:gap-4">
        <h1 className="text-lg @sm:text-xl @lg:text-2xl @xl:text-3xl font-bold">
          Thống kê lợi nhuận theo tháng
        </h1>
        <div className="flex flex-col @sm:flex-row items-start @sm:items-center gap-2 @sm:gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32 text-xs @sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
            className="text-xs @sm:text-sm"
          >
            <RefreshCw className={`w-3 h-3 @sm:w-4 @sm:h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && error !== 'Not authenticated' && error !== 'Not authorized as admin' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs @sm:text-sm">
            {error}
            <Button 
              onClick={clearError} 
              variant="link" 
              className="ml-2 h-auto p-0 text-xs @sm:text-sm"
            >
              Bỏ qua
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-3 @sm:gap-4 grid-cols-2 @xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

      {/* Main Content */}
      {!isLoading && monthlyStats.length > 0 && (
        <>
          {/* Summary Metrics */}
          <SummaryMetrics data={monthlyStats} />

          {/* Chart */}
          <MonthlyProfitChart 
            data={monthlyStats} 
            chartType={chartType}
            onChartTypeChange={setChartType}
          />

          {/* Monthly Data Table */}
          <MonthlyDataTable data={monthlyStats} />
        </>
      )}

      {/* No Data State */}
      {!isLoading && !error && monthlyStats.length === 0 && (
        <Card className="@container">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 text-xs @sm:text-sm">
              Không có dữ liệu thống kê lợi nhuận cho năm {selectedYear}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 