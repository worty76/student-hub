import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/StarRating';

export function StarRatingExample() {
  const [rating, setRating] = useState(0);
  const [readOnlyRating] = useState(4.5);

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Star Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select your rating:
            </label>
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
              size="lg" 
            />
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              You selected: {rating} stars
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Read-Only Display</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">Average Rating:</p>
            <StarRating 
              rating={readOnlyRating} 
              readonly 
              size="md" 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Different Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Small</p>
            <StarRating rating={3} readonly size="sm" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Medium</p>
            <StarRating rating={4} readonly size="md" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Large</p>
            <StarRating rating={5} readonly size="lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 