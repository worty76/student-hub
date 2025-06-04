'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'seller':
          router.push('/seller/dashboard');
          break;
        case 'user':
          router.push('/user/dashboard');
          break;
        default:
          // Fallback for unknown roles
          router.push('/auth/login');
      }
    }
  }, [user, isAuthenticated, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 