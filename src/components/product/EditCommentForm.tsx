'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, X } from 'lucide-react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { CommentWithUserInfo } from '@/types/comment';

interface EditCommentFormProps {
  comment: CommentWithUserInfo;
  onCancel: () => void;
  className?: string;
}

export default function EditCommentForm({ comment, onCancel, className = '' }: EditCommentFormProps) {
  const [content, setContent] = useState(comment.content);
  const [hasChanges, setHasChanges] = useState(false);
  const { editComment, editSubmissions, error } = useCommentStore();
  const { isAuthenticated } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = editSubmissions[comment._id] || false;

  // Focus and select all text when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(content.trim() !== comment.content.trim());
  }, [content, comment.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để chỉnh sửa bình luận');
      return;
    }

    if (!content.trim()) {
      toast.error('Nội dung bình luận không được để trống');
      return;
    }

    if (content.length > 500) {
      toast.error('Bình luận không được vượt quá 500 ký tự');
      return;
    }

    if (!hasChanges) {
      toast.info('Không có thay đổi nào để lưu');
      onCancel();
      return;
    }

    try {
      await editComment(comment._id, content);
      toast.success('Bình luận đã được cập nhật thành công!');
      onCancel(); // Exit edit mode after successful update
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật bình luận');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy?');
      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chỉnh sửa nội dung bình luận... (Ctrl+Enter để lưu, Esc để hủy)"
            className="min-h-[80px] resize-none border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white"
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{content.length}/500 ký tự</span>
            {hasChanges && (
              <span className="text-yellow-600 font-medium">● Có thay đổi</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            <span>Ctrl+Enter để lưu • Esc để hủy</span>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-3 w-3 mr-1" />
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content.trim() || !hasChanges}
              className="bg-yellow-600 hover:bg-yellow-700 text-white min-w-[70px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  Lưu
                </>
              )}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
            {error}
          </div>
        )}
      </form>
    </div>
  );
} 