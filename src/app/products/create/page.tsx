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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="relative">
        {/* Header section with gradient */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Đăng Bán Sản Phẩm
              </h1>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Chia sẻ sản phẩm của bạn với cộng đồng sinh viên
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <CreateProductForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
} 