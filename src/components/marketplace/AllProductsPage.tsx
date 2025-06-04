'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Grid3X3,
  List,
  MapPin,
  Heart,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Product } from '@/types/marketplace';
import { 
  mockProducts, 
  categories, 
  areas, 
  formatPrice, 
  getStatusColor, 
  getStatusLabel 
} from '@/constants/marketplace-data';

const conditionOptions = [
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

interface FilterState {
  search: string;
  category: string;
  location: string;
  condition: string;
  priceRange: [number, number];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}

export function AllProductsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    location: 'all',
    condition: 'any',
    priceRange: [0, 100000000],
    sortBy: 'newest'
  });

  // Filter and sort products based on current filters
  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter(product => {
      // Search filter
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'all' && !product.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Condition filter
      if (filters.condition && filters.condition !== 'any' && product.condition !== filters.condition) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          // Mock popularity sort (could be based on views, likes, etc.)
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [filters]);

  const getStatusBadge = (status: Product['status']) => {
    const colorClass = getStatusColor(status);
    const label = getStatusLabel(status);
    return <Badge className={colorClass}>{label}</Badge>;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
      condition: 'any',
      priceRange: [0, 100000000],
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.search || (filters.category && filters.category !== 'all') || 
                          (filters.location && filters.location !== 'all') || 
                          (filters.condition && filters.condition !== 'any') || 
                          filters.priceRange[0] > 0 || 
                          filters.priceRange[1] < 100000000;

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover amazing deals from students across Vietnam
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for products, brands, or descriptions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-blue-100 text-blue-800">Active</Badge>
                )}
              </Button>

              {/* Quick Filters */}
              {!showFilters && (
                <div className="flex flex-wrap gap-2">
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.name}>
                          <MapPin className="w-4 h-4 mr-1" />
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.sortBy} onValueChange={(value: FilterState['sortBy']) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </span>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.name}>
                          <MapPin className="w-4 h-4 mr-1" />
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <Select value={filters.condition} onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Condition</SelectItem>
                      {conditionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <Select value={filters.sortBy} onValueChange={(value: FilterState['sortBy']) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.priceRange[0] || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] 
                    }))}
                    className="w-32"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.priceRange[1] === 100000000 ? '' : filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value) || 100000000] 
                    }))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">VND</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                {viewMode === 'grid' ? (
                  <div className="cursor-pointer" onClick={() => handleProductClick(product.id)}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                      {product.image ? (
                        <Image 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle favorite toggle
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                        <span>•</span>
                        <span className="capitalize">{product.condition}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-8 h-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite toggle
                            }}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle contact
                            }}
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={() => handleProductClick(product.id)}>
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 relative">
                          {product.image ? (
                            <Image 
                              src={product.image} 
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                              width={96}
                              height={96}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1">
                            {getStatusBadge(product.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                                {product.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                {product.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {product.location}
                                </span>
                                <span className="capitalize">{product.condition}</span>
                                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-lg font-bold text-blue-600 mb-2">
                                {formatPrice(product.price)}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="w-8 h-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle favorite toggle
                                  }}
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle contact
                                  }}
                                >
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}