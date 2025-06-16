'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EditProductForm } from '@/components/product/EditProductForm';
import { Toaster } from '@/components/ui/toaster';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const handleSuccess = () => {
    router.push(`/my-products`);
  };

  const handleCancel = () => {
    router.push(`/my-products`);
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">ID sản phẩm không hợp lệ</h1>
            <p className="text-gray-600 mt-2">Không có ID sản phẩm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <EditProductForm 
          productId={productId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
      <Toaster />
    </div>
  );
} 