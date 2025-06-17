'use client';

import React, { useEffect } from 'react';
import { useCommentStore } from '@/store/commentStore';
import { useAuthStore } from '@/store/authStore';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface ProductCommentsProps {
  productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const { subscribeToComments, clearComments } = useCommentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToComments(productId);
    return () => {
      unsubscribe();
      clearComments();
    };
  }, [productId, subscribeToComments, clearComments, user]);

  return (
    <div className="space-y-6">
      <CommentForm productId={productId} />
      <CommentList productId={productId} />
    </div>
  );
} 