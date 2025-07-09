'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Heart, MapPin, Calendar, Package, User2 } from 'lucide-react';
import { getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';
import { formatPrice, getStatusColor, getConditionColor, formatDate } from '@/lib/utils';
import Image from 'next/image';

const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

interface UserProductsGridProps {
  products: Product[] | null;
  isLoading: boolean;
  error: string | null;
  userName: string;
}

export default function UserProductsGrid({ products, isLoading, error, userName }: UserProductsGridProps) {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-gray-600">Đang tải sản phẩm...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8 text-center">
          <div className="text-red-600 font-semibold mb-2">
            Có lỗi xảy ra khi tải sản phẩm
          </div>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-600 font-medium mb-2">
            {userName} chưa có sản phẩm nào
          </div>
          <p className="text-gray-500 text-sm">
            Người dùng này chưa đăng bán sản phẩm nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Sản phẩm của {userName} ({products.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            {/* Product Image */}
            <div className="aspect-square relative bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">Không có hình ảnh</span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(product.status)}>
                  {getStatusLabel(product.status)}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
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

              {/* Location */}
              <div className="mb-3">
                {product.location ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{product.location}</span>
                  </div>
                ) : (
                  <div className="h-5"></div>
                )}
              </div>

              {/* Seller */}
              <div className="mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User2 className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{userName}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 