'use client';

import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Mail, MapPin, Star, User, Calendar, AlertCircle } from 'lucide-react';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { 
    displayUser, 
    isLoading, 
    error, 
    isAuthenticated, 
    refetchProfile, 
    clearError 
  } = useUserProfile();
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      await refetchProfile();
      toast({
        title: "Hồ sơ đã được cập nhật",
        description: "Hồ sơ của bạn đã được cập nhật thành công.",
      });
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật hồ sơ",
        description: error instanceof Error ? error.message : "Lỗi khi cập nhật hồ sơ",
        variant: "destructive",
      });
    }
  };

  const handleClearError = () => {
    clearError();
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Vui lòng đăng nhập để xem hồ sơ của bạn</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="font-semibold text-destructive mb-2">Lỗi khi tải hồ sơ</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
              <Button onClick={handleClearError} variant="ghost" size="sm">
                Bỏ qua
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Hồ sơ của bạn</CardTitle>
        <CardAction>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Cập nhật
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading && !displayUser ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Đang tải hồ sơ...</p>
            </div>
          </div>
        ) : displayUser ? (
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-4">
              <div className="relative">
                {displayUser.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="h-20 w-20 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold truncate">{displayUser.name}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {displayUser.role === 'user' ? 'Người dùng' : 'Admin'}
                  </Badge>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-2">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{displayUser.email}</span>
                </div>
                
                {displayUser.rating > 0 && (
                  <div className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    <span>
                      {displayUser.rating.toFixed(1)} ({displayUser.ratingCount} đánh giá)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {displayUser.bio && (
              <div>
                <h3 className="font-semibold mb-2">Giới thiệu</h3>
                <p className="text-muted-foreground">{displayUser.bio}</p>
              </div>
            )}

            {/* Location */}
            {displayUser.location && (
                <div>
                    <h3 className="font-semibold mb-2">Địa chỉ</h3>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{displayUser.location}</span>
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium mb-1">Ngày tham gia</h4>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(displayUser.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
              
              {displayUser.favorites && displayUser.favorites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1">Sản phẩm Yêu thích</h4>
                  <p className="text-muted-foreground">
                    {displayUser.favorites.length} sản phẩm
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không có dữ liệu hồ sơ</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 