'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { Product as MarketplaceProduct } from '@/types/marketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2, ShoppingBag, Eye, Heart, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';

interface SuggestedListingsProps {
  products?: MarketplaceProduct[];
}

export function SuggestedListings({ products: initialProducts }: SuggestedListingsProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestedProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allProducts = await ProductService.getAllProducts();
      
      const productsWithLocation = allProducts.filter(product => 
        product.location && product.location.trim() !== ''
      );
      
      let sortedProducts = productsWithLocation;
      if (user?.location) {
        sortedProducts = productsWithLocation.sort((a, b) => {
          const aMatchesUserLocation = a.location.toLowerCase().includes(user.location.toLowerCase());
          const bMatchesUserLocation = b.location.toLowerCase().includes(user.location.toLowerCase());
          
          if (aMatchesUserLocation && !bMatchesUserLocation) return -1;
          if (!aMatchesUserLocation && bMatchesUserLocation) return 1;
          return 0;
        });
      }
      
      // Limit to first 8 products for suggested listings
      setProducts(sortedProducts.slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [user?.location]);

  useEffect(() => {
    if (initialProducts) {
      // Convert marketplace products to product format and set them
      const convertedProducts: Product[] = initialProducts.map(product => ({
        _id: product.id,
        title: product.title,
        price: product.price,
        images: [product.image],
        location: product.location,
        status: 'available' as const,
        category: product.category,
        description: product.description || '',
        seller: product.seller.id,
        createdAt: product.createdAt.toISOString(),
        condition: product.condition,
        views: Math.floor(Math.random() * 100),
        favorites: Math.floor(Math.random() * 20)
      }));
      setProducts(convertedProducts.slice(0, 8));
    } else if (isAuthenticated && user) {
      fetchSuggestedProducts();
    }
  }, [isAuthenticated, user, initialProducts, fetchSuggestedProducts]);

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

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 max-w-lg mx-auto">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Khám phá danh sách cá nhân hóa
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Đăng nhập để xem gợi ý sản phẩm dựa trên vị trí và sở thích của bạn
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Đăng nhập để tiếp tục
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Gợi ý cho bạn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {user?.location ? (
              <>Tìm các sản phẩm hoàn hảo gần bạn tại <span className="font-semibold text-gray-800">{user.location}</span></>
            ) : (
              <>Khám phá các sản phẩm cũ chất lượng từ người bán uy tín</>
            )}
          </p>
        </div>
        
        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đang tìm kiếm sản phẩm phù hợp...</h3>
              <p className="text-gray-600">Dựa trên vị trí của bạn</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-8 bg-red-100 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Không thể tải sản phẩm
              </h3>
              <p className="text-red-600 mb-8 max-w-md mx-auto text-lg">{error}</p>
              <Button 
                onClick={fetchSuggestedProducts} 
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Thử lại
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-8 bg-gray-100 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Chúng tôi chưa tìm thấy sản phẩm nào có thông tin vị trí trong khu vực của bạn.
              </p>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-3 shadow-sm hover:shadow-md transition-all duration-300">
                  Xem tất cả sản phẩm
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
                
                return (
                  <div 
                    key={product._id}
                    className="hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm"
                  >
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

                        {/* Description Preview */}
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-3 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

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
                      </CardContent>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/products">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Xem tất cả sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
}