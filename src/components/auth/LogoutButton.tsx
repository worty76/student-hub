'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  redirectPath?: string;
  children?: React.ReactNode;
  onMenuToggle?: () => void;
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  className = '',
  redirectPath = '/login',
  children,
  onMenuToggle
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
      // Call menu toggle if provided (for mobile menu/dropdowns)
      if (onMenuToggle) {
        onMenuToggle();
      }
      
      // Call logout function from auth store
      const result = await logout();
      
      // Show success message
      toast.success(result.message || 'Đăng xuất thành công');
      
      // Redirect to login page or specified path
      router.push(redirectPath);
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Đã xảy ra lỗi khi đăng xuất';
      
      toast.error(errorMessage);
      
      // If unauthorized (401) or authentication error, redirect to login
      if (errorMessage.includes('hết hạn') || 
          errorMessage.includes('không hợp lệ') ||
          errorMessage.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang đăng xuất...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {children || 'Đăng xuất'}
        </>
      )}
    </Button>
  );
} 