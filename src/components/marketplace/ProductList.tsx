'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/marketplace';
import { categories } from '@/constants/marketplace-data';
import { ProductService } from '@/services/product.service';
import { Product as ApiProduct, ProductsQueryParams, Pagination as PaginationType } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pagination } from './Pagination';
import { 
  Search, 
  Grid3X3, 
  List, 
  X,
  ArrowRight,
  Loader2
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
  showPagination?: boolean;
  compactView?: boolean;
  defaultCategory?: string;
  defaultStatus?: string;
  defaultPage?: number;
  defaultLimit?: number;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export function ProductList({
  products: providedProducts,
  title,
  subtitle,
  maxItems,
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  showViewMore = true,
  showPagination = true,
  compactView = false,
  defaultCategory = 'all',
  defaultStatus = 'available', // Default to hiding sold products
  defaultPage = 1,
  defaultLimit = 12,
  className = ''
}: ProductListProps) {
  const router = useRouter();
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: defaultPage,
    limit: defaultLimit,
    pages: 0
  });

  // Convert API product to marketplace product format
  const convertApiProduct = (apiProduct: ApiProduct): Product => ({
    id: apiProduct._id,
    title: apiProduct.title,
    price: apiProduct.price,
    image: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : '',
    location: apiProduct.location,
    status: apiProduct.status === 'pending' ? 'urgent' : 'newly-posted', // Only available and pending products reach here
    category: apiProduct.category,
    description: apiProduct.description,
    seller: {
      id: typeof apiProduct.seller === 'string' ? apiProduct.seller : apiProduct.seller._id,
      name: typeof apiProduct.seller === 'string' ? 'Unknown' : apiProduct.seller.name,
      avatar: typeof apiProduct.seller === 'object' ? apiProduct.seller.avatar : undefined
    },
    createdAt: new Date(apiProduct.createdAt || Date.now()),
    condition: apiProduct.condition === 'new' ? 'like-new' : apiProduct.condition
  });

  // Fetch real products with pagination
  useEffect(() => {
    if (!providedProducts) {
      const fetchRealProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Create query params for pagination
          const params: ProductsQueryParams = {
            page: currentPage,
            limit: defaultLimit,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          };

          // Add filters if they're not set to 'all'
          if (selectedCategory !== 'all') params.category = selectedCategory;
          if (selectedStatus !== 'all') params.status = selectedStatus;
          if (searchTerm) params.search = searchTerm;

          // Add sort params
          if (sortBy === 'price-low') {
            params.sortBy = 'price';
            params.sortOrder = 'asc';
          } else if (sortBy === 'price-high') {
            params.sortBy = 'price';
            params.sortOrder = 'desc';
          } else if (sortBy === 'popular') {
            params.sortBy = 'views';
            params.sortOrder = 'desc';
          } else {
            params.sortBy = 'createdAt';
            params.sortOrder = 'desc';
          }

          const result = await ProductService.getProductsWithPagination(params);
          const convertedProducts = result.products.map(convertApiProduct);
          setRealProducts(convertedProducts);
          setPagination(result.pagination);
        } catch (err) {
          setError('Failed to load products');
          console.error('Error fetching products:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRealProducts();
    }
  }, [providedProducts, currentPage, selectedCategory, selectedStatus, sortBy, searchTerm, defaultLimit]);

  // Use provided products or fetched real products
  const products = providedProducts || realProducts;

  // For provided products, we still need to do client-side filtering
  const filteredAndSortedProducts = useMemo(() => {
    // If we're using server pagination, don't filter again client-side
    if (!providedProducts) return products;
    
    // Client-side filtering only for provided products
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
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy, providedProducts]);

  const displayedProducts = maxItems && providedProducts 
    ? filteredAndSortedProducts.slice(0, maxItems) 
    : (providedProducts ? filteredAndSortedProducts : products);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || 
                          selectedStatus !== 'all';

  const handleViewMore = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    const query = params.toString();
    router.push(`/products${query ? `?${query}` : ''}`);
  };

  // Show loading state when fetching products (only if no products provided)
  if (!providedProducts && isLoading && currentPage === 1) {
    return (
      <div className={`bg-white ${className}`}>
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
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading products...</h3>
          <p className="text-gray-600">Please wait while we fetch the latest products</p>
        </div>
      </div>
    );
  }

  // Show error state when failed to fetch products
  if (!providedProducts && error) {
    return (
      <div className={`bg-white ${className}`}>
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
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-8 bg-red-100 rounded-2xl flex items-center justify-center">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Failed to load products</h3>
          <p className="text-red-600 mb-8 max-w-md mx-auto text-lg">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
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
            </>
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
      {isLoading && currentPage > 1 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : displayedProducts.length > 0 ? (
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

      {/* Pagination */}
      {!providedProducts && showPagination && displayedProducts.length > 0 && (
        <div className="mt-8">
          <Pagination 
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            className="justify-center"
          />
        </div>
      )}

      {/* View More Button - Only show for compact/limited views */}
      {showViewMore && maxItems && providedProducts && filteredAndSortedProducts.length > maxItems && (
        <div className="text-center mt-8">
          <Button onClick={handleViewMore} variant="outline" size="lg">
            View All Products ({filteredAndSortedProducts.length - maxItems} more)
          </Button>
        </div>
      )}
    </div>
  );
} 