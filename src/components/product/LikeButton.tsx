'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ThumbsUp } from 'lucide-react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { CommentWithUserInfo } from '@/types/comment';

interface LikeButtonProps {
  comment: CommentWithUserInfo;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LikeButton({ comment, size = 'sm', className = '' }: LikeButtonProps) {
  const { likeComment, unlikeComment, likeSubmissions } = useCommentStore();
  const { isAuthenticated, user } = useAuthStore();

  const userId = user?._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
  const isLiked = userId ? comment.likes.includes(userId) : false;
  const isSubmitting = likeSubmissions[comment._id] || false;

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thích bình luận');
      return;
    }

    try {
      if (isLiked) {
        // Unlike the comment using DELETE request
        await unlikeComment(comment._id);
        toast.success('Đã bỏ thích bình luận');
      } else {
        // Like the comment using POST request
        await likeComment(comment._id);
        toast.success('Đã thích bình luận');
      }
    } catch (error) {
      // Error handling is already done in the store
      console.error('Like/Unlike error:', error);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'lg':
        return 'h-8 px-3';
      case 'md':
        return 'h-7 px-2.5';
      case 'sm':
      default:
        return 'h-6 px-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'lg':
        return 'h-4 w-4';
      case 'md':
        return 'h-3.5 w-3.5';
      case 'sm':
      default:
        return 'h-3 w-3';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'lg':
        return 'text-sm';
      case 'md':
        return 'text-xs';
      case 'sm':
      default:
        return 'text-xs';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${getButtonSize()} ${getTextSize()} ${
        isLiked 
          ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer' 
          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
      } transition-colors duration-200 ${className}`}
      onClick={handleLikeToggle}
      disabled={isSubmitting || !isAuthenticated}
      title={
        !isAuthenticated 
          ? 'Đăng nhập để thích bình luận'
          : isLiked 
            ? 'Bỏ thích bình luận'
            : 'Thích bình luận'
      }
    >
      {isSubmitting ? (
        <Loader2 className={`${getIconSize()} animate-spin mr-1`} />
      ) : (
        <ThumbsUp
          className={`${getIconSize()} mr-1 ${
            isLiked ? 'fill-current' : ''
          } transition-all duration-200`}
        />
      )}
      
      <span className="font-medium">
        {comment.likeCount > 0 ? comment.likeCount : ''}
      </span>
      
      {size === 'lg' && (
        <span className="ml-1 hidden sm:inline">
          {isSubmitting ? 
            (isLiked ? 'Đang bỏ thích...' : 'Đang thích...') :
            (isLiked ? 'Đã thích' : 'Thích')
          }
        </span>
      )}
    </Button>
  );
} 