'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Heart, MapPin, Calendar, DollarSign, Package } from 'lucide-react';
import { getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';
import Image from 'next/image';

interface UserProductsGridProps {
  products: Product[] | null;
  isLoading: boolean;
  error: string | null;
  userName: string;
}

export default function UserProductsGrid({ products, isLoading, error, userName }: UserProductsGridProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'sold':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'like-new':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'fair':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'poor':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Đang tải sản phẩm...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-4">
              Có lỗi xảy ra khi tải sản phẩm
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600 text-lg mb-2">
              {userName} chưa có sản phẩm nào
            </div>
            <p className="text-gray-500">
              Người dùng này chưa đăng bán sản phẩm nào.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Sản phẩm của {userName} ({products.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product._id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProductClick(product._id)}
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge className={getStatusColor(product.status)}>
                  {getStatusLabel(product.status)}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {product.title}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getConditionColor(product.condition)}>
                    {getConditionLabel(product.condition)}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryLabel(product.category)}
                  </Badge>
                </div>

                <div className="text-2xl font-bold text-green-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {formatPrice(product.price)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-3">
                {truncateDescription(product.description)}
              </p>

              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  {typeof product.views !== 'undefined' && (
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{product.views}</span>
                    </div>
                  )}
                  {typeof product.favorites !== 'undefined' && (
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{product.favorites}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(product.createdAt || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 