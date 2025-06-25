'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useProductStore } from '@/store/productStore';
import { getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Package, 
  User, 
  Heart, 
  Eye, 
  Tag, 
  DollarSign
} from 'lucide-react';
import { ProductFavoriteButton } from './ProductFavoriteButton';
import ProductComments from './ProductComments';
import BuyProductButton from './BuyProductButton';
import ReportProductButton from './ReportProductButton';
import { formatDate } from '@/lib/utils';

interface ProductDetailsProps {
  productId?: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const router = useRouter();
  const params = useParams();
  const id = productId || params?.id as string;

  const {
    currentProduct,
    isLoading,
    error,
    loadProduct,
    clearError,
    clearCurrentProduct
  } = useProductStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }

    return () => {
      clearCurrentProduct();
      clearError();
    };
  }, [id, loadProduct, clearCurrentProduct, clearError]);

  const handlePreviousImage = () => {
    if (currentProduct?.images && currentProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (currentProduct?.images && currentProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === currentProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleViewSellerProfile = () => {
    if (currentProduct?.seller) {
      let sellerId: string;
      
      // Handle both string and object seller types
      if (typeof currentProduct.seller === 'string') {
        sellerId = currentProduct.seller;
      } else {
        sellerId = currentProduct.seller._id;
      }
      
      router.push(`/users/${sellerId}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return formatDate.dateTime(dateString);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Đang tải thông tin sản phẩm...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-600 text-lg font-semibold mb-4">
                {error.includes('404') || error.includes('không tồn tại') ? 
                  'Sản phẩm không tồn tại' : 
                  'Có lỗi xảy ra khi tải sản phẩm'
                }
              </div>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => router.back()}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-gray-600 text-lg mb-4">Sản phẩm không tồn tại</div>
              <Button 
                onClick={() => router.back()}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()}
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-100">
                  {currentProduct.images && currentProduct.images.length > 0 ? (
                    <>
                      <Image
                        src={currentProduct.images[currentImageIndex]}
                        alt={`${currentProduct.title} - Hình ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        onLoad={() => setImageLoading(false)}
                        onLoadStart={() => setImageLoading(true)}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      )}
                      
                      {/* Navigation buttons */}
                      {currentProduct.images.length > 1 && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={handlePreviousImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={handleNextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          
                          {/* Image counter */}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {currentImageIndex + 1} / {currentProduct.images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail images */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {currentProduct.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${currentProduct.title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-2">
                      {currentProduct.title}
                    </CardTitle>
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge className={getStatusColor(currentProduct.status)}>
                        {getStatusLabel(currentProduct.status)}
                      </Badge>
                      <Badge className={getConditionColor(currentProduct.condition)}>
                        {getConditionLabel(currentProduct.condition)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 flex items-center">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {formatPrice(currentProduct.price)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {currentProduct.views !== undefined && (
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{currentProduct.views} lượt xem</span>
                    </div>
                  )}
                  {currentProduct.favorites !== undefined && (
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{currentProduct.favorites} yêu thích</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {currentProduct.description}
                </p>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Danh mục:</span>
                    <span>{getCategoryLabel(currentProduct.category)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Địa điểm:</span>
                    <span>{currentProduct.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Người bán:</span>
                    <span>{typeof currentProduct.seller === 'object' ? currentProduct.seller.name : currentProduct.seller}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Ngày đăng:</span>
                    <span>{formatDateDisplay(currentProduct.createdAt)}</span>
                  </div>
                  
                  {currentProduct.updatedAt && currentProduct.updatedAt !== currentProduct.createdAt && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Cập nhật lần cuối:</span>
                      <span>{formatDateDisplay(currentProduct.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Buy Button - Primary action */}
                  <BuyProductButton
                    productId={currentProduct._id}
                    productTitle={currentProduct.title}
                    price={currentProduct.price}
                    isAvailable={currentProduct.status === 'available'}
                    sellerName={typeof currentProduct.seller === 'object' ? currentProduct.seller.name : currentProduct.seller}
                  />
                  
                  {/* Secondary actions */}
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 cursor-pointer" 
                      size="lg"
                      variant="outline"
                      onClick={handleViewSellerProfile}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Xem trang cá nhân người bán
                    </Button>
                    <ProductFavoriteButton 
                      productId={currentProduct._id} 
                      className="flex-1"
                    />
                  </div>
                  
                  {/* Report action */}
                  {/* <div className="flex justify-end"> */}
                    <ReportProductButton
                      productId={currentProduct._id}
                      productTitle={currentProduct.title}
                    />
                  </div>
                {/* </div> */}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <ProductComments productId={currentProduct._id} />
        </div>
      </div>
    </div>
  );
} 