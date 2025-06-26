'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    '/admin',
    '/admin/',
  ];
  
  // Check if current path starts with admin routes
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route => 
    pathname === route || pathname.startsWith('/admin/')
  );

  if (shouldHideHeaderFooter) {
    // Admin layout without header and footer - fixed sidebar with scrollable content
    return (
      <div className="h-screen bg-gray-50 overflow-hidden">
        {children}
      </div>
    );
  }

  // Regular layout with header and footer
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}