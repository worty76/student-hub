'use client';

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

interface DeleteCommentButtonProps {
  commentId: string;
  userId: string; // The user ID of the comment author
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({
  commentId,
  userId,
  size = 'sm',
  className = ''
}) => {
  const { deleteComment, deleteSubmissions } = useCommentStore();
  const { user } = useAuthStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const isDeleting = deleteSubmissions[commentId] || false;
  const isOwner = user?._id === userId;

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  // Debug logging
  console.log('DeleteCommentButton Debug:', {
    commentId,
    userId,
    currentUserId: user?._id,
    isOwner,
    user: user
  });
    
  // Don't show delete button if not the comment owner
  if (!isOwner) {
    return null;
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    await deleteComment(commentId);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`
          ${sizeClasses[size]}
          text-red-600 hover:text-red-700 hover:bg-red-50
          transition-colors duration-200 cursor-pointer
          ${className}
        `}
        title="Xóa bình luận"
      >
        {isDeleting ? (
          <Loader2 size={iconSizes[size]} className="animate-spin" />
        ) : (
          <Trash2 size={iconSizes[size]} />
        )}
      </Button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center cursor-pointer">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xóa bình luận
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Bạn có chắc chắn muốn xóa bình luận này không?
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Hành động này không thể hoàn tác. Bình luận sẽ bị xóa vĩnh viễn.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Đang xóa...
                  </>
                ) : (
                  'Xóa bình luận'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 