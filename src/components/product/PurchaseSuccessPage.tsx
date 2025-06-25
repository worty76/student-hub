'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Package } from 'lucide-react';

interface PurchaseSuccessPageProps {
  productTitle?: string;
  message?: string;
}

export default function PurchaseSuccessPage({ 
  productTitle, 
  message = "Việc mua hàng của bạn đã hoàn tất thành công!" 
}: PurchaseSuccessPageProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleViewProducts = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Mua hàng thành công!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-700">{message}</p>
            {productTitle && (
              <p className="text-gray-600">
                Sản phẩm: <span className="font-semibold">{productTitle}</span>
              </p>
            )}
          </div>
          
          <div className="flex space-x-3 justify-center">
            <Button onClick={handleGoHome} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Trở về trang chủ
            </Button>
            <Button onClick={handleViewProducts}>
              <Package className="h-4 w-4 mr-2" />
              Xem thêm sản phẩm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 