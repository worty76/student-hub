'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Smartphone, Coffee, Gamepad2, Music, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
    title: 'iPhone 15 Pro - Titan. Mạnh Mẽ. Nhẹ Nhàng.',
    description: 'Khám phá iPhone tiên tiến nhất với thiết kế titan và chip A17 Pro',
    image: 'https://www.apple.com/v/iphone/home/cc/images/overview/select/iphone_15__buwagff0mwwi_xlarge.png',
    backgroundColor: 'bg-gradient-to-r from-gray-800 to-black',
    textColor: 'text-white',
    ctaText: 'Mua iPhone',
    ctaLink: 'https://www.apple.com',
    isExternal: true,
    icon: <Smartphone className="h-5 w-5" />
  },
  {
    id: '2',
    title: 'Coca-Cola - Cảm Nhận Hương Vị',
    description: 'Giải khát với thức uống có ga nguyên bản và được yêu thích nhất',
    image: 'https://www.coca-cola.com/content/dam/onexp/vn/vi/brands/coca-cola/vn-coca-cola.png/width1960.png',
    backgroundColor: 'bg-gradient-to-r from-red-600 to-red-700',
    textColor: 'text-white',
    ctaText: 'Xem Coca-Cola',
    ctaLink: 'https://www.coca-cola.com',
    isExternal: true,
    icon: <Coffee className="h-5 w-5" />
  },
  {
    id: '3',
    title: 'PlayStation 5 - Chơi Không Giới Hạn',
    description: 'Đắm chìm trong thế giới cảm nhận, nhìn và nghe thực sự như thật',
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
    backgroundColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
    textColor: 'text-white',
    ctaText: 'Chơi PlayStation',
    ctaLink: 'https://www.playstation.com',
    isExternal: true,
    icon: <Gamepad2 className="h-5 w-5" />
  },
  {
    id: '4',
    title: 'Spotify - Âm Nhạc Cho Mọi Người',
    description: 'Nghe hàng triệu bài hát, podcast và khám phá nhạc mới',
    image: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    textColor: 'text-white',
    ctaText: 'Nghe Spotify',
    ctaLink: 'https://www.spotify.com',
    isExternal: true,
    icon: <Music className="h-5 w-5" />
  },
  {
    id: '6',
    title: 'Nike - Cứ Làm Đi',
    description: 'Tìm đôi giày, quần áo và thiết bị yêu thích tiếp theo của bạn',
    image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_500,c_limit/6ec248e4-ed58-436a-a9cb-78f1c009b1df/nike-just-do-it.jpg',
    backgroundColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    textColor: 'text-white',
    ctaText: 'Mua Nike',
    ctaLink: 'https://www.nike.com',
    isExternal: true,
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: '8',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI đã có mặt. Smartphone Galaxy thông minh nhất từ trước đến nay',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bzkcxxv-thumb-539307321?$200_200_PNG$',
    backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
    textColor: 'text-white',
    ctaText: 'Khám Phá Galaxy',
    ctaLink: 'https://www.samsung.com',
    isExternal: true,
    icon: <Smartphone className="h-5 w-5" />
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
                    {/* Product Image */}
                    {ad.image && (
                      <motion.div
                        key={`${ad.id}-image`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm"
                      >
                        <Image
                          src={ad.image}
                          alt={ad.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                        />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <motion.div
                      key={`${ad.id}-icon`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
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
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className={`font-bold text-base md:text-lg ${ad.textColor} line-clamp-1`}
                      >
                        {ad.title}
                      </motion.h3>
                      <motion.p
                        key={`${ad.id}-desc`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className={`text-sm md:text-base ${ad.textColor.replace('text-', 'text-').replace('-', '-200')} line-clamp-2 text-white/90`}
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
                          aria-label={`Chuyển đến quảng cáo ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Minimize Button */}
                    {/* <button
                      onClick={handleMinimize}
                      className={`p-2 rounded-full ${ad.textColor.replace('text-', 'text-').replace('-', '-300')} hover:bg-white/20 transition-all duration-300`}
                      aria-label="Thu nhỏ banner"
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
                      aria-label="Đóng banner quảng cáo"
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
                    {/* Small Product Image */}
                    {ad.image && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-white/10">
                        <Image
                          src={ad.image}
                          alt={ad.title}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
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