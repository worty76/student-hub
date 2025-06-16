'use client';

import React, { useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProductFavoriteButtonProps {
  productId: string;
  className?: string;
}

export function ProductFavoriteButton({ productId, className }: ProductFavoriteButtonProps) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { 
    isFavorite, 
    toggleFavorite, 
    isLoading,
    // error,
    clearError,
    loadFavorites
  } = useFavoritesStore();

  const isProductFavorite = isFavorite(productId);
  const isCurrentlyLoading = isLoading;

  useEffect(() => {
    if (isAuthenticated && token) {
      loadFavorites(token);
    }
  }, [isAuthenticated, token, loadFavorites]);

  const handleFavoriteClick = async () => {
    clearError();

    if (!isAuthenticated || !token) {
      toast.error('Không được phép', {
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push('/auth/login'),
        },
      });
      return;
    }

    try {
      const result = await toggleFavorite(productId, token);
      
      if (result.success) {
        const message = isProductFavorite 
          ? 'Đã xóa khỏi danh sách yêu thích'
          : 'Đã thêm vào danh sách yêu thích';
        
        toast.success(message, {
          description: result.message || message,
        });
      } else {
        switch (result.message) {
          case 'Product already in favorites':
            toast.warning('Sản phẩm đã có trong danh sách yêu thích', {
              description: 'Sản phẩm đã có trong danh sách yêu thích',
            });
            break;
          case 'Product not found':
            toast.error('Sản phẩm không tồn tại', {
              description: 'Sản phẩm bạn đang cố gắng thêm vào danh sách yêu thích không tồn tại',
            });
            break;
          default:
            toast.error('Lỗi', {
              description: result.message,
            });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      
      if (errorMessage === 'Unauthorized') {
        toast.error('Không được phép', {
          description: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          action: {
            label: 'Đăng nhập',
            onClick: () => router.push('/auth/login'),
          },
        });
      } else {
        toast.error('Error', {
          description: errorMessage,
        });
      }
    }
  };

  return (
    <Button
      onClick={handleFavoriteClick}
      disabled={isCurrentlyLoading}
      variant={isProductFavorite ? "default" : "outline"}
      size="lg"
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-200 min-w-[160px]",
        isProductFavorite 
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
          : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20",
        className
      )}
      title={isProductFavorite ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {isCurrentlyLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>{isProductFavorite ? 'Đang xóa...' : 'Đang thêm...'}</span>
        </>
      ) : (
        <>
          <Heart 
            className={cn(
              "size-4 transition-colors duration-200",
              isProductFavorite ? "fill-current" : ""
            )} 
          />
          <span>{isProductFavorite ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}</span>
        </>
      )}
    </Button>
  );
}

// Compact version for smaller spaces
export function CompactProductFavoriteButton({ productId, className }: ProductFavoriteButtonProps) {
  const { token, isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite, isLoading, clearError } = useFavoritesStore();
  const router = useRouter();

  const isProductFavorite = isFavorite(productId);

  const handleClick = async () => {
    clearError();

    if (!isAuthenticated || !token) {
      toast.error('Vui lòng đăng nhập để quản lý danh sách yêu thích');
      return;
    }

    try {
      const result = await toggleFavorite(productId, token);
      
      if (result.success) {
        toast.success(isProductFavorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      
      if (errorMessage === 'Unauthorized') {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push('/auth/login');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      className={cn(
        "size-10 rounded-full transition-all duration-200",
        isProductFavorite 
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" 
          : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
        className
      )}
      title={isProductFavorite ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            "size-4 transition-all duration-200",
            isProductFavorite ? "fill-red-500 text-red-500" : ""
          )} 
        />
      )}
    </Button>
  );
}

export default ProductFavoriteButton; 