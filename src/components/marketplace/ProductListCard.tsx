import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, getCategoryLabel, getConditionLabel, getStatusLabel, Seller } from '@/types/product';
import { MapPin, Eye, Heart, Calendar, User2 } from 'lucide-react';
import { formatPrice, getStatusColor, getConditionColor, formatDate } from '@/lib/utils';

// Utility function to strip HTML tags from text
const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

interface ProductListCardProps {
  product: Product;
  className?: string;
}

export function ProductListCard({ product, className }: ProductListCardProps) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const getSellerName = (seller: string | Seller): string => {
    if (typeof seller === 'string') {
      return seller;
    }
    return seller.name;
  };

  return (
    <div className={`flex flex-col h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
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
            {product.seller ? (
              <div className="flex items-center text-sm text-gray-600">
                <User2 className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{getSellerName(product.seller)}</span>
              </div>
            ) : (
              <div className="h-5"></div>
            )}
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
} 