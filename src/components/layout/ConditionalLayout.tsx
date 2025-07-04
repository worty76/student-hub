'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { StickyAdBanner } from '@/components/ui/StickyAdBanner';

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
  
  // Define routes where only footer should be hidden
  const hideFooterOnlyRoutes = [
    '/messages',
    '/messages/',
  ];
  
  // Check if current path starts with admin routes
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route => 
    pathname === route || pathname.startsWith('/admin/')
  );

  // Check if current path is messages route
  const shouldHideFooterOnly = hideFooterOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith('/messages')
  );

  if (shouldHideHeaderFooter) {
    // Full screen layout without header and footer
    return (
      <div className="h-screen bg-background overflow-hidden">
        {children}
      </div>
    );
  }

  if (shouldHideFooterOnly) {
    // Layout with header but without footer (for messages page)
    return (
      <>
        <Header />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <StickyAdBanner />
      </>
    );
  }

  // Regular layout with header and footer
  return (
    <>
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <Footer />
      <StickyAdBanner />
    </>
  );
}