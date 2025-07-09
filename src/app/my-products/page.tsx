'use client';

import { useRouter } from 'next/navigation';
import { UserProductsList } from '@/components/product/UserProductsList';
import { Toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/store/userStore';

export default function MyProductsPage() {
  const { profile } = useUserStore();
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
          userId={profile?._id}
          showActions={true}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
        />
      </div>
      <Toaster />
    </div>
  );
} 