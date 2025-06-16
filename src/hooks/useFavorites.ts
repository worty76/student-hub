'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useFavorites() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const {
    favoriteProducts,
    favoriteProductsData,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites,
    isFavorite,
    clearError,
  } = useFavoritesStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      loadFavorites(token);
    }
  }, [isAuthenticated, token, loadFavorites]);

  const handleAddToFavorites = async (productId: string) => {
    if (!isAuthenticated || !token) {
      toast.error('Không được phép', {
        description: 'Xin vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push('/auth/login'),
        },
      });
      return { success: false, message: 'Không được phép' };
    }

    try {
      const result = await addToFavorites(productId, token);
      
      if (result.success) {
        toast.success('Đã thêm vào danh sách yêu thích');
      } else {
        handleErrorMessage(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      handleError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    if (!isAuthenticated || !token) {
      toast.error('Không được phép', {
        description: 'Xin vui lòng đăng nhập để quản lý danh sách yêu thích',
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push('/auth/login'),
        },
      });
      return { success: false, message: 'Không được phép' };
    }

    try {
      const result = await removeFromFavorites(productId, token);
      
      if (result.success) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        handleErrorMessage(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      handleError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (!isAuthenticated || !token) {
      toast.error('Không được phép', {
        description: 'Xin vui lòng đăng nhập để quản lý danh sách yêu thích',
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push('/auth/login'),
        },
      });
      return { success: false, message: 'Không được phép' };
    }

    try {
      const result = await toggleFavorite(productId, token);
      
      if (result.success) {
        const message = isFavorite(productId) 
          ? 'Đã xóa khỏi danh sách yêu thích'
          : 'Đã thêm vào danh sách yêu thích';
        toast.success(message);
      } else {
        handleErrorMessage(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      handleError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleErrorMessage = (message: string) => {
    switch (message) {
      case 'Product already in favorites':
        toast.warning('Sản phẩm đã có trong danh sách yêu thích');
        break;
      case 'Product not found':
        toast.error('Sản phẩm không tồn tại');
        break;
      default:
        toast.error('Lỗi', {
          description: message,
        });
    }
  };

  const handleError = (errorMessage: string) => {
    if (errorMessage === 'Unauthorized') {
      toast.error('Không được phép', {
        description: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push('/auth/login'),
        },
      });
    } else {
      toast.error('Lỗi', {
        description: errorMessage,
      });
    }
  };

  const refreshFavorites = async () => {
    if (isAuthenticated && token) {
      await loadFavorites(token);
    }
  };

  return {
    favoriteProducts: Array.from(favoriteProducts),
    favoriteProductsData,
    isLoading,
    error,
    isAuthenticated,
    
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
    toggleFavorite: handleToggleFavorite,
    isFavorite,
    refreshFavorites,
    clearError,
    
    favoritesCount: favoriteProducts.size,
  };
}

export default useFavorites; 