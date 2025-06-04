'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product, Area } from '@/types/marketplace';
import { MapPin, Zap, Clock, DollarSign } from 'lucide-react';

interface SuggestedListingsProps {
  products: Product[];
  areas: Area[];
}

type FilterType = 'all' | 'area' | 'status';
type StatusFilter = 'all' | 'newly-posted' | 'good-price' | 'urgent';

export function SuggestedListings({ products, areas }: SuggestedListingsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'area' && selectedArea !== 'all') {
      return product.location === areas.find(area => area.id === selectedArea)?.name;
    }
    if (activeFilter === 'status' && selectedStatus !== 'all') {
      return product.status === selectedStatus;
    }
    return true;
  });

  const statusOptions = [
    { id: 'all', label: 'All Items', icon: Zap, count: products.length },
    { id: 'newly-posted', label: 'Newly Posted', icon: Clock, count: products.filter(p => p.status === 'newly-posted').length },
    { id: 'good-price', label: 'Good Price', icon: DollarSign, count: products.filter(p => p.status === 'good-price').length },
    { id: 'urgent', label: 'Urgent Sale', icon: Zap, count: products.filter(p => p.status === 'urgent').length },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Suggested for You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover great deals from your area and trending items
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedArea('all');
              setSelectedStatus('all');
            }}
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
            {areas.map(area => (
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map(product => (
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
            <p className="text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* View More Button */}
        {filteredProducts.length > 8 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              View More Items ({filteredProducts.length - 8} more)
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 