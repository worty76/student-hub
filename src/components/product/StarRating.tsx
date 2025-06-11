'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  disabled?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 'md',
  interactive = false,
  disabled = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (starIndex: number) => {
    if (!interactive || disabled) return;
    const newRating = starIndex + 1;
    onRatingChange?.(newRating);
  };

  const handleStarHover = (starIndex: number) => {
    if (!interactive || disabled) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive || disabled) return;
    setHoverRating(null);
  };

  return (
    <div 
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < displayRating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            disabled={disabled || !interactive}
            className={cn(
              'transition-all duration-200',
              interactive && !disabled && 'hover:scale-110 cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50',
              !interactive && 'cursor-default'
            )}
            aria-label={`Rate ${index + 1} star${index + 1 !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200'
              )}
            />
          </button>
        );
      })}
      
      {interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {displayRating > 0 ? `${displayRating}/5` : 'Click to rate'}
        </span>
      )}
    </div>
  );
};

export default StarRating; 