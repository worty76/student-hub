'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  monthlyRevenue: number;
  pendingReports: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'product_listed' | 'sale_completed' | 'report_filed';
  description: string;
  timestamp: string;
}

export function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    pendingReports: 0,
    activeUsers: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalProducts: 892,
          totalSales: 345,
          monthlyRevenue: 25430,
          pendingReports: 12,
          activeUsers: 189,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'user_registration',
            description: 'New user registered: john.doe@student.edu',
            timestamp: '2 minutes ago'
          },
          {
            id: '2',
            type: 'product_listed',
            description: 'New product listed: MacBook Pro 2020',
            timestamp: '15 minutes ago'
          },
          {
            id: '3',
            type: 'sale_completed',
            description: 'Sale completed: Calculus Textbook - $45',
            timestamp: '1 hour ago'
          },
          {
            id: '4',
            type: 'report_filed',
            description: 'User report filed for suspicious activity',
            timestamp: '2 hours ago'
          },
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'product_listed':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'sale_completed':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'report_filed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getActivityBadgeColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-100 text-blue-800';
      case 'product_listed':
        return 'bg-green-100 text-green-800';
      case 'sale_completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'report_filed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening in your marketplace.</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <Badge 
                  className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                  variant="secondary"
                >
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 