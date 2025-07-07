'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useClickOutside } from '@/hooks/useClickOutside';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { ROUTES } from '@/constants/navigation';
import { ChevronDown, User, LogOut, Heart, Package, MessageCircle, Shield } from 'lucide-react';

interface UserMenuProps {
  onMenuToggle?: () => void;
}

export function UserMenu({ onMenuToggle }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { displayUser } = useUserProfile();
  const router = useRouter();
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  if (!user) return null;

  const currentUser = displayUser || user;

  const handleMenuClose = () => {
    setIsOpen(false);
    onMenuToggle?.();
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
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          {currentUser.avatar ? (
            <Image
              src={currentUser.avatar}
              alt={currentUser.name || 'User avatar'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center ${currentUser.avatar ? 'hidden' : ''}`}>
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
        
        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-24">
            {currentUser.name || currentUser.email.split('@')[0]}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {currentUser.role === 'user' ? 'Người dùng' : currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role}
          </div>
        </div>
        
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50 animate-in slide-in-from-top-2">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              {/* Avatar in dropdown */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {currentUser.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name || 'User avatar'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center ${currentUser.avatar ? 'hidden' : ''}`}>
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{currentUser.name || currentUser.email}</div>
                <div className="text-sm text-gray-500 truncate">{currentUser.email}</div>
              </div>
            </div>
            
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2 capitalize">
              {currentUser.role === 'user' ? 'Tài khoản Người dùng' : currentUser.role === 'admin' ? 'Tài khoản Quản trị viên' : `Tài khoản ${currentUser.role}`}
            </div>
          </div>
          
          {/* Menu Items */} 
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <User className="h-4 w-4 mr-3 text-gray-500" />
            Hồ sơ cá nhân
          </Link>
          
          <Link
            href="/my-products"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <Package className="h-4 w-4 mr-3 text-gray-500" />
            Sản phẩm của tôi
          </Link>
          
          <Link
            href={ROUTES.favorites}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <Heart className="h-4 w-4 mr-3 text-gray-500" />
            Yêu thích
          </Link>
          
          <Link
            href={ROUTES.messages}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleMenuItemClick}
          >
            <MessageCircle className="h-4 w-4 mr-3 text-gray-500" />
            Tin nhắn
          </Link>
          
          {currentUser.role === 'admin' && (
            <>
              <div className="border-t my-1"></div>
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                onClick={handleMenuItemClick}
              >
                <Shield className="h-4 w-4 mr-3 text-purple-500" />
                Admin Dashboard
              </Link>
            </>
          )}
          
          <div className="border-t my-1"></div>
          
          <div className="px-2 py-1">
            <LogoutButton
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-red-600 hover:bg-red-50 px-2"
              redirectPath={ROUTES.home}
              children="Đăng xuất"
            />
          </div>
        </div>
      )}
    </div>
  );
} 