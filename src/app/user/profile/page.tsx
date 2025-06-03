'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { 
  ShoppingBag, 
  Package, 
  Star, 
  MapPin,
  User,
  Edit,
  Heart,
  Search,
  Plus,
} from 'lucide-react';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { ShippingPaymentSettings } from '@/components/profile/ShippingPaymentSettings';
import { ManageListings } from '@/components/profile/ManageListings';
import { ManageReviews } from '@/components/profile/ManageReviews';

type ProfileTab = 'overview' | 'orders' | 'listings' | 'reviews' | 'settings';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: MapPin }
  ];

  const stats = {
    totalOrders: 24,
    totalSales: 12,
    activeListings: 8,
    averageRating: 4.8,
    totalReviews: 156
  };

  return (
    <DashboardLayout allowedRoles={['user', 'seller']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account, orders, and listings</p>
          </div>
          <Button className="mt-4 sm:mt-0">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user?.name || 'User'}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">{user?.role} • Member since 2023</p>
              </div>
              <div className="flex space-x-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.averageRating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.activeListings}</div>
                  <div className="text-sm text-gray-600">Listings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Listing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    View Wishlist
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Update Address
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest marketplace activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Order #12345 delivered</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New review received</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Listing "Physics Books" updated</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'listings' && <ManageListings />}
          {activeTab === 'reviews' && <ManageReviews />}
          {activeTab === 'settings' && <ShippingPaymentSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
} 