'use client';

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onDeleteSuccess?: () => void;
  iconOnly?: boolean;
}

export function DeleteProductButton({
  productId,
  productTitle,
  variant = 'outline',
  size = 'sm',
  className,
  onDeleteSuccess,
  iconOnly = false
}: DeleteProductButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { token } = useAuthStore();
  const { deleteProduct, deletingProductId } = useAdminStore();

  const isDeleting = deletingProductId === productId;

  const handleDelete = async () => {
    if (!token) {
      toast({
        title: 'Lỗi xác thực',
        description: 'Vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteProduct(token, productId);
      
      toast({
        title: 'Xóa thành công',
        description: 'Product removed by admin',
        variant: 'default',
      });
      
      setIsDialogOpen(false);
      onDeleteSuccess?.();
    } catch (error: unknown) {
      let errorMessage = 'Có lỗi xảy ra khi xóa sản phẩm';
      
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; message?: string };
        if (apiError.status === 401) {
          errorMessage = 'Unauthorized - Please login again';
        } else if (apiError.status === 403) {
          errorMessage = 'Forbidden – Admin access required';
        } else if (apiError.status === 404) {
          errorMessage = 'Product not found';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Lỗi xóa sản phẩm',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  // Different button styles based on iconOnly prop
  const getButtonContent = () => {
    if (iconOnly) {
      return isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      );
    }

    return (
      <div className="flex items-center gap-2">
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        {!iconOnly && (isDeleting ? 'Đang xóa...' : 'Xóa')}
      </div>
    );
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isDeleting}
          title={iconOnly ? 'Xóa sản phẩm' : undefined}
        >
          {getButtonContent()}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Xác nhận xóa sản phẩm
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-left space-y-2">
              <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900 truncate" title={productTitle}>
                  {productTitle}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {productId}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xóa...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Xóa sản phẩm
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 