'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';

export interface ReviewData {
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  productTitle: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productTitle,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string; submit?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    } else if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setErrors({});
      await onSubmit({
        rating,
        comment: comment.trim(),
      });
      
      // Reset form after successful submission
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to submit review. Please try again.' 
      });
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  };

  const characterCount = comment.length;
  const characterLimit = 1000;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Write a Review
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience with &ldquo;{productTitle}&rdquo;
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Rating *
            </Label>
            <StarRating
              rating={rating}
              onRatingChange={handleRatingChange}
              interactive
              size="lg"
              disabled={isSubmitting}
            />
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label htmlFor="review-comment" className="text-sm font-medium">
              Your Review *
            </Label>
            <div className="relative">
              <Textarea
                id="review-comment"
                placeholder="Tell others about your experience with this product..."
                value={comment}
                onChange={handleCommentChange}
                disabled={isSubmitting}
                maxLength={characterLimit}
                className={cn(
                  'min-h-[120px] resize-none',
                  errors.comment && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1">
                {characterCount}/{characterLimit}
              </div>
            </div>
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm; 