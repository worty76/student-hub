'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, MessageCircle } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
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
      setIsFocused(false);
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
      <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Tham gia thảo luận</h3>
            <p className="text-slate-600 mb-4">Đăng nhập để chia sẻ ý kiến của bạn về sản phẩm này</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
            >
              Đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border transition-all duration-200 shadow-sm hover:shadow-md ${
      isFocused 
        ? 'border-blue-400 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 shadow-md' 
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {currentUser?.avatar && isValidAvatarUrl(currentUser.avatar) && !imageError ? (
                <div className="relative">
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name || 'User avatar'}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-200"
                    onError={(e) => {
                      console.error('User avatar image failed to load:', currentUser.avatar, 'Error:', e);
                      setImageError(true);
                    }}
                    onLoad={() => {}}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md ring-2 ring-slate-200">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Chia sẻ ý kiến của bạn về sản phẩm này... (Nhấn Enter để gửi, Shift+Enter để xuống dòng)"
                  className={`min-h-[100px] resize-none transition-all duration-200 ${
                    isFocused 
                      ? 'border-blue-400 ring-2 ring-blue-100 bg-white' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  } focus:ring-blue-100 placeholder:text-slate-400`}
                  disabled={isSubmitting}
                  maxLength={500}
                />
                {isFocused && (
                  <div className="absolute inset-0 rounded-md pointer-events-none">
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-20"></div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm transition-colors ${
                    content.length > 450 
                      ? 'text-red-500 font-medium' 
                      : content.length > 350 
                        ? 'text-amber-600' 
                        : 'text-slate-500'
                  }`}>
                    {content.length}/500 ký tự
                  </span>
                  {content.length > 450 && (
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim()}
                  className={`min-w-[100px] transition-all duration-200 ${
                    content.trim() 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Gửi bình luận</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 p-3 rounded-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              <span>{error}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 