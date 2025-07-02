"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Heart,
  Eye,
  Calendar,
  Package,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuthStore } from "@/store/authStore";
import { FavoriteProduct } from "@/services/favorites.service";
import { formatPrice, getStatusColor, getConditionColor, formatDate } from '@/lib/utils';
import { getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';

// Utility function to strip HTML tags from text
const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// Product Card Component
interface ProductCardProps {
  product: FavoriteProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div 
      key={product._id}
      className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-16 w-16" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(product.status)}>
              {getStatusLabel(product.status)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="text-xl font-bold text-green-600 mb-3">
            {formatPrice(product.price)}
          </div>

          {/* Category and Condition */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(product.category)}
            </Badge>
            <Badge className={`text-xs ${getConditionColor(product.condition)}`}>
              {getConditionLabel(product.condition)}
            </Badge>
          </div>

          {/* Description Preview - Fixed height to maintain consistency */}
          <div className="h-10 mb-3">
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {stripHtmlTags(product.description)}
              </p>
            )}
          </div>

          {/* Seller Info */}
          <div className="mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{product.seller.name}</span>
            </div>
          </div>

          {/* Stats - Push to bottom */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center space-x-4">
              {product.views !== undefined && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{product.views}</span>
                </div>
              )}
              {product.favorites !== undefined && (
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{product.favorites}</span>
                </div>
              )}
            </div>
            
            {product.createdAt && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate.short(product.createdAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </div>
  );
};

// Main User Favorites List Component
export const UserFavoritesList: React.FC = () => {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { 
    favoriteProductsData, 
    isLoading, 
    error, 
    loadFavorites, 
    clearError 
  } = useFavoritesStore();

  // Load favorites when component mounts or when authentication changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadFavorites(token);
    }
  }, [isAuthenticated, token, loadFavorites]);

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Bạn không có quyền truy cập danh sách yêu thích", {
        description: "Vui lòng đăng nhập để xem danh sách yêu thích",
        action: {
          label: "Đăng nhập",
          onClick: () => router.push("/auth/login"),
        },
      });
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleRefresh = async () => {
    if (!token) return;
    clearError();
    await loadFavorites(token);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 animate-pulse shadow-lg">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Đang tải danh sách yêu thích...
            </h2>
            <p className="text-lg text-gray-600 max-w-md text-center">
              Vui lòng đợi trong khi chúng tôi tải các sản phẩm yêu thích của bạn
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state handling different error types
  if (error) {
    const isUnauthorized = error === "Unauthorized";
    const isUserNotFound = error === "User not found";

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-center max-w-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {isUnauthorized ? "Không có quyền truy cập" : isUserNotFound ? "Không tìm thấy người dùng" : "Lỗi tải danh sách"}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {isUnauthorized
                  ? "Vui lòng đăng nhập để xem danh sách yêu thích của bạn"
                  : isUserNotFound
                  ? "Không thể tìm thấy tài khoản người dùng của bạn. Vui lòng thử lại"
                  : "Có lỗi xảy ra khi tải danh sách sản phẩm yêu thích. Vui lòng thử lại"}
              </p>
              <div className="flex gap-4 justify-center">
                {isUnauthorized ? (
                  <Button 
                    onClick={() => router.push("/auth/login")}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Đi tới đăng nhập
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRefresh} 
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Thử lại
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!favoriteProductsData || favoriteProductsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div className="text-center max-w-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Chưa có sản phẩm yêu thích</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. 
                Hãy khám phá và thêm những sản phẩm bạn thích!
              </p>
              <Button 
                onClick={() => router.push("/products")}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Khám phá sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - display products
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Sản phẩm yêu thích
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                <span className="font-semibold text-indigo-600">{favoriteProductsData.length}</span> sản phẩm trong danh sách yêu thích của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProductsData.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserFavoritesList; 