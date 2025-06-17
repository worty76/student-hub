'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package2, 
  Loader2, 
  AlertCircle, 
  Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { ProductDataTable } from '@/components/product/ProductDataTable';
import Link from 'next/link';

interface UserProductsListProps {
  userId?: string;
  showActions?: boolean;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  className?: string;
}

export function UserProductsList({ 
  userId, 
  showActions = true,
  onEdit,
  onViewDetails,
  className 
}: UserProductsListProps) {
  const { toast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const {
    userProducts,
    isLoadingUserProducts,
    userProductsError,
    loadUserProductsByUserId,
    loadUserProducts,
    clearUserProductsError
  } = useProductStore();

  const { user, token } = useAuthStore();

  const targetUserId = userId || user?._id;
  const isCurrentUser = !userId || targetUserId === user?._id;

  useEffect(() => {
    const loadProducts = async () => {
      if (!targetUserId) {
        setIsInitialLoad(false);
        return;
      }

      try {
        if (isCurrentUser && token) {
          await loadUserProducts(token);
                 } else if (targetUserId) {
           await loadUserProductsByUserId(targetUserId, token || undefined);
         }
      } catch (error) {
        console.error('Failed to load user products:', error);
        toast({
          title: 'Lỗi',
          description: 'Lỗi khi lấy thông tin sản phẩm của người dùng',
          variant: 'destructive',
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadProducts();
  }, [targetUserId, isCurrentUser, token, loadUserProducts, loadUserProductsByUserId, toast]);

  const handleEdit = (productId: string) => {
    if (onEdit) {
      onEdit(productId);
    } else {
      console.log('Edit product:', productId);
    }
  };

  const handleViewDetails = (productId: string) => {
    if (onViewDetails) {
      onViewDetails(productId);
    } else {
      // Default behavior - navigate to product details page
      window.open(`/products/${productId}`, '_blank');
    }
  };

  // Handle delete action
//   const handleDelete = (productId: string) => {
//     if (onDelete) {
//       onDelete(productId);
//     } else {
//       // Default behavior - could show confirmation dialog
//       console.log('Delete product:', productId);
//     }
//   };

  if (isInitialLoad || isLoadingUserProducts) {
    return (
      <div className={className}>
        <Card className="w-full">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (userProductsError) {
    return (
      <div className={className}>
        <Card className="w-full">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600 mb-4">{userProductsError}</p>
                <Button 
                  onClick={() => {
                    clearUserProductsError();
                    window.location.reload();
                  }}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!userProducts || userProducts.length === 0) {
    return (
      <div className={className}>
        <Card className="w-full">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isCurrentUser ? 'Không có sản phẩm nào' : 'Không có sản phẩm nào'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isCurrentUser 
                    ? "Bạn chưa đăng bán sản phẩm nào. Hãy bắt đầu bằng cách đăng bán sản phẩm đầu tiên của bạn!"
                    : "Người dùng này chưa đăng bán sản phẩm nào."
                  }
                </p>
                {isCurrentUser && (
                    <Link href="/products/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Đăng bán sản phẩm
                        </Button>
                    </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCurrentUser ? 'Sản phẩm của tôi' : 'Sản phẩm của người dùng'}
                </h2>
                <p className="text-gray-600">
                  {userProducts.length} sản phẩm{userProducts.length !== 1 ? 's' : ''} đã tìm thấy
                </p>
              </div>
            </div>
            {isCurrentUser && (
              <Link href="/products/create">
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng bán sản phẩm
                </Button>
              </Link>
            )}
          </div>

                    <ProductDataTable
            data={userProducts}
            showActions={showActions}
            isCurrentUser={isCurrentUser}
            token={token ?? undefined}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onDeleteSuccess={() => {
              if (targetUserId && isCurrentUser && token) {
                loadUserProducts(token);
              } else if (targetUserId) {
                loadUserProductsByUserId(targetUserId, token ?? undefined);
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
} 