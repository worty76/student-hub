'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (user) {
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
          router.push('/dashboard');
      }
    } else {
      router.push('/auth/login');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            {user ? (
              <p>
                Your current role <span className="font-medium capitalize">({user.role})</span> doesn't have access to this resource.
              </p>
            ) : (
              <p>Please log in to access this page.</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleGoToDashboard} 
              className="w-full"
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to My Dashboard
            </Button>
            
            <Button 
              onClick={handleLogout} 
              className="w-full"
              variant="outline"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout & Login as Different User
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-6">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 