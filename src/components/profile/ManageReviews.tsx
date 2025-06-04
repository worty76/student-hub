'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  Reply,
  Flag,
  MoreHorizontal,
} from 'lucide-react';
import { Review } from '@/types/profile';

const mockReviews: Review[] = [
  {
    id: 'R001',
    type: 'received',
    rating: 5,
    comment: 'Excellent seller! The textbook was in perfect condition as described. Fast shipping and great communication throughout.',
    reviewer: {
      id: 'U001',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40'
    },
    reviewee: {
      id: 'U002',
      name: 'Current User',
      avatar: '/api/placeholder/40/40'
    },
    order: {
      id: 'ORD001',
      productTitle: 'Calculus Textbook - 10th Edition'
    },
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'R002',
    type: 'given',
    rating: 4,
    comment: 'Great product quality, but shipping took a bit longer than expected. Overall satisfied with the purchase.',
    reviewer: {
      id: 'U002',
      name: 'Current User',
      avatar: '/api/placeholder/40/40'
    },
    reviewee: {
      id: 'U003',
      name: 'Mike Wilson',
      avatar: '/api/placeholder/40/40'
    },
    order: {
      id: 'ORD002',
      productTitle: 'Physics Lab Equipment Set'
    },
    createdAt: new Date('2024-01-18')
  },
  {
    id: 'R003',
    type: 'received',
    rating: 4,
    comment: 'Good transaction. Item was as described and seller was responsive to messages.',
    reviewer: {
      id: 'U004',
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40'
    },
    reviewee: {
      id: 'U002',
      name: 'Current User',
      avatar: '/api/placeholder/40/40'
    },
    order: {
      id: 'ORD003',
      productTitle: 'Programming Books Bundle'
    },
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'R004',
    type: 'received',
    rating: 3,
    comment: 'The item was okay but had some wear that wasn\'t mentioned in the description. Still functional though.',
    reviewer: {
      id: 'U005',
      name: 'Emma Davis',
      avatar: '/api/placeholder/40/40'
    },
    reviewee: {
      id: 'U002',
      name: 'Current User',
      avatar: '/api/placeholder/40/40'
    },
    order: {
      id: 'ORD004',
      productTitle: 'Electronics Components Kit'
    },
    createdAt: new Date('2024-01-12')
  }
];

export function ManageReviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'received' | 'given'>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.type === 'received' ? review.reviewer.name : review.reviewee.name)
                           .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || review.type === filterType;
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesType && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const avgRating = mockReviews
    .filter(r => r.type === 'received')
    .reduce((sum, r) => sum + r.rating, 0) / mockReviews.filter(r => r.type === 'received').length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.type === 'received' && r.rating === rating).length,
    percentage: (mockReviews.filter(r => r.type === 'received' && r.rating === rating).length / 
                mockReviews.filter(r => r.type === 'received').length) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <p className="text-gray-600">Manage reviews you&apos;ve received and given</p>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Rating Overview</CardTitle>
            <CardDescription>Reviews you&apos;ve received from buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-blue-600">
                {avgRating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(Math.round(avgRating))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {mockReviews.filter(r => r.type === 'received').length} reviews
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Statistics</CardTitle>
            <CardDescription>Your review activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mockReviews.filter(r => r.type === 'received').length}
                </div>
                <p className="text-sm text-gray-600">Reviews Received</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mockReviews.filter(r => r.type === 'given').length}
                </div>
                <p className="text-sm text-gray-600">Reviews Given</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {mockReviews.filter(r => r.type === 'received' && r.rating >= 4).length}
                </div>
                <p className="text-sm text-gray-600">Positive Reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(mockReviews.filter(r => r.type === 'received' && r.rating >= 4).length / 
                    mockReviews.filter(r => r.type === 'received').length * 100).toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600">Positive Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'received' | 'given') => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Review Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="given">Given</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <img
                  src={review.type === 'received' ? review.reviewer.avatar : review.reviewee.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {review.type === 'received' ? review.reviewer.name : review.reviewee.name}
                      </h3>
                      <Badge variant={review.type === 'received' ? 'default' : 'secondary'}>
                        {review.type === 'received' ? 'Received' : 'Given'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className={`font-semibold ${getRatingColor(review.rating)}`}>
                          {review.rating}.0
                        </span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>Order: <span className="font-medium">{review.order.productTitle}</span></p>
                      <p>Date: {review.createdAt.toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {review.type === 'received' && (
                        <Button size="sm" variant="outline">
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterRating !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Reviews will appear here when you buy or sell items on the marketplace.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 