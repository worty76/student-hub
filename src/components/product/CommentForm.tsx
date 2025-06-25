'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

interface CommentFormProps {
  productId: string;
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

export default function CommentForm({ productId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [imageError, setImageError] = useState(false);
  const { createComment, isSubmitting, error } = useCommentStore();
  const { isAuthenticated, user } = useAuthStore();
  const { displayUser } = useUserProfile();

  const currentUser = displayUser || user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (content.length > 500) {
      toast.error('Bình luận không được vượt quá 500 ký tự');
      return;
    }

    try {
      await createComment(productId, content);
      setContent('');
      toast.success('Bình luận đã được gửi thành công!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi gửi bình luận');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <p className="mb-2">Đăng nhập để tham gia thảo luận</p>
            <Button variant="outline" size="sm">
              Đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {currentUser?.avatar && isValidAvatarUrl(currentUser.avatar) && !imageError ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name || 'User avatar'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    console.error('User avatar image failed to load:', currentUser.avatar, 'Error:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {}}
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Viết bình luận của bạn... (Nhấn Enter để gửi, Shift+Enter để xuống dòng)"
                className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {content.length}/500 ký tự
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim()}
                  className="min-w-[80px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 