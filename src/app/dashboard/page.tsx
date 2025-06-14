'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      router.push('/auth/login');
    } catch {
      toast.error('Đăng xuất thất bại');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.name || user.email || 'User'}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {user.role || 'user'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.rating || 0} ({user.ratingCount || 0} reviews)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/user/profile')}
              >
                Edit Profile
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Favorites</label>
                <p className="mt-1 text-sm text-gray-900">{user.favorites?.length || 0} items</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.location || 'Not specified'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 