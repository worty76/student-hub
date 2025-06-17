import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/StarRating';
import { useRatingStore } from '@/store/ratingStore';
import { userService } from '@/services/user.service';
import { Loader2, Calendar, User } from 'lucide-react';
import { RatingWithUserInfo } from '@/types/rating';

interface UserRatingsListProps {
  userId: string;
  userName: string;
}

interface RatingCardProps {
  rating: RatingWithUserInfo;
}

function RatingCard({ rating }: RatingCardProps) {
  const [userInfo, setUserInfo] = React.useState<{ name: string; avatar?: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoadingUser(true);
        
        // Check if user ID is valid
        if (!rating.user || rating.user.trim() === '') {
          setUserInfo({ name: 'Anonymous User' });
          return;
        }

        const user = await userService.getUserById(rating.user);
        setUserInfo({
          name: user.name || 'Unknown User',
          avatar: user.avatar,
        });
      } catch (error) {
        // Log the error for debugging but don't show it to users
        console.warn(`Failed to fetch user info for ID ${rating.user}:`, error);
        
        // Set a fallback name based on error type
        if (error instanceof Error && error.message.includes('User not found')) {
          setUserInfo({ name: 'Deleted User' });
        } else {
          setUserInfo({ name: 'Unknown User' });
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [rating.user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Rating Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {userInfo?.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  {isLoadingUser ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {userInfo?.name || 'Unknown User'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(rating.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Star Rating */}
            <StarRating rating={rating.rating} readonly size="sm" />
          </div>
          
          {/* Comment */}
          <div className="pl-0 md:pl-13">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {rating.comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserRatingsList({ userId, userName }: UserRatingsListProps) {
  // Feature flag to disable ratings display if there are issues
  const ENABLE_RATINGS_DISPLAY = process.env.NEXT_PUBLIC_ENABLE_RATINGS_DISPLAY !== 'false';
  
  const { 
    userRatings, 
    isLoadingRatings, 
    ratingsError, 
    fetchUserRatings, 
    clearUserRatings, 
    clearRatingsError 
  } = useRatingStore();

  useEffect(() => {
    if (userId && userId.trim() !== '') {
      fetchUserRatings(userId);
    }

    return () => {
      clearUserRatings();
      clearRatingsError();
    };
  }, [userId, fetchUserRatings, clearUserRatings, clearRatingsError]);

  // If ratings display is disabled, don't render anything
  if (!ENABLE_RATINGS_DISPLAY) {
    return null;
  }

  // Calculate average rating
  const averageRating = userRatings.length > 0 
    ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length
    : 0;

  if (isLoadingRatings) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading ratings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ratingsError) {
    // If it's a user not found error, don't show the ratings section at all
    if (ratingsError === 'User not found') {
      return null;
    }
    
    // For other errors, show a simplified message or hide the section
    console.warn('Ratings error:', ratingsError);
    
    // For now, just show an empty state instead of an error
    // This makes the UI more graceful when the ratings API isn't available
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ratings for {userName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No ratings available</div>
            <p className="text-gray-400">
              Ratings for this user are currently unavailable.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Ratings for {userName}
          </CardTitle>
          <div className="flex items-center space-x-4">
            {userRatings.length > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(averageRating * 10) / 10} readonly size="sm" />
                </div>
                <span className="text-sm text-gray-600">
                  ({userRatings.length} review{userRatings.length !== 1 ? 's' : ''})
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {userRatings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No ratings yet</div>
                         <p className="text-gray-400">
               {userName} hasn&apos;t received any ratings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {userRatings.map((rating) => (
              <RatingCard key={rating._id} rating={rating} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 