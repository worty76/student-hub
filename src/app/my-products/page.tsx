'use client';

import { useRouter } from 'next/navigation';
import { UserProductsList } from '@/components/product/UserProductsList';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

export default function MyProductsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleEdit = (productId: string) => {
    router.push(`/products/edit/${productId}`);
  };

  const handleDelete = (productId: string) => {
    toast({
      title: 'Xóa sản phẩm',
      description: `Sản phẩm ${productId} đã được xóa`,
      variant: 'default',
    });
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <UserProductsList 
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
      <Toaster />
    </div>
  );
} 