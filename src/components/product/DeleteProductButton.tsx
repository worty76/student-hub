'use client';

import React, { useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
// import { useRouter } from 'next/navigation';

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
  token: string;
  onDeleteSuccess?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
}

export const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({
  productId,
  productTitle,
  token,
  onDeleteSuccess,
  className = '',
  size = 'md',
  variant = 'button'
}) => {
  // const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { 
    deleteProduct, 
    isDeleting, 
    deleteError,
    clearDeleteError
  } = useProductStore();

  const handleDeleteClick = () => {
    setLocalError(null);
    setShowDeleteDialog(true);
  };

  const getTruncatedTitle = (title: string, maxLength: number = 50) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productId, token);
      setShowDeleteDialog(false);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi xóa sản phẩm';
      setLocalError(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setLocalError(null);
    clearDeleteError();
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizeClasses = {
    sm: 'p-1.5 w-7 h-7',
    md: 'p-2 w-8 h-8',
    lg: 'p-2.5 w-10 h-10'
  };

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className={`
            ${iconSizeClasses[size]}
            bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800
            rounded-full transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            border border-red-200 hover:border-red-300
            shadow-sm hover:shadow-md cursor-pointer
            ${className}
          `}
          title={`Xóa ${productTitle}`}
        >
          <svg 
            className={iconSize[size]} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>

        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Xóa sản phẩm"
          message={`Bạn có chắc chắn muốn xóa "${getTruncatedTitle(productTitle)}"? \n Hành động này không thể được hoàn tác.`}
        />

        {(localError || deleteError) && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-grow">
                <p className="font-medium text-red-800">Lỗi khi xóa sản phẩm</p>
                <p className="text-sm text-red-700 mt-1">{localError || deleteError}</p>
              </div>
              <button
                onClick={() => {
                  setLocalError(null);
                  clearDeleteError();
                }}
                className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0 p-1 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`
          ${sizeClasses[size]}
          bg-red-600 text-white hover:bg-red-700
          rounded-md border border-red-600 hover:border-red-700
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
          shadow-sm hover:shadow-md
          font-medium
          cursor-pointer
          ${className}
        `}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
        {isDeleting ? 'Đang xóa...' : 'Xóa'}
      </button>

               <DeleteConfirmationDialog
           isOpen={showDeleteDialog}
           onClose={handleCloseDialog}
           onConfirm={handleConfirmDelete}
           isLoading={isDeleting}
           title="Xóa sản phẩm"
           message={`Bạn có chắc chắn muốn xóa "${getTruncatedTitle(productTitle)}"? \n Hành động này không thể được hoàn tác.`}
         />

      {(localError || deleteError) && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-grow">
              <p className="font-medium text-red-800">Lỗi khi xóa sản phẩm</p>
              <p className="text-sm text-red-700 mt-1">{localError || deleteError}</p>
            </div>
            <button
              onClick={() => {
                setLocalError(null);
                clearDeleteError();
              }}
              className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0 p-1 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteProductButton; 