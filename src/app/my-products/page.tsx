'use client';

import { useRouter } from 'next/navigation';
import { UserProductsList } from '@/components/product/UserProductsList';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/authStore';

export default function MyProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleEdit = (productId: string) => {
    router.push(`/products/edit/${productId}`);
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <UserProductsList 
          userId={user?.id}
          showActions={true}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
        />
      </div>
      <Toaster />
    </div>
  );
} 