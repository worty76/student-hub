import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/StarRating';
import { useRatingStore } from '@/store/ratingStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { RatingFormData, RatingValidationErrors } from '@/types/rating';
import { Loader2 } from 'lucide-react';

interface RatingFormProps {
  userId: string;
  userName: string;
  onRatingSuccess?: () => void;
}

export function RatingForm({ userId, userName, onRatingSuccess }: RatingFormProps) {
  const [formData, setFormData] = useState<RatingFormData>({
    rating: 0,
    comment: '',
  });
  const [errors, setErrors] = useState<RatingValidationErrors>({});

  const { createRating, isLoading, error, clearError } = useRatingStore();
  const { token, isAuthenticated } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: RatingValidationErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Vui lòng chọn đánh giá';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Vui lòng nhập bình luận';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Bình luận phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!isAuthenticated || !token) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await createRating(userId, formData, token);
      
      toast.success(`Đánh giá của bạn cho ${userName} đã được gửi thành công!`);

      // Reset form
      setFormData({ rating: 0, comment: '' });
      setErrors({});
      
      // Call success callback if provided
      if (onRatingSuccess) {
        onRatingSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi gửi đánh giá. Vui lòng thử lại.');
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const comment = e.target.value;
    setFormData(prev => ({ ...prev, comment }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để đánh giá</p>
            <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
              Đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đánh giá {userName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Đánh giá <span className="text-red-500">*</span>
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="lg"
            />
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bình luận <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.comment}
              onChange={handleCommentChange}
              placeholder="Chia sẻ trải nghiệm của bạn với người dùng này..."
              rows={4}
              error={errors.comment}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 