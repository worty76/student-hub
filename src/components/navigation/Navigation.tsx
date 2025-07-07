'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, User, LogOut, Settings, ShoppingBag, Plus, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function Navigation() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', icon: Home, label: 'Dashboard' },
    ];

    switch (user.role) {
      case 'user':
        return [
          ...baseItems,
          { href: '/profile', icon: User, label: 'Profile' },
          { href: '/orders', icon: ShoppingBag, label: 'My Orders' },
        ];
      
      case 'seller':
        return [
          ...baseItems,
          { href: '/seller/listings', icon: ShoppingBag, label: 'My Listings' },
          { href: '/seller/add-product', icon: Plus, label: 'Add Product' },
          { href: '/seller/orders', icon: BarChart3, label: 'Sales' },
          { href: '/profile', icon: User, label: 'Profile' },
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { href: '/admin/users', icon: Users, label: 'User Management' },
          { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
          { href: '/admin/settings', icon: Settings, label: 'Settings' },
          { href: '/profile', icon: User, label: 'Profile' },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                StudentHub
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            <LogoutButton
              variant="outline"
              size="sm"
              className="flex items-center"
              redirectPath="/"
            >
              Logout
            </LogoutButton>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1 border-t">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 