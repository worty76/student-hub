"use client";

import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  RefreshCw,
  Mail,
  MapPin,
  Star,
  User,
  Calendar,
  AlertCircle,
  Crown,
  Heart,
  Sparkles,
  User2,
} from "lucide-react";
import Link from "next/link";

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
    clearError,
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
        description:
          error instanceof Error ? error.message : "Lỗi khi cập nhật hồ sơ",
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
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20 blur"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Chưa đăng nhập</h3>
            <p className="text-muted-foreground">
              Vui lòng đăng nhập để xem hồ sơ của bạn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-20 blur"></div>
            </div>
            <h3 className="font-semibold text-destructive mb-2 text-lg">
              Lỗi khi tải hồ sơ
            </h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
              <Button onClick={handleClearError} variant="outline">
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Hồ sơ của bạn
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200"
          >
            <Link href={`/users/${displayUser?._id}`} className="flex items-center">
              <User2
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Trang cá nhân người dùng
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading && !displayUser ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30 blur animate-pulse"></div>
              </div>
              <p className="text-muted-foreground">Đang tải hồ sơ...</p>
            </div>
          </div>
        ) : displayUser ? (
          <div className="space-y-8">
            {/* Enhanced Avatar and Basic Info */}
            <div className="flex items-start gap-6">
              <div className="relative group">
                {displayUser.avatar ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-xl group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                    {displayUser.name}
                  </h2>
                  <Badge
                    variant={
                      displayUser.role === "admin" ? "default" : "secondary"
                    }
                    className={`${
                      displayUser.role === "admin"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300"
                    } font-medium`}
                  >
                    {displayUser.role === "admin" && (
                      <Crown className="h-3 w-3 mr-1" />
                    )}
                    {displayUser.role === "user" ? "Người dùng" : "Admin"}
                  </Badge>
                </div>

                <div className="flex items-center text-muted-foreground group hover:text-blue-600 transition-colors duration-200">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="truncate font-medium">
                    {displayUser.email}
                  </span>
                </div>

                {displayUser.rating > 0 && (
                  <div className="flex items-center text-muted-foreground group">
                    <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 mr-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                    </div>
                    <span className="font-medium">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        {displayUser.rating.toFixed(1)}
                      </span>
                      <span className="text-sm ml-1">
                        ({displayUser.ratingCount} đánh giá)
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Bio Section */}
            {displayUser.bio && (
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Giới thiệu
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {displayUser.bio}
                </p>
              </div>
            )}

            {/* Enhanced Location Section */}
            {displayUser.location && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  Địa chỉ
                </h3>
                <div className="flex items-center text-muted-foreground">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-3">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="font-medium">{displayUser.location}</span>
                </div>
              </div>
            )}

            {/* Enhanced Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Ngày tham gia
                </h4>
                <p className="text-muted-foreground font-medium">
                  {new Date(displayUser.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {displayUser.favorites && displayUser.favorites.length > 0 && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-pink-100 dark:border-pink-800/30">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Sản phẩm Yêu thích
                  </h4>
                  <p className="text-muted-foreground font-medium">
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                      {displayUser.favorites.length}
                    </span>
                    <span className="ml-1">sản phẩm</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20 blur"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Không có dữ liệu</h3>
              <p className="text-muted-foreground">
                Không có dữ liệu hồ sơ để hiển thị
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
