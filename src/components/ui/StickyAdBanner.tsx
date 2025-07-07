'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShoppingBag, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StickyAd {
  id: string;
  title: string;
  description: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  ctaText: string;
  ctaLink: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
}

const stickyAds: StickyAd[] = [
  {
    id: '1',
    title: 'Khuyến Mãi - Giảm Giá 50% Tất Cả!',
    description: 'Ưu đãi có thời hạn cho tất cả nhu yếu phẩm sinh viên',
    backgroundColor: 'bg-gradient-to-r from-red-500 to-pink-600',
    textColor: 'text-white',
    ctaText: 'Mua Ngay',
    ctaLink: '/products',
    isExternal: false,
    icon: <ShoppingBag className="h-5 w-5" />
  },
  {
    id: '2',
    title: 'Bộ Sưu Tập Laptop Mới Có Sẵn',
    description: 'Laptop tân trang chất lượng cao dành cho sinh viên',
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-700',
    textColor: 'text-white',
    ctaText: 'Xem Bộ Sưu Tập',
    ctaLink: '/products',
    isExternal: false,
    icon: <Megaphone className="h-5 w-5" />
  },
  {
    id: '3',
    title: 'Tham Gia Cộng Đồng Của Chúng Tôi',
    description: 'Nhận thông báo tức thì về danh sách mới',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    textColor: 'text-white',
    ctaText: 'Tham Gia Ngay',
    ctaLink: '/auth/login',
    isExternal: true,
    icon: <ExternalLink className="h-5 w-5" />
  }
];

export function StickyAdBanner() {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const pathname = usePathname();
  
  // Only show on home page
  const isHomePage = pathname === '/' || pathname === '/page';
  
  useEffect(() => {
    const dismissed = localStorage.getItem('stickyAdDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const now = Date.now();
    
    if (now - dismissedTime > 24 * 60 * 60 * 1000) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !isVisible || isMinimized) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % stickyAds.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, isMinimized]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('stickyAdDismissed', Date.now().toString());
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleAdClick = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Tiếp tục sau 10 giây
  };

  if (!isHomePage || !isVisible || stickyAds.length === 0) return null;

  const ad = stickyAds[currentAd];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-2xl w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-5xl rounded-xl overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        <div className={`${ad.backgroundColor} relative overflow-hidden rounded-xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2220%22 height=%2220%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 20 0 L 0 0 0 20%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grid)%22/%3E%3C/svg%3E')]" />
          </div>

          <motion.div
            animate={{ height: isMinimized ? 'auto' : 'auto' }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {!isMinimized ? (
              // Full Banner
              <div className="px-4 py-4 md:px-8 md:py-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Icon */}
                    <motion.div
                      key={`${ad.id}-icon`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`p-3 rounded-full bg-white/20 ${ad.textColor} flex-shrink-0`}
                    >
                      {ad.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <motion.h3
                        key={`${ad.id}-title`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className={`font-bold text-base md:text-lg ${ad.textColor} truncate`}
                      >
                        {ad.title}
                      </motion.h3>
                      <motion.p
                        key={`${ad.id}-desc`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className={`text-sm md:text-base ${ad.textColor.replace('text-', 'text-').replace('-', '-200')} truncate text-white`}
                      >
                        {ad.description}
                      </motion.p>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      key={`${ad.id}-cta`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex-shrink-0"
                    >
                      {ad.isExternal ? (
                        <a
                          href={ad.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleAdClick}
                          className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 md:px-5 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          {ad.ctaText}
                          <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                        </a>
                      ) : (
                        <Link href={ad.ctaLink}>
                          <button
                            onClick={handleAdClick}
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 md:px-5 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            {ad.ctaText}
                          </button>
                        </Link>
                      )}
                    </motion.div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-3 ml-5">
                    {/* Progress Indicators */}
                    <div className="hidden md:flex space-x-1.5">
                      {stickyAds.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentAd(index);
                            setIsAutoPlaying(false);
                            setTimeout(() => setIsAutoPlaying(true), 10000);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentAd 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Đến quảng cáo ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Minimize Button */}
                    {/* <button
                      onClick={handleMinimize}
                      className={`p-2 rounded-full ${ad.textColor.replace('text-', 'text-').replace('-', '-300')} hover:bg-white/20 transition-all duration-300`}
                      aria-label="Minimize banner"
                    >
                      <motion.div
                        animate={{ rotate: isMinimized ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </button> */}

                    {/* Close Button */}
                    {/* <button
                      onClick={handleClose}
                      className={`p-2.5 rounded-full bg-white/30 ${ad.textColor} hover:bg-white/40 transition-all duration-300 shadow-md hover:shadow-lg`}
                      aria-label="Đóng quảng cáo"
                    >
                      <X className="w-5 h-5" />
                    </button> */}
                  </div>
                </div>
              </div>
            ) : (
              // Minimized Banner
              <div className="px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full bg-white/20 ${ad.textColor}`}>
                      {ad.icon}
                    </div>
                    <span className={`text-sm font-medium ${ad.textColor} truncate`}>
                      {ad.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleMinimize}
                      className={`p-1.5 rounded-full ${ad.textColor.replace('text-', 'text-').replace('-', '-300')} hover:bg-white/20 transition-all duration-300`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={handleClose}
                      className={`p-2 rounded-full bg-white/30 ${ad.textColor} hover:bg-white/40 transition-all duration-300 shadow-md`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div 
              key={`progress-${currentAd}`}
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: isAutoPlaying && !isMinimized ? 5 : 0,
                ease: "linear"
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 