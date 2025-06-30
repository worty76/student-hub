'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicUserStore } from '@/store/publicUserStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, User, MapPin, Star, Heart, Calendar, Mail } from 'lucide-react';
import Image from 'next/image';
import UserProductsGrid from './UserProductsGrid';
import ReportUserButton from './ReportUserButton';
import { RatingForm, UserRatingsList } from '@/components/rating';
import { SendMessageButton } from '@/components/ui/messages/components/send-message-button';

interface PublicUserProfileProps {
  userId: string;
}

export default function PublicUserProfile({ userId }: PublicUserProfileProps) {
  const router = useRouter();
  const { 
    currentUser, 
    currentUserProducts,
    isLoading, 
    isLoadingProducts,
    error, 
    productsError,
    fetchUser, 
    fetchUserProducts,
    clearCurrentUser, 
    clearError 
  } = usePublicUserStore();
  
  const { user: currentAuthUser } = useAuthStore();

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
      fetchUserProducts(userId);
    }

    return () => {
      clearCurrentUser();
      clearError();
    };
  }, [userId, fetchUser, fetchUserProducts, clearCurrentUser, clearError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'seller':
        return 'Người bán';
      case 'user':
      default:
        return 'Người dùng';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'seller':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Đang tải thông tin người dùng...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-600 text-lg font-semibold mb-4">
                {error === 'User not found' ? 
                  'Người dùng không tồn tại' : 
                  'Có lỗi xảy ra khi tải thông tin người dùng'
                }
              </div>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => router.back()}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-gray-600 text-lg mb-4">Người dùng không tồn tại</div>
              <Button 
                onClick={() => router.back()}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()}
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-2xl font-bold">{currentUser.name}</CardTitle>
                    <Badge className={getRoleColor(currentUser.role)}>
                      {getRoleLabel(currentUser.role)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{currentUser.email}</span>
                    </div>
                    {currentUser.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{currentUser.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{currentUser.rating || 0} / 5</span>
                      <span className="text-gray-600 ml-1">
                        ({currentUser.ratingCount || 0} đánh giá)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-500" />
                      <span>{currentUser.favorites?.length || 0} yêu thích</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions for other users */}
                {currentAuthUser && currentAuthUser._id !== currentUser._id && (
                  <div className="flex flex-col gap-2">
                    <SendMessageButton
                      receiverId={currentUser._id}
                      receiverName={currentUser.name}
                      variant="default"
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Bio */}
          {currentUser.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Giới thiệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {currentUser.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3"> 
                  <div>
                    <span className="font-medium text-gray-700">Số sản phẩm yêu thích:</span>
                    <span className="ml-2">{currentUser.favorites?.length || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Đánh giá:</span>
                    <span className="ml-2">{currentUser.rating || 0} / 5 ({currentUser.ratingCount || 0} lượt)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Ngày tham gia:</span>
                    <span className="ml-2">{formatDate(currentUser.createdAt)}</span>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Cập nhật lần cuối:</span>
                    <span className="ml-2">{formatDate(currentUser.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ngày tham gia:</span>
                  <span>{formatDate(currentUser.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Cập nhật lần cuối:</span>
                  <span>{formatDate(currentUser.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentAuthUser && currentAuthUser._id !== currentUser._id && (
            <>
              <RatingForm 
                userId={currentUser._id} 
                userName={currentUser.name}
                onRatingSuccess={() => {
                  fetchUser(userId);
                }}
              />
              
              {/* Report User Button */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-end">
                    <ReportUserButton
                      userId={currentUser._id}
                      userName={currentUser.name}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <UserRatingsList 
            userId={currentUser._id} 
            userName={currentUser.name}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sản phẩm đang bán</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProductsGrid
                products={currentUserProducts}
                isLoading={isLoadingProducts}
                error={productsError}
                userName={currentUser.name}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 