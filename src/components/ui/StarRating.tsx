import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleStarClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, starValue: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStarClick(starValue);
    }
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              'transition-colors cursor-pointer',
              isFilled 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400',
              readonly && 'cursor-default',
              !readonly && 'hover:scale-110 transition-transform'
            )}
            onClick={() => handleStarClick(starValue)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
            tabIndex={readonly ? -1 : 0}
            role={readonly ? undefined : 'button'}
            aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
          />
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating} / {maxRating}
      </span>
    </div>
  );
}

export default StarRating; 