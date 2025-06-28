'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User } from 'lucide-react';
import { Product } from '@/types/marketplace';
import { getStatusLabel } from '@/constants/marketplace-data';
import { formatPrice, getConditionTextColor, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get status color from utils (but we need to map marketplace status to general status)
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'newly-posted':
        return 'bg-blue-100 text-blue-800';
      case 'good-price':
        return 'bg-green-100 text-green-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-md">
      <div className="relative">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
              {getStatusLabel(product.status)}
            </span>
          </div>

          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium bg-white rounded-full ${getConditionTextColor(product.condition)}`}>
              {product.condition.replace('-', ' ')}
            </span>
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Link href={`/products/${product.id}`}>
              <Button 
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white text-gray-900 hover:bg-gray-100"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {formatPrice(product.price)}
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Location and Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{product.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeAgo(product.createdAt)}</span>
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">{product.seller.name}</span>
          </div>
          
          <Link href={`/products/${product.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 