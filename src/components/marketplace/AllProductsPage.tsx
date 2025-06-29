'use client';

import { ProductsList } from './ProductsList';

export function AllProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="relative">
        {/* Header section with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Khám Phá Sản Phẩm
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Tìm những món đồ tuyệt vời từ cộng đồng sinh viên
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductsList />
        </div>
      </div>
    </div>
  );
} 