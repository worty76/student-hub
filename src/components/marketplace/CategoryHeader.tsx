'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories } from '@/constants/marketplace-data';
import { Home, ChevronRight, Package } from 'lucide-react';

interface CategoryHeaderProps {
  category?: string | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  // Find the category data
  const categoryData = category ? categories.find(cat => cat.id === category) : null;

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="text-center"
    >
      {/* Breadcrumb */}
      <motion.nav 
        variants={fadeInUp}
        className="flex items-center justify-center mb-6 text-blue-200"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-white transition-colors duration-200"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Trang chủ</span>
        </Link>
        
        <ChevronRight className="h-4 w-4 mx-2" />
        
        <Link 
          href="/products" 
          className="hover:text-white transition-colors duration-200"
        >
          Sản phẩm
        </Link>
        
        {categoryData && (
          <>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">{categoryData.name}</span>
          </>
        )}
      </motion.nav>

      {/* Header Content */}
      {categoryData ? (
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Category Icon and Title */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border border-white/30">
              {categoryData.icon}
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {categoryData.name}
              </h1>
              <p className="text-blue-200 text-lg mt-1">
                {categoryData.productCount}+ sản phẩm có sẵn
              </p>
            </div>
          </div>
          
          {/* Category Description */}
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {categoryData.description}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* All Products Header */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Tất Cả Sản Phẩm
              </h1>
              <p className="text-blue-200 text-lg mt-1">
                Khám phá toàn bộ sản phẩm
              </p>
            </div>
          </div>
          
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Tìm những món đồ tuyệt vời từ cộng đồng sinh viên Đà Nẵng
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 