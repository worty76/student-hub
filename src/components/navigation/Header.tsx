'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenu } from './UserMenu';
import { APP_CONFIG, ROUTES, NAVIGATION_LINKS } from '@/constants/navigation';
import { ShoppingBag, Menu, User, Heart, Package, MessageCircle, Shield, History } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navLinks = NAVIGATION_LINKS.map(link => ({
    ...link,
    active: pathname.startsWith(link.href)
  }));

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Define user menu items for mobile
  const userMenuItems = [
    { href: '/profile', label: 'Hồ sơ cá nhân', icon: User },
    { href: '/my-products', label: 'Sản phẩm của tôi', icon: Package },
    { href: '/purchase-history', label: 'Lịch sử mua hàng', icon: History },
    { href: ROUTES.favorites, label: 'Yêu thích', icon: Heart },
    { href: ROUTES.messages, label: 'Tin nhắn', icon: MessageCircle },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">{APP_CONFIG.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  link.active
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href={ROUTES.login}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href={ROUTES.register}>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Navigation */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* User Menu Button for Authenticated Users on Mobile */}
            {isAuthenticated && user && (
              <div className="sm:hidden">
                <UserMenu onMenuToggle={handleMobileMenuClose} />
              </div>
            )}

            {/* Mobile Menu Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 h-10 w-10"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="border-b pb-4 mb-6">
                  <SheetTitle className="text-left text-lg font-semibold text-gray-900">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-6">
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Điều hướng
                    </h3>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          link.active
                            ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={handleMobileMenuClose}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* User Section */}
                  {isAuthenticated && user ? (
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Tài khoản
                      </h3>
                      
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name || 'User avatar'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {user.name || user.email.split('@')[0]}
                          </div>
                          <div className="text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>

                      {/* User Menu Items */}
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            onClick={handleMobileMenuClose}
                          >
                            <Icon className="h-5 w-5 mr-3 text-gray-500" />
                            {item.label}
                          </Link>
                        );
                      })}

                      {/* Admin Link */}
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2 rounded-lg text-purple-700 hover:text-purple-900 hover:bg-purple-50 transition-colors"
                          onClick={handleMobileMenuClose}
                        >
                          <Shield className="h-5 w-5 mr-3 text-purple-500" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                  ) : (
                    /* Auth Buttons for Non-Authenticated Users */
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Tài khoản
                      </h3>
                      <Link href={ROUTES.login} onClick={handleMobileMenuClose}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-center border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link href={ROUTES.register} onClick={handleMobileMenuClose}>
                        <Button 
                          className="w-full justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          Đăng ký
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 