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
      window.open(`/products/${productId}`, '_blank');
    }
  };

  if (isInitialLoad || isLoadingUserProducts) {
    return (
      <div className={className}>
        <Card className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-3 sm:mb-4 text-blue-600" />
                <p className="text-sm sm:text-base text-gray-600">Đang tải sản phẩm...</p>
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
        <Card className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-red-500" />
                <p className="text-sm sm:text-base text-red-600 mb-3 sm:mb-4 px-4">{userProductsError}</p>
                <Button 
                  onClick={() => {
                    clearUserProductsError();
                    window.location.reload();
                  }}
                  size="sm"
                  className="text-sm"
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
        <Card className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center max-w-md mx-auto">
                <Package2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {isCurrentUser ? 'Không có sản phẩm nào' : 'Không có sản phẩm nào'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                  Bạn chưa đăng bán sản phẩm nào. Hãy bắt đầu bằng cách đăng bán sản phẩm đầu tiên của bạn!
                </p>
                <Link href="/products/create">  
                  <Button size="sm" className="text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng bán sản phẩm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {isCurrentUser ? 'Sản phẩm của tôi' : 'Sản phẩm của người dùng'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {userProducts.length} sản phẩm{userProducts.length !== 1 ? 's' : ''} đã tìm thấy
                </p>
              </div>
            </div>
              <Link href="/products/create">
                <Button size="sm" className="w-full sm:w-auto text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="sm:inline">Đăng bán sản phẩm</span>
                </Button>
              </Link>
          </div>

          {/* Products Table/Grid */}
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