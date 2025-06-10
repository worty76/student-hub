'use client';

import { useState, useCallback } from 'react';
import { ReviewData } from '@/components/product/ReviewForm';

interface UseReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

interface ReviewFormState {
  isSubmitting: boolean;
  error: string | null;
  isSuccess: boolean;
}

// Mock API function - replace with your actual API call
const submitReviewAPI = async (productId: string, reviewData: ReviewData): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random success/failure for demo
  if (Math.random() > 0.8) {
    throw new Error('Network error. Please try again.');
  }
  
  console.log('Review submitted:', { productId, ...reviewData });
  // In real implementation, make API call here
};

export const useReviewForm = ({ productId, onSuccess }: UseReviewFormProps) => {
  const [state, setState] = useState<ReviewFormState>({
    isSubmitting: false,
    error: null,
    isSuccess: false,
  });

  const submitReview = useCallback(async (reviewData: ReviewData) => {
    setState({ isSubmitting: true, error: null, isSuccess: false });

    try {
      await submitReviewAPI(productId, reviewData);
      
      setState({ isSubmitting: false, error: null, isSuccess: true });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
      setState({ isSubmitting: false, error: errorMessage, isSuccess: false });
      throw error;
    }
  }, [productId, onSuccess]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ isSubmitting: false, error: null, isSuccess: false });
  }, []);

  return {
    ...state,
    submitReview,
    clearError,
    reset,
  };
}; 