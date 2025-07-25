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
  Tag
} from 'lucide-react';
import { 
  ProductFavoriteButton,
  BuyProductButton,
  PurchaseWithVNPayButton,
  ProductComments,
  ReportProductButton
} from '@/components/product';
import { formatDate, formatPrice, getStatusColor, getConditionColor } from '@/lib/utils';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                </div>
                <span className="text-xl font-semibold text-gray-700">Đang tải thông tin sản phẩm...</span>
                <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-4">
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <div className="text-red-600 text-2xl font-bold mb-4">
                  {error.includes('404') || error.includes('không tồn tại') ? 
                    'Sản phẩm không tồn tại' : 
                    'Có lỗi xảy ra khi tải sản phẩm'
                  }
                </div>
                <p className="text-gray-600 mb-8 text-lg">{error}</p>
                <Button 
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 p-4">
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <div className="text-gray-600 text-2xl font-bold mb-8">Sản phẩm không tồn tại</div>
                <Button 
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="mb-4">
            <Button 
              onClick={() => router.back()}
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 font-medium px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Image Carousel */}
            <div className="space-y-3">
              <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
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
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Navigation buttons */}
                        {currentProduct.images.length > 1 && (
                          <>
                            <Button
                              size="sm"
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 text-gray-700 w-8 h-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={handlePreviousImage}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 text-gray-700 w-8 h-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={handleNextImage}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            
                            {/* Image counter */}
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                              {currentImageIndex + 1} / {currentProduct.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center">
                          <Package className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail images */}
              {currentProduct.images && currentProduct.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {currentProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                        index === currentImageIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
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

              {/* Description - moved here below images */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-500" />
                    Mô tả sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-700 leading-relaxed text-base prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Product Information */}
            <div className="space-y-3">
              {/* Title and Price */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2 text-gray-800 leading-tight">
                        {currentProduct.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={`${getStatusColor(currentProduct.status)} px-2 py-1 text-xs font-medium rounded-full`}>
                          {getStatusLabel(currentProduct.status)}
                        </Badge>
                        <Badge className={`${getConditionColor(currentProduct.condition)} px-2 py-1 text-xs font-medium rounded-full`}>
                          {getConditionLabel(currentProduct.condition)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl shadow-md">
                    <div className="text-2xl font-bold flex items-center">
                      {formatPrice(currentProduct.price)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    {currentProduct.views !== undefined && (
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                        <Eye className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="font-medium text-xs">{currentProduct.views} lượt xem</span>
                      </div>
                    )}
                    {currentProduct.favorites !== undefined && (
                      <div className="flex items-center bg-pink-50 px-2 py-1 rounded-full">
                        <Heart className="h-3 w-3 mr-1 text-pink-500" />
                        <span className="font-medium text-xs">{currentProduct.favorites} yêu thích</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-purple-500" />
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Tag className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-700">Danh mục:</span>
                        <span className="ml-1 text-sm text-gray-600">{getCategoryLabel(currentProduct.category)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-700">Địa điểm:</span>
                        <span className="ml-1 text-sm text-gray-600">{currentProduct.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-700">Người bán:</span>
                        <span className="ml-1 text-sm text-gray-600">{typeof currentProduct.seller === 'object' ? currentProduct.seller.name : currentProduct.seller}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                    Thời gian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-700">Ngày đăng:</span>
                        <span className="ml-1 text-sm text-gray-600">{formatDate.dateTime(currentProduct.createdAt || '')}</span>
                      </div>
                    </div>
                    
                    {currentProduct.updatedAt && currentProduct.updatedAt !== currentProduct.createdAt && (
                      <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-700">Cập nhật lần cuối:</span>
                          <span className="ml-1 text-sm text-gray-600">{formatDate.dateTime(currentProduct.updatedAt || '')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-4">
                    {/* Secondary actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Buy Button - Primary action */}
                      <BuyProductButton
                        productId={currentProduct._id}
                        productTitle={currentProduct.title}
                        price={currentProduct.price}
                        isAvailable={currentProduct.status === 'available'}
                        sellerName={typeof currentProduct.seller === 'object' ? currentProduct.seller.name :  currentProduct.seller}
                        className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0'
                      />
                      {/* MoMo Button - Alternative payment method */}
                      <PurchaseWithVNPayButton
                        productId={currentProduct._id}
                        className='bg-gradient-to-r from-[#0066b3] to-[#004c99] hover:from-[#004c99] hover:to-[#003b85] hover:shadow-xl transition-all duration-300 border-0'
                      />
                      <Button 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium hover:shadow-lg transition-all duration-300 px-3" 
                        size="lg"
                        onClick={handleViewSellerProfile}
                      >
                        <User className="h-3 w-3 mr-1" />
                        Xem trang người bán
                      </Button>
                      <ProductFavoriteButton 
                        productId={currentProduct._id} 
                        className="shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                      <ReportProductButton
                        productId={currentProduct._id}
                        productTitle={currentProduct.title}
                        className='bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 hover:text-white'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-0 p-4">
              <ProductComments productId={currentProduct._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 