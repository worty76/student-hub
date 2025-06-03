'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Package, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout allowedRoles={['seller']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Dashboard - {user?.name || 'Seller'}
          </h1>
          <p className="text-gray-600">Manage your store and track your sales performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,847</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +23 new this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders for your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Computer Science Textbook</p>
                    <p className="text-sm text-gray-600">Ordered by: john@student.edu</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$125.00</p>
                    <p className="text-sm text-green-600">Paid</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Lab Equipment Set</p>
                    <p className="text-sm text-gray-600">Ordered by: sarah@student.edu</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$89.50</p>
                    <p className="text-sm text-yellow-600">Processing</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Study Notes Bundle</p>
                    <p className="text-sm text-gray-600">Ordered by: mike@student.edu</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$19.99</p>
                    <p className="text-sm text-blue-600">Shipped</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Advanced Mathematics Guide</p>
                    <p className="text-sm text-gray-600">32 sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,280</p>
                    <p className="text-sm text-green-600">+15% sales</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Chemistry Lab Manual</p>
                    <p className="text-sm text-gray-600">28 sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$840</p>
                    <p className="text-sm text-green-600">+8% sales</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Programming Essentials</p>
                    <p className="text-sm text-gray-600">21 sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$630</p>
                    <p className="text-sm text-red-600">-3% sales</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 