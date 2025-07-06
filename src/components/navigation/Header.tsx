'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
// import { SearchBar } from './SearchBar';
// import { MobileMenu } from './MobileMenu';
import { APP_CONFIG, ROUTES, NAVIGATION_LINKS } from '@/constants/navigation';
import { ShoppingBag } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navLinks = NAVIGATION_LINKS.map(link => ({
    ...link,
    active: pathname.startsWith(link.href)
  }));

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

          {/* <SearchBar placeholder={APP_CONFIG.search.placeholder} /> */}

          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-3">
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

            {/* Mobile Menu */}
            {/* <MobileMenu navLinks={navLinks} /> */}
          </div>
        </div>
      </div>
    </header>
  );
} 