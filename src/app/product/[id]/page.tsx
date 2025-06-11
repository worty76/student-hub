'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MapPin, 
  MessageCircle, 
  Phone, 
  ShoppingCart,
  Eye,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  Verified,
  DollarSign,
  ArrowLeft,
  MessageSquare,
  Star
} from 'lucide-react';
import { Product } from '@/types/marketplace';
import { mockProducts, formatPrice, getStatusColor, getStatusLabel } from '@/constants/marketplace-data';
import ReviewForm from '@/components/product/ReviewForm';
import StarRating from '@/components/product/StarRating';
import { useReviewForm } from '@/hooks/useReviewForm';

// Extended product details that would come from API
interface ExtendedProduct extends Product {
  images?: string[];
  views?: number;
  likes?: number;
  isAvailable?: boolean;
  specifications?: Record<string, string>;
  shipping?: {
    methods: string[];
    cost: number;
    estimatedDays: number;
  };
  bargaining?: {
    enabled: boolean;
    minPrice?: number;
    acceptsOffers: boolean;
  };
}

// Function to get extended product data (simulating API call)
const getExtendedProductData = (product: Product): ExtendedProduct => {
  return {
    ...product,
    images: product.image ? [product.image, product.image, product.image] : [],
    views: Math.floor(Math.random() * 500) + 50,
    likes: Math.floor(Math.random() * 50) + 5,
    isAvailable: true,
    specifications: getSpecificationsForCategory(product.category),
    shipping: {
      methods: ['Standard Delivery', 'Express Delivery', 'Pickup'],
      cost: 15000,
      estimatedDays: 3
    },
    bargaining: {
      enabled: product.status === 'urgent' || product.status === 'good-price',
      minPrice: Math.floor(product.price * 0.8),
      acceptsOffers: true
    }
  };
};

// Helper function to generate specifications based on category
const getSpecificationsForCategory = (category: string): Record<string, string> => {
  switch (category) {
    case 'study':
      return {
        'Condition': 'Good',
        'Type': 'Educational',
        'Academic Level': 'University',
        'Language': 'Vietnamese/English'
      };
    case 'household':
      return {
        'Material': 'Various',
        'Condition': 'Used',
        'Age': '1-2 years',
        'Warranty': 'No warranty'
      };
    case 'moving':
      return {
        'Bundle Type': 'Complete Set',
        'Items Included': 'Multiple items',
        'Condition': 'Mixed',
        'Urgency': 'High'
      };
    default:
      return {
        'Condition': 'Good',
        'Type': 'General'
      };
  }
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Find product by ID from mock data
  const baseProduct = mockProducts.find(p => p.id === id);
  
  if (!baseProduct) {
    notFound();
  }

  const product = getExtendedProductData(baseProduct);

  const { submitReview, isSubmitting, clearError } = useReviewForm({
    productId: id,
    onSuccess: () => {
      setShowReviewForm(false);
      // You could show a success toast here
      alert('Review submitted successfully!');
    }
  });

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const getConditionColor = (condition: string) => {
    return getStatusColor(condition as Product['status']);
  };

  const getConditionLabel = (condition: string) => {
    return condition.replace('-', ' ').toUpperCase();
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600">
            <span>Home</span> / <span>Products</span> / <span className="font-medium">{product.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <Image 
                      src={product.images[currentImageIndex]} 
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Navigation buttons */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Image indicators */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image 
                        src={image} 
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                  {getConditionLabel(product.condition)}
                </Badge>
                <Badge className={getStatusColor(product.status)}>
                  {getStatusLabel(product.status)}
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
                    {product.bargaining?.enabled && (
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
                      Contact Seller
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {product.bargaining?.enabled && (
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
                      Call {product.seller.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {product.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span>{product.seller.name}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Verified className="w-4 h-4 text-green-500" />
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response Rate:</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="font-medium">January 2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            {product.shipping && (
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
                    <span className="font-medium">{formatPrice(product.shipping.cost)}</span>
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
            )}
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
                  {product.description ? (
                    product.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">No description available.</p>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Posted:</span>
                    <span className="ml-2 font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="ml-2 font-medium capitalize">{product.condition.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{product.location}</span>
                  </div>
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

        {/* Bargain Modal Placeholder */}
        {showBargainModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-w-lg">
              <CardHeader>
                <CardTitle>Make an Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Offer</label>
                    <Input 
                      type="number" 
                      placeholder={`Min: ${formatPrice(product.bargaining?.minPrice || 0)}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                    <Input placeholder="Add a message to your offer..." />
                  </div>
                  <div className="flex space-x-3">
                    <Button className="flex-1">Submit Offer</Button>
                    <Button variant="outline" onClick={() => setShowBargainModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button onClick={handleWriteReview} disabled={showReviewForm}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="max-w-2xl">
              <ReviewForm
                productTitle={product.title}
                onSubmit={submitReview}
                onCancel={() => setShowReviewForm(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {/* Reviews Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">4.7</div>
                  <StarRating rating={4.7} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on 23 reviews
                  </p>
                </div>
                
                <div className="md:col-span-2 space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = Math.floor(Math.random() * 10) + 1;
                    const percentage = (count / 23) * 100;
                    
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm">{stars}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Reviews would go here */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Individual reviews would be displayed here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}