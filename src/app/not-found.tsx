'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ShoppingBag, 
  ArrowLeft, 
  BookOpen, 
  Compass,
  Star
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Hero Section */}
        <div className="mb-12">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main 404 text */}
            <div className="relative z-10">
              <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4 leading-none">
                404
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
                  Trang không tìm thấy
                </h2>
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Oops! Có vẻ như trang bạn đang tìm kiếm đã biến mất rồi. 
            Có thể nó đã được &quot;bán&quot; hoặc chuyển đến một địa chỉ mới! 📚
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Khám phá sản phẩm
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Tìm kiếm những món đồ tuyệt vời từ sinh viên khác
              </p>
              <Link href="/products">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Xem sản phẩm
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sản phẩm yêu thích
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Xem lại những món đồ bạn đã quan tâm
              </p>
              <Link href="/favorites">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  Yêu thích
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Compass className="h-5 w-5 text-blue-600" />
            Danh mục phổ biến
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Sách giáo khoa', emoji: '📚' },
              { name: 'Đồ điện tử', emoji: '💻' },
              { name: 'Quần áo', emoji: '👕' },
              { name: 'Đồ gia dụng', emoji: '🏠' },
              { name: 'Xe đạp', emoji: '🚲' },
              { name: 'Đồ thể thao', emoji: '⚽' }
            ].map((category, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="px-4 py-2 text-sm bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </Button>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Nếu bạn cho rằng đây là lỗi, vui lòng{' '}
            <Link href="/about" className="text-blue-600 hover:text-blue-800 underline">
              liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 