'use client';

import { Suspense } from 'react';
import { AllProductsPage } from '../../components/marketplace/AllProductsPage';

function ProductsPageContent() {
  return <AllProductsPage />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải trang sản phẩm...</p>
      </div>
    </div>}>
      <ProductsPageContent />
    </Suspense>
  );
} 