'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Heart, 
  Eye, 
  MapPin, 
  Calendar, 
  Package, 
  AlertCircle,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import useFavorites from '@/hooks/useFavorites';
import { FavoriteProduct } from '@/services/favorites.service';
import { CompactProductFavoriteButton } from './ProductFavoriteButton';
import { formatPrice, getStatusColor, getConditionColor } from '@/lib/utils';

// Helper functions for formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getCategoryLabel = (category: string) => {
  const categories = {
    'books': 'Books',
    'electronics': 'Electronics',
    'clothing': 'Clothing',
    'furniture': 'Furniture',
    'sports': 'Sports',
    'other': 'Other'
  };
  return categories[category as keyof typeof categories] || category;
};

const getConditionLabel = (condition: string) => {
  const conditions = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor'
  };
  return conditions[condition as keyof typeof conditions] || condition;
};

const getStatusLabel = (status: string) => {
  const statuses = {
    'available': 'Available',
    'sold': 'Sold',
    'pending': 'Pending'
  };
  return statuses[status as keyof typeof statuses] || status;
};

// Product Card Component for mobile/responsive view
function ProductCard({ product }: { product: FavoriteProduct }) {
  const router = useRouter();

  const handleViewProduct = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <CompactProductFavoriteButton productId={product._id} />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Price */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
              {product.title}
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Status and Condition */}
          <div className="flex gap-2">
            <Badge className={getStatusColor(product.status)}>
              {getStatusLabel(product.status)}
            </Badge>
            <Badge className={getConditionColor(product.condition)}>
              {getConditionLabel(product.condition)}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {product.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{getCategoryLabel(product.category)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{product.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{product.favorites} favorites</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleViewProduct}
            className="w-full"
            variant="outline"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main FavoritesList Component
export function FavoritesList() {
  const router = useRouter();
  const {
    favoriteProductsData,
    isLoading,
    error,
    isAuthenticated,
    refreshFavorites,
    clearError
  } = useFavorites();

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Unauthorized', {
        description: 'Please log in to view your favorites',
        action: {
          label: 'Login',
          onClick: () => router.push('/auth/login'),
        },
      });
    }
  }, [isAuthenticated, router]);



  const handleRefresh = async () => {
    clearError();
    await refreshFavorites();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Loading your favorites...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your favorite products</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {error === 'Unauthorized' ? 'Unauthorized' : 
                   error === 'User not found' ? 'User Not Found' : 
                   'Error Loading Favorites'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error === 'Unauthorized' ? 'Please log in to view your favorites' :
                   error === 'User not found' ? 'Unable to find your user account' :
                   'There was an error loading your favorite products'}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                {error === 'Unauthorized' ? (
                  <Button onClick={() => router.push('/auth/login')}>
                    Go to Login
                  </Button>
                ) : (
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!favoriteProductsData || favoriteProductsData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t added any products to your favorites list yet. 
                  Start exploring and add products you like!
                </p>
              </div>
              <Button onClick={() => router.push('/marketplace')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favoriteProductsData.length} product{favoriteProductsData.length !== 1 ? 's' : ''} in your favorites
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProductsData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesList; 