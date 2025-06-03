'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Verified, 
  MessageCircle, 
  Phone,
  Calendar,
  TrendingUp,
  User,
  Shield,
  Clock
} from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
  responseRate: number;
  memberSince: Date;
  isVerified: boolean;
  isOnline: boolean;
}

interface SellerProfileProps {
  seller: Seller;
}

export function SellerProfile({ seller }: SellerProfileProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatMemberSince = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Seller Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seller Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Online Status */}
            {seller.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{seller.name}</h3>
              {seller.isVerified && (
                <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                  <Verified className="w-3 h-3" />
                  <span>Verified</span>
                </Badge>
              )}
              {seller.isOnline && (
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(seller.rating)}
              </div>
              <span className={`font-semibold ${getRatingColor(seller.rating)}`}>
                {seller.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                ({seller.totalReviews} reviews)
              </span>
            </div>

            {/* Member Since */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Member since {formatMemberSince(seller.memberSince)}</span>
            </div>
          </div>
        </div>

        {/* Seller Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-xl font-bold ${getResponseRateColor(seller.responseRate)}`}>
                {seller.responseRate}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {seller.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Identity Verified</span>
              </div>
              {seller.isVerified ? (
                <Badge className="bg-green-100 text-green-800">✓</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>High Rating</span>
              </div>
              {seller.rating >= 4.0 ? (
                <Badge className="bg-green-100 text-green-800">✓</Badge>
              ) : (
                <Badge variant="outline">—</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Fast Response</span>
              </div>
              {seller.responseRate >= 85 ? (
                <Badge className="bg-green-100 text-green-800">✓</Badge>
              ) : (
                <Badge variant="outline">—</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Seller
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>

        {/* Safety Reminder */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Safety Tip</p>
              <p className="text-yellow-700">
                Meet in public places and inspect items before payment. Report any suspicious activity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}