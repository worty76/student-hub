'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { NAVIGATION_LINKS, APP_CONFIG, ROUTES } from '@/constants/navigation';
import { ShoppingBag, Plus } from 'lucide-react';

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
    <header className="bg-white shadow-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:scale-105 ${
                  link.active
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <SearchBar placeholder={APP_CONFIG.search.placeholder} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sell Button */}
            {isAuthenticated && (
              <Link href={ROUTES.sell}>
                <Button size="sm" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Sell Item
                </Button>
              </Link>
            )}

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href={ROUTES.login}>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href={ROUTES.register}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileMenu navLinks={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
} 