'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ROUTES } from '@/constants/navigation';
import {
  User,
  LogOut,
  Settings,
  Heart,
  MessageCircle,
  ChevronDown
} from 'lucide-react';

interface UserMenuProps {
  onMenuToggle?: () => void;
}

export function UserMenu({ onMenuToggle }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      onMenuToggle?.();
      router.push(ROUTES.home);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'seller': return '/seller/dashboard';
      case 'user': return '/user/dashboard';
      default: return '/dashboard';
    }
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
    onMenuToggle?.();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-24">
            {user.name || user.email.split('@')[0]}
          </div>
          <div className="text-xs text-gray-500 capitalize">{user.role}</div>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50 animate-in slide-in-from-top-2">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
            <div className="font-medium text-gray-900 truncate">{user.name || user.email}</div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2 capitalize">
              {user.role} Account
            </div>
          </div>
          
          {/* Menu Items */}
          <Link
            href={getDashboardLink()}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <User className="h-4 w-4 mr-3 text-gray-500" />
            Dashboard
          </Link>
          
          <Link
            href={ROUTES.profile}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            Profile Settings
          </Link>
          
          <Link
            href={ROUTES.favorites}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <Heart className="h-4 w-4 mr-3 text-gray-500" />
            Favorites
          </Link>
          
          <Link
            href={ROUTES.messages}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <MessageCircle className="h-4 w-4 mr-3 text-gray-500" />
            Messages
          </Link>
          
          <div className="border-t my-1"></div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 