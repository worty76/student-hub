"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductListingForm } from '@/components/product/ProductListingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Package, 
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  images: File[];
  specifications: Record<string, string>;
  shipping: {
    methods: string[];
    cost: string;
    estimatedDays: string;
  };
  bargaining: {
    enabled: boolean;
    minPrice: string;
    acceptsOffers: boolean;
  };
}

interface ListingStats {
  totalListings: number;
  avgSaleTime: string;
  successRate: string;
  activeUsers: number;
}

const mockStats: ListingStats = {
  totalListings: 12847,
  avgSaleTime: "3.2 days",
  successRate: "89%",
  activeUsers: 2341
};

export default function SellPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState<ProductFormData | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Upload images to cloud storage
      // 2. Create product listing in database
      // 3. Send notifications to relevant users
      // 4. Handle error cases
      
      console.log('Product listing data:', formData);
      
      setSubmittedProduct(formData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting product:', error);
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = (formData: ProductFormData) => {
    console.log('Preview data:', formData);
    // You could also open preview in a new tab or send to a preview route
  };

  if (showSuccess && submittedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Listing Created Successfully!</h1>
              <p className="text-muted-foreground mb-6">
                Your product &quot;{submittedProduct.title}&quot; has been listed for sale.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Live in ~15 mins</p>
                  <p className="text-xs text-muted-foreground">Processing images</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Users className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">~{Math.floor(Math.random() * 50) + 20} viewers</p>
                  <p className="text-xs text-muted-foreground">Expected in 24h</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Boost listing</p>
                  <p className="text-xs text-muted-foreground">Get more views</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push('/products')} variant="outline">
                  View All Listings
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => {
                    setShowSuccess(false);
                    setSubmittedProduct(null);
                  }} 
                  variant="ghost"
                >
                  List Another Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex">
                <Shield className="w-3 h-3 mr-1" />
                Secure Platform
              </Badge>
              <Badge variant="outline" className="hidden sm:flex">
                Free to List
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.totalListings.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.avgSaleTime}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Sale Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.successRate}
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selling Tips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <DollarSign className="w-5 h-5" />
                Tips for Successful Selling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">High-Quality Photos</p>
                    <p className="text-blue-700">Use good lighting and multiple angles</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Honest Descriptions</p>
                    <p className="text-blue-700">Be transparent about condition and flaws</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Competitive Pricing</p>
                    <p className="text-blue-700">Research similar items for fair pricing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <ProductListingForm 
          onSubmit={handleSubmit}
          onPreview={handlePreview}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 