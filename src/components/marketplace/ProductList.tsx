'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/marketplace';
import { mockProducts, areas, categories } from '@/constants/marketplace-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Grid3X3, 
  List, 
  X,
  ArrowRight
} from 'lucide-react';

interface ProductListProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showViewMore?: boolean;
  compactView?: boolean;
  defaultCategory?: string;
  defaultLocation?: string;
  defaultStatus?: string;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export function ProductList({
  products = mockProducts,
  title,
  subtitle,
  maxItems,
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  showViewMore = true,
  compactView = false,
  defaultCategory = 'all',
  defaultLocation = 'all',
  defaultStatus = 'all',
  className = ''
}: ProductListProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Search filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const locationArea = areas.find(area => area.id === selectedLocation);
        if (locationArea && product.location !== locationArea.name) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && product.status !== selectedStatus) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
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
  }, [products, searchTerm, selectedCategory, selectedLocation, selectedStatus, sortBy]);

  const displayedProducts = maxItems ? filteredAndSortedProducts.slice(0, maxItems) : filteredAndSortedProducts;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedStatus('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || 
                          selectedLocation !== 'all' || selectedStatus !== 'all';

  const handleViewMore = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedLocation !== 'all') params.set('location', selectedLocation);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    const query = params.toString();
    router.push(`/products${query ? `?${query}` : ''}`);
  };

  if (compactView) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{title}</span>
              {showViewMore && filteredAndSortedProducts.length > (maxItems || 4) && (
                <Button variant="ghost" size="sm" onClick={handleViewMore}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardTitle>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedProducts.slice(0, maxItems || 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {displayedProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-12"
              />
            </div>
          )}

          {/* Filter Bar */}
          {showFilters && (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        <MapPin className="w-4 h-4 mr-1" />
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="newly-posted">Newly Posted</SelectItem>
                    <SelectItem value="good-price">Good Price</SelectItem>
                    <SelectItem value="urgent">Urgent Sale</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
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

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* View Controls */}
              {showViewToggle && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {displayedProducts.length} of {filteredAndSortedProducts.length} items
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
              )}
            </div>
          )}
        </div>
      )}

      {/* Products Grid/List */}
      {displayedProducts.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* View More Button */}
      {showViewMore && maxItems && filteredAndSortedProducts.length > maxItems && (
        <div className="text-center mt-8">
          <Button onClick={handleViewMore} variant="outline" size="lg">
            View All Products ({filteredAndSortedProducts.length - maxItems} more)
          </Button>
        </div>
      )}
    </div>
  );
} 