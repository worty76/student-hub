'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicUserStore } from '@/store/publicUserStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, User, MapPin, Star, Heart, Calendar, Mail, Package, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import UserProductsGrid from './UserProductsGrid';
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
        return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800';
      case 'seller':
        return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800';
      case 'user':
      default:
        return 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white hover:from-indigo-500 hover:to-purple-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Đang tải thông tin người dùng...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-red-500 text-lg font-semibold mb-4">
                  {error === 'User not found' ? 
                    'Người dùng không tồn tại' : 
                    'Có lỗi xảy ra khi tải thông tin người dùng'
                  }
                </div>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button 
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-gray-600 text-lg mb-4">Người dùng không tồn tại</div>
                <Button 
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="mb-6">
            <Button 
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-purple-700 border border-purple-200 shadow-md" 
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0 ring-4 ring-white/30">
                      {currentUser.avatar ? (
                        <Image
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-12 w-12 text-white/70" />
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h1 className="text-2xl font-bold text-white">{currentUser.name}</h1>
                        <Badge className={getRoleColor(currentUser.role)}>
                          {getRoleLabel(currentUser.role)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-white/90">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{currentUser.email}</span>
                        </div>
                        {currentUser.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{currentUser.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Tham gia {formatDate(currentUser.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {currentAuthUser && currentAuthUser._id !== currentUser._id && (
                      <div className="flex flex-col gap-2">
                        <SendMessageButton
                          receiverId={currentUser._id}
                          receiverName={currentUser.name}
                          variant="outline"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rating Card */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Đánh giá</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentUser.rating || 0}/5
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentUser.ratingCount || 0} lượt
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorites Card */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Yêu thích</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentUser.favorites?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">sản phẩm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Products Card */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sản phẩm</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentUserProducts?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">đang bán</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Sản phẩm đang bán
                  </CardTitle>
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

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* User Details Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Đánh giá:</span>
                      <span className="font-medium">{currentUser.rating || 0}/5</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ngày tham gia:</span>
                      <span className="font-medium">{formatDate(currentUser.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Cập nhật:</span>
                      <span className="font-medium">{formatDate(currentUser.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
              {/* Bio Card */}
              {currentUser.bio && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Giới thiệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {currentUser.bio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
                                    {/* Interaction Section for Other Users */}
              {currentAuthUser && currentAuthUser._id !== currentUser._id && (
                <div className='mt-12'>
                  {/* Rating Form */}
                      <RatingForm 
                        userId={currentUser._id} 
                        userName={currentUser.name}
                        onRatingSuccess={() => {
                          fetchUser(userId);
                        }}
                      />
                      <div className='mt-6'>

                                        <UserRatingsList 
                    userId={currentUser._id} 
                    userName={currentUser.name}
                  />
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
} 