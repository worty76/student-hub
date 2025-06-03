'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Users, Package, DollarSign, Shield, Activity, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard - {user?.name || 'Administrator'}
          </h1>
          <p className="text-gray-600">Monitor and manage the entire StudentHub platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +180 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +22 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                Uptime this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest user registrations and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">New Seller Registration</p>
                    <p className="text-sm text-gray-600">alex.johnson@email.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Approved</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">User Report</p>
                    <p className="text-sm text-gray-600">Inappropriate content flagged</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-yellow-600">Pending Review</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Bulk User Import</p>
                    <p className="text-sm text-gray-600">150 student accounts created</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Completed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important system notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-800">High Server Load</p>
                      <p className="text-sm text-yellow-700">CPU usage at 85%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">30 min ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-800">Security Update</p>
                      <p className="text-sm text-blue-700">Authentication system updated</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Backup Completed</p>
                      <p className="text-sm text-green-700">Daily database backup successful</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Statistics by Role</CardTitle>
            <CardDescription>Breakdown of user types on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">2,156</div>
                <p className="text-sm font-medium text-gray-600 mt-2">Regular Users</p>
                <p className="text-xs text-gray-500 mt-1">75.7% of total users</p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">342</div>
                <p className="text-sm font-medium text-gray-600 mt-2">Sellers</p>
                <p className="text-xs text-gray-500 mt-1">12.0% of total users</p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-purple-600">349</div>
                <p className="text-sm font-medium text-gray-600 mt-2">Inactive/Pending</p>
                <p className="text-xs text-gray-500 mt-1">12.3% of total users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 