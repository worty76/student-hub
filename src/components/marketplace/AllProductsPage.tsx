'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductsList } from './ProductsList';
import { CategoryHeader } from './CategoryHeader';
import { useProductsListStore } from '@/store/productsListStore';
import { ProductsQueryParams } from '@/types/product';

export function AllProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { fetchProductsWithParams } = useProductsListStore();

  useEffect(() => {
    // Fetch products based on URL parameters
    const params: ProductsQueryParams = {};
    if (category) {
      params.category = category;
    }
    
    fetchProductsWithParams(params);
  }, [category, fetchProductsWithParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="relative">
        {/* Header section with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <CategoryHeader category={category} />
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