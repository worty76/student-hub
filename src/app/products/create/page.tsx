'use client';

import { useRouter } from 'next/navigation';
import { CreateProductForm } from '@/components/product/CreateProductForm';
import { Toaster } from '@/components/ui/toaster';

export default function CreateProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/my-products`);
  };

  const handleCancel = () => {
    router.push('/my-products');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <CreateProductForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
      <Toaster />
    </div>
  );
} 