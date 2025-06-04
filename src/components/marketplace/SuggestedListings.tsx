'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Product, Area } from '@/types/marketplace';
import { mockProducts, areas, categories } from '@/constants/marketplace-data';
import { MapPin, Zap, Clock, DollarSign, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestedListingsProps {
  products?: Product[];
  areas?: Area[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showFilters?: boolean;
  showViewMore?: boolean;
}

type FilterType = 'all' | 'area' | 'status' | 'category';
type StatusFilter = 'all' | 'newly-posted' | 'good-price' | 'urgent';

export function SuggestedListings({ 
  products = mockProducts, 
  areas: propAreas = areas,
  title = "Suggested for You",
  subtitle = "Discover great deals from your area and trending items",
  maxItems = 8,
  showFilters = true,
  showViewMore = true
}: SuggestedListingsProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Area filter
      if (activeFilter === 'area' && selectedArea !== 'all') {
        const selectedAreaData = propAreas.find(area => area.id === selectedArea);
        return product.location === selectedAreaData?.name;
      }
      
      // Status filter
      if (activeFilter === 'status' && selectedStatus !== 'all') {
        return product.status === selectedStatus;
      }
      
      // Category filter
      if (activeFilter === 'category' && selectedCategory !== 'all') {
        return product.category === selectedCategory;
      }
      
      return true;
    });
  }, [products, activeFilter, selectedArea, selectedStatus, selectedCategory, propAreas]);

  const statusOptions = useMemo(() => [
    { id: 'all', label: 'All Items', icon: Zap, count: products.length },
    { id: 'newly-posted', label: 'Newly Posted', icon: Clock, count: products.filter(p => p.status === 'newly-posted').length },
    { id: 'good-price', label: 'Good Price', icon: DollarSign, count: products.filter(p => p.status === 'good-price').length },
    { id: 'urgent', label: 'Urgent Sale', icon: Zap, count: products.filter(p => p.status === 'urgent').length },
  ], [products]);

  const resetFilters = () => {
    setActiveFilter('all');
    setSelectedArea('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters = activeFilter !== 'all' || selectedArea !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all';

  const handleViewMore = () => {
    // Navigate to the full products page with current filters
    const params = new URLSearchParams();
    if (activeFilter === 'area' && selectedArea !== 'all') {
      params.set('location', selectedArea);
    }
    if (activeFilter === 'status' && selectedStatus !== 'all') {
      params.set('status', selectedStatus);
    }
    if (activeFilter === 'category' && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    
    const query = params.toString();
    router.push(`/products${query ? `?${query}` : ''}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {showFilters && (
          <>
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={resetFilters}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items ({products.length})
              </button>
              
              <button
                onClick={() => setActiveFilter('area')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === 'area'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="h-4 w-4" />
                By Area
              </button>
              
              <button
                onClick={() => setActiveFilter('category')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === 'category'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="h-4 w-4" />
                By Category
              </button>
              
              <button
                onClick={() => setActiveFilter('status')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === 'status'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Zap className="h-4 w-4" />
                By Status
              </button>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Area Filter Options */}
            {activeFilter === 'area' && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button
                  onClick={() => setSelectedArea('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedArea === 'all'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  All Areas ({products.length})
                </button>
                {propAreas.map(area => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedArea === area.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {area.name} ({area.productCount})
                  </button>
                ))}
              </div>
            )}

            {/* Category Filter Options */}
            {activeFilter === 'category' && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.name} ({category.productCount})
                  </button>
                ))}
              </div>
            )}

            {/* Status Filter Options */}
            {activeFilter === 'status' && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {statusOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedStatus(option.id as StatusFilter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        selectedStatus === option.id
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {option.label} ({option.count})
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {Math.min(filteredProducts.length, maxItems)} of {filteredProducts.length} items
            {hasActiveFilters && <span className="text-blue-600 ml-1">(filtered)</span>}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, maxItems).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters to see more results
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* View More Button */}
        {showViewMore && filteredProducts.length > maxItems && (
          <div className="text-center mt-12">
            <Button 
              onClick={handleViewMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View More Items ({filteredProducts.length - maxItems} more)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
} 