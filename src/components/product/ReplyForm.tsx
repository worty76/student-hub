'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, X } from 'lucide-react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ReplyFormProps {
  parentCommentId: string;
  onCancel: () => void;
  autoFocus?: boolean;
}

// Helper function to validate avatar URL
const isValidAvatarUrl = (url: string | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

export default function ReplyForm({ parentCommentId, onCancel, autoFocus = true }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [imageError, setImageError] = useState(false);
  const { createReply, replySubmissions, error } = useCommentStore();
  const { isAuthenticated, user } = useAuthStore();
  const { displayUser } = useUserProfile();

  const currentUser = displayUser || user;
  const isSubmitting = replySubmissions[parentCommentId] || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để trả lời');
      return;
    }

    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung trả lời');
      return;
    }

    if (content.length > 500) {
      toast.error('Trả lời không được vượt quá 500 ký tự');
      return;
    }

    try {
      await createReply(parentCommentId, content);
      setContent('');
      onCancel(); // Close the reply form after successful submission
      toast.success('Trả lời đã được gửi thành công!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi gửi trả lời');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 ml-12 mt-2">
        <div className="text-center text-gray-500">
          <p className="text-sm mb-2">Đăng nhập để trả lời bình luận</p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline" size="sm">
              Đăng nhập
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Hủy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 ml-12 mt-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {currentUser?.avatar && isValidAvatarUrl(currentUser.avatar) && !imageError ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.name || 'User avatar'}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  console.error('User avatar image failed to load:', currentUser.avatar, 'Error:', e);
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log('User avatar image loaded successfully:', currentUser.avatar);
                }}
              />
            ) : (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Viết trả lời của bạn... (Nhấn Enter để gửi, Shift+Enter để xuống dòng, Esc để hủy)"
              className="min-h-[60px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              disabled={isSubmitting}
              maxLength={500}
              autoFocus={autoFocus}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {content.length}/500 ký tự
          </span>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-3 w-3 mr-1" />
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="min-w-[70px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 mr-1" />
                  Trả lời
                </>
              )}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
} 