import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/StarRating';
import { useRatingStore } from '@/store/ratingStore';
import { userService } from '@/services/user.service';
import { Loader2, Calendar, User } from 'lucide-react';
import { RatingWithUserInfo } from '@/types/rating';
import { formatDate } from '@/lib/utils';

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
    // Since the API now returns the rater info directly, we don't need to fetch it
    const extractUserInfo = () => {
      try {
        setIsLoadingUser(true);
        
        if (!rating.rater || !rating.rater._id) {
          setUserInfo({ name: 'Người dùng ẩn danh' });
          return;
        }
        
        setUserInfo({
          name: rating.rater.name || 'Người dùng ẩn danh',
          avatar: rating.rater.avatar,
        });
      } catch (error) {
        console.warn('Error processing rater info:', error);
        setUserInfo({ name: 'Người dùng ẩn danh' });
      } finally {
        setIsLoadingUser(false);
      }
    };

    extractUserInfo();
  }, [rating.rater]);

  const formatDateDisplay = (dateString: string) => {
    return formatDate.dateTime(dateString);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
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
                      <span className="text-sm text-gray-500">Đang tải...</span>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {userInfo?.name || 'Người dùng ẩn danh'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateDisplay(rating.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <StarRating rating={rating.rating} readonly size="sm" />
          </div>
          
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

  if (!ENABLE_RATINGS_DISPLAY) {
    return null;
  }

  const averageRating = userRatings.length > 0 
    ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length
    : 0;

  if (isLoadingRatings) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Đang tải đánh giá...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ratingsError) {
    if (ratingsError === 'User not found') {
      return null;
    }
    
    console.warn('Ratings error:', ratingsError);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đánh giá cho {userName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">Không có đánh giá</div>
            <p className="text-gray-400">
              Đánh giá cho người dùng này hiện không khả dụng.
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
            Đánh giá cho {userName}
          </CardTitle>
          <div className="flex items-center space-x-4">
            {userRatings.length > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(averageRating * 10) / 10} readonly size="sm" />
                </div>
                <span className="text-sm text-gray-600">
                  ({userRatings.length} đánh giá{userRatings.length !== 1 ? 's' : ''})
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {userRatings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">Không có đánh giá</div>
                         <p className="text-gray-400">
               {userName} chưa nhận được đánh giá nào.
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