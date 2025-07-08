import React from 'react';
import { AdminMonthlyProfitStats } from './AdminMonthlyProfitStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  Users,
  Package,
  TrendingUp 
} from 'lucide-react';

/**
 * Example integration showing how to add the Monthly Profit Statistics
 * to your existing admin dashboard using tabs or as a standalone section.
 */

// Tab-based integration example
export function AdminDashboardWithTabs() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="monthly-stats" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Monthly Stats
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            {/* Add more overview cards here */}
          </div>
        </TabsContent>

        <TabsContent value="monthly-stats" className="space-y-4">
          {/* This is where our Monthly Profit Statistics component goes */}
          <AdminMonthlyProfitStats />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User management content would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Product management content would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings content would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Standalone section integration example
export function AdminDashboardWithSections() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          {/* Add more overview cards here */}
        </div>
      </section>

      {/* Monthly Profit Statistics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Monthly Profit Statistics</h2>
        <AdminMonthlyProfitStats />
      </section>

      {/* Other admin sections can be added here */}
    </div>
  );
}

// Usage instructions component
export function MonthlyStatsUsageInstructions() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>How to Use the Monthly Profit Statistics Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">1. Basic Usage</h3>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { AdminMonthlyProfitStats } from '@/components/admin/AdminMonthlyProfitStats';

export function MyAdminPage() {
  return (
    <div>
      <AdminMonthlyProfitStats />
    </div>
  );
}`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">2. Features Included</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>📅 Year selector with 10-year range (current ± 5 years)</li>
            <li>🔄 Refresh button to reload data</li>
            <li>📊 Interactive charts (line/bar toggle)</li>
            <li>📈 Summary metrics cards</li>
            <li>📋 Detailed monthly breakdown table</li>
            <li>📱 Fully responsive design</li>
            <li>🛡️ Auth and admin role protection</li>
            <li>⚡ Loading and error states</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">3. API Endpoint Used</h3>
          <pre className="bg-muted p-4 rounded-lg text-sm">
{`GET /api/admin/profits/monthly?year=2024
Authorization: Bearer <admin-token>`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">4. State Management</h3>
          <p className="text-sm text-muted-foreground">
            Uses Zustand stores for auth and monthly statistics data management.
            The component automatically handles authentication and admin role verification.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">5. Responsive Design</h3>
          <p className="text-sm text-muted-foreground">
            Built with container queries and responsive utilities. 
            Charts automatically adapt to screen size with optimized layouts for mobile, tablet, and desktop.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 