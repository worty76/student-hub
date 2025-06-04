'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Edit, 
  Eye,
  Plus,
  MoreHorizontal,
  Heart,
  Trash2,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { Listing } from '@/types/profile';

const mockListings: Listing[] = [
  {
    id: 'L001',
    title: 'Advanced Mathematics Textbook',
    description: 'Comprehensive calculus and algebra textbook in excellent condition. Perfect for university students.',
    price: 75.99,
    images: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
    category: 'textbooks',
    condition: 'like-new',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    views: 156,
    likes: 23,
    location: 'Ho Chi Minh City'
  },
  {
    id: 'L002',
    title: 'Physics Lab Equipment Set',
    description: 'Complete physics laboratory equipment including microscope, measurement tools, and safety equipment.',
    price: 299.99,
    images: ['/api/placeholder/200/200'],
    category: 'lab-equipment',
    condition: 'good',
    status: 'sold',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    views: 89,
    likes: 12,
    location: 'Hanoi'
  },
  {
    id: 'L003',
    title: 'Programming Course Bundle',
    description: 'Complete programming course materials including books, practice exercises, and project files.',
    price: 129.99,
    images: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    category: 'courses',
    condition: 'good',
    status: 'hidden',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    views: 67,
    likes: 8,
    location: 'Da Nang'
  }
];

export function ManageListings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Listing['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: Listing['condition']) => {
    switch (condition) {
      case 'like-new': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = (listingId: string, currentStatus: string) => {
    // Handle status toggle logic here
    console.log('Toggle status for listing:', listingId, currentStatus);
  };

  const handleDelete = (listingId: string) => {
    // Handle delete logic here
    console.log('Delete listing:', listingId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
          <p className="text-gray-600">Manage your marketplace listings</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {mockListings.filter(l => l.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {mockListings.filter(l => l.status === 'sold').length}
            </div>
            <p className="text-sm text-gray-600">Sold Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {mockListings.reduce((sum, l) => sum + l.views, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {mockListings.reduce((sum, l) => sum + l.likes, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Likes</p>
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
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="textbooks">Textbooks</SelectItem>
                <SelectItem value="lab-equipment">Lab Equipment</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
                    <div className="flex space-x-1 ml-2">
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Badge>
                    <Badge className={getConditionColor(listing.condition)}>
                      {listing.condition}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-blue-600">${listing.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{listing.location}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{listing.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Created: {listing.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {listing.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusToggle(listing.id, listing.status)}
                        >
                          <PauseCircle className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                      ) : listing.status === 'hidden' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusToggle(listing.id, listing.status)}
                        >
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      ) : null}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Start by creating your first listing to sell items on the marketplace.'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 