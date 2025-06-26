'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  RefreshCw,
  Grid3X3,
  List
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import { UserGrid } from '@/components/admin/UserGrid';
import { UserDataTable } from '@/components/admin/UserDataTable';

export function AdminUserManagement() {
  const { token, user: currentUser } = useAuthStore();
  const { users, loading, error, fetchAllUsers, clearError, setUserStatus } = useAdminStore();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchAllUsers(token);
  }, [token, currentUser, fetchAllUsers, router]);

  const handleRefresh = () => {
    if (token) {
      clearError();
      fetchAllUsers(token);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'ban' | 'promote') => {
    try {
      switch (action) {
        case 'suspend':
          setUserStatus(userId, 'suspended');
          break;
        case 'activate':
          setUserStatus(userId, 'active');
          break;
        case 'ban':
          setUserStatus(userId, 'banned');
          break;
        case 'promote':
          break;
      }
      
      console.log(`Action ${action} performed on user ${userId}`);
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">Quản lý người dùng, vai trò và trạng thái tài khoản</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 text-red-600">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Lỗi tải người dùng</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
                {error.includes('Unauthorized') && (
                  <p className="text-sm text-gray-500 mt-2">
                    Vui lòng đăng nhập lại hoặc kiểm tra quyền truy cập của bạn.
                  </p>
                )}
                {error.includes('Forbidden') && (
                  <p className="text-sm text-gray-500 mt-2">
                    Bạn cần quyền admin để truy cập tính năng này.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">Đang tải dữ liệu người dùng...</p>
          </div>
          <Button disabled variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Đang tải...
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý người dùng, vai trò và trạng thái tài khoản</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới người dùng
          </Button>
        </div>
      </div>

      {/* Users Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <UserDataTable data={users} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Người dùng ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <UserGrid users={users} onUserAction={handleUserAction} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 