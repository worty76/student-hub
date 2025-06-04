'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  MessageCircle, 
  Phone, 
  ShoppingCart,
  Eye,
  Shield,
  Truck,
  Clock,
  ThumbsUp,
  Flag,
  ChevronLeft,
  ChevronRight,
  Verified,
  DollarSign,
  Send
} from 'lucide-react';
import { ProductDetail } from '@/types/product';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { SellerProfile } from '@/components/product/SellerProfile';
import { BargainModal } from '@/components/product/BargainModal';

// Mock product data
const mockProduct: ProductDetail = {
  id: 'P001',
  title: 'Advanced Calculus Textbook - 10th Edition',
  description: `Comprehensive advanced calculus textbook in excellent condition. This book covers all major topics including:

  • Limits and Continuity
  • Derivatives and Applications
  • Integrals and Integration Techniques
  • Infinite Series and Sequences
  • Multivariable Calculus
  • Vector Analysis

  Perfect for undergraduate mathematics students. All pages are intact with minimal highlighting. Originally purchased for $180, selling due to graduation.

  Book includes:
  - Original access code (unused)
  - Student solutions manual
  - Quick reference card

  Smoke-free home. Serious inquiries only.`,
  price: 89.99,
  images: [
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600'
  ],
  category: 'textbooks',
  condition: 'like-new',
  location: 'Ho Chi Minh City, Vietnam',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  views: 245,
  likes: 18,
  isAvailable: true,
  specifications: {
    'Author': 'James Stewart',
    'Edition': '10th Edition',
    'Publisher': 'Cengage Learning',
    'ISBN': '978-1337275347',
    'Pages': '1368',
    'Language': 'English',
    'Publication Year': '2020'
  },
  seller: {
    id: 'S001',
    name: 'Nguyen Van Minh',
    avatar: '/api/placeholder/100/100',
    rating: 4.8,
    totalReviews: 127,
    responseRate: 95,
    memberSince: new Date('2022-03-15'),
    isVerified: true,
    isOnline: true
  },
  shipping: {
    methods: ['Standard Delivery', 'Express Delivery', 'Pickup'],
    cost: 15000,
    estimatedDays: 3
  },
  bargaining: {
    enabled: true,
    minPrice: 70,
    acceptsOffers: true
  }
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = mockProduct; // In real app, fetch by params.id

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'like-new': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <span>Home</span> / <span>Textbooks</span> / <span className="font-medium">{product.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-7">
            <ProductImageGallery 
              images={product.images}
              title={product.title}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <div className="flex space-x-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{product.likes} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition.replace('-', ' ').toUpperCase()}
                </Badge>
                {product.isAvailable && (
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                )}
              </div>
            </div>

            {/* Price and Bargaining */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatPrice(product.price)}
                    </div>
                    {product.bargaining.enabled && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Open to offers (Min: {formatPrice(product.bargaining.minPrice || 0)})</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 min-w-[3rem] text-center">{quantity}</span>
                      <button 
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    <Button size="lg" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now - {formatPrice(product.price * quantity)}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {product.bargaining.enabled && (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowBargainModal(true)}
                          className="flex-1"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Make Offer
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>

                    <Button variant="outline" size="lg" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Profile */}
            <SellerProfile seller={product.seller} />

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Shipping & Delivery</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Shipping Cost:</span>
                  <span className="font-medium">{formatPrice(product.shipping.cost / 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">{product.shipping.estimatedDays} days</span>
                </div>
                <div className="text-sm text-gray-600">
                  Available methods: {product.shipping.methods.join(', ')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Safety Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Meet in a public place</li>
                  <li>• Inspect item before payment</li>
                  <li>• Use secure payment methods</li>
                  <li>• Report suspicious activity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bargain Modal */}
        {showBargainModal && (
          <BargainModal
            product={product}
            onClose={() => setShowBargainModal(false)}
            onSubmit={(offer) => {
              console.log('Bargain offer:', offer);
              setShowBargainModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}