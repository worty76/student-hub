'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quyền truy cập bị từ chối</h1>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
} 