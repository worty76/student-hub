'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Package } from 'lucide-react';
import Image from 'next/image';
import ReviewForm from '@/components/product/ReviewForm';
import StarRating from '@/components/product/StarRating';
import { useReviewForm } from '@/hooks/useReviewForm';

const mockProduct = {
  id: 'demo-product',
  title: 'MacBook Pro 13" 2020 - Space Gray',
  image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
};

export default function ReviewFormDemo() {
  const [showForm, setShowForm] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<Array<{
    rating: number;
    comment: string;
    timestamp: Date;
  }>>([]);

  const { submitReview, isSubmitting } = useReviewForm({
    productId: mockProduct.id,
    onSuccess: () => {
      setShowForm(false);
      // Show success message
      alert('Review submitted successfully! 🎉');
    }
  });

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    try {
      await submitReview(reviewData);
      // Add to local state for demo purposes
      setSubmittedReviews(prev => [
        { ...reviewData, timestamp: new Date() },
        ...prev
      ]);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Review submission failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Form Demo</h1>
          <p className="text-muted-foreground">
            Test the product review form with star rating functionality
          </p>
        </div>

        {/* Mock Product Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={mockProduct.image}
                  alt={mockProduct.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{mockProduct.title}</h3>
                <p className="text-muted-foreground">Demo product for testing reviews</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$899</div>
                <div className="text-sm text-muted-foreground">Like New</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button 
              onClick={() => setShowForm(true)} 
              disabled={showForm}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write Review
            </Button>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="max-w-2xl mx-auto">
              <ReviewForm
                productTitle={mockProduct.title}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowForm(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {/* Submitted Reviews */}
          {submittedReviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Submitted Reviews</h3>
              {submittedReviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {review.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Demo Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <p>Click &ldquo;Write Review&rdquo; to open the review form</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <p>Select a star rating by clicking on the stars</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <p>Write your review (minimum 10 characters, maximum 1000)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <p>Click &ldquo;Submit Review&rdquo; to submit (simulates API call with delay)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Form Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Interactive Elements</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Clickable star rating with hover effects</li>
                    <li>• Real-time form validation</li>
                    <li>• Character counter for text area</li>
                    <li>• Loading states during submission</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Validation Rules</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Rating is required (1-5 stars)</li>
                    <li>• Review text minimum 10 characters</li>
                    <li>• Review text maximum 1000 characters</li>
                    <li>• Form clears after successful submission</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 