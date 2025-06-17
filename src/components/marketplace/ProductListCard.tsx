import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';
import { MapPin, Eye, Heart, Calendar } from 'lucide-react';

interface ProductListCardProps {
  product: Product;
  className?: string;
}

export function ProductListCard({ product, className }: ProductListCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
        return 'bg-blue-100 text-blue-800';
      case 'like-new':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <Link href={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
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

        <CardContent className="p-4">
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

          {/* Location */}
          {product.location && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{product.location}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
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
                <span>{formatDate(product.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {product.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
} 