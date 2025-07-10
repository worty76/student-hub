import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductsQueryParams, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/types/product';
import { Search, X, Filter, Tag, DollarSign, Star, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (params: Partial<ProductsQueryParams>) => void;
  currentParams: ProductsQueryParams;
  isLoading?: boolean;
  className?: string;
}

export function ProductFilters({ onFiltersChange, currentParams, isLoading = false, className }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentParams.search || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceMin, setPriceMin] = useState<string>(currentParams.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = useState<string>(currentParams.maxPrice?.toString() || '');

  useEffect(() => {
    setSearchTerm(currentParams.search || '');
    setPriceMin(currentParams.minPrice?.toString() || '');
    setPriceMax(currentParams.maxPrice?.toString() || '');
  }, [currentParams.search, currentParams.minPrice, currentParams.maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParam = searchTerm.trim() || undefined;
    onFiltersChange({ search: searchParam });
  };

  const handleFilterChange = (key: keyof ProductsQueryParams, value: string | number | undefined) => {
    if ((key === 'status' || key === 'category' || key === 'condition') && value === 'all') {
      onFiltersChange({ [key]: undefined });
      return;
    }
    
    if (key === 'minPrice' || key === 'maxPrice') {
      const numValue = value ? Number(value) : undefined;
      onFiltersChange({ [key]: numValue });
      return;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      onFiltersChange({ [key]: undefined });
      return;
    }
    
    onFiltersChange({ [key]: value });
  };

  const handlePriceChange = () => {
    const minPriceValue = priceMin ? Number(priceMin) : undefined;
    const maxPriceValue = priceMax ? Number(priceMax) : undefined;
    
    onFiltersChange({ 
      minPrice: minPriceValue, 
      maxPrice: maxPriceValue 
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceMin('');
    setPriceMax('');
    onFiltersChange({
      search: undefined,
      category: undefined,
      condition: undefined,
      status: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      location: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentParams.search) count++;
    if (currentParams.category) count++;
    if (currentParams.condition) count++;
    if (currentParams.status) count++;
    if (currentParams.minPrice) count++;
    if (currentParams.maxPrice) count++;
    if (currentParams.location) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={`${className} bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-md overflow-hidden`}>
      <div 
        className="flex items-center justify-between cursor-pointer lg:cursor-default ps-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="ps-2 text-lg flex items-center gap-2 font-bold">
          <div className="bg-white/20 rounded-lg backdrop-blur-sm">
            <Filter className="h-5 w-5" />
          </div>
          <span>Tìm kiếm & Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="lg:hidden text-blue-600 hover:bg-blue-50"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="px-4 pb-4 lg:hidden">
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters} 
                disabled={isLoading} 
                className="border-red-300 text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Collapsible Filter Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px]' : 'max-h-0 lg:max-h-[5000px]'}`}>
        <CardContent className="space-y-4 p-4 pt-0 lg:pt-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-blue-200 hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
              <label className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Danh mục
              </label>
              <Select
                value={currentParams.category || 'all'}
                onValueChange={(value) => {
                  handleFilterChange('category', value === 'all' ? undefined : value);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="border-purple-300 focus:border-purple-500 bg-white/80">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
              <label className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Tình trạng
              </label>
              <Select
                value={currentParams.condition || 'all'}
                onValueChange={(value) => {
                  handleFilterChange('condition', value === 'all' ? undefined : value);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 bg-white/80">
                  <SelectValue placeholder="Tất cả tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tình trạng</SelectItem>
                  {PRODUCT_CONDITIONS.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-200">
              <label className="text-sm font-bold text-indigo-800 flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4" />
                Khoảng giá
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Tối thiểu"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  onBlur={handlePriceChange}
                  disabled={isLoading}
                  className="border-indigo-300 focus:border-indigo-500 bg-white/80 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Tối đa"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  onBlur={handlePriceChange}
                  disabled={isLoading}
                  className="border-indigo-300 focus:border-indigo-500 bg-white/80 text-sm"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-xl border border-teal-200 sm:col-span-2 lg:col-span-1">
              <label className="text-sm font-bold text-teal-800 flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                Sắp xếp theo
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={currentParams.sortBy || 'createdAt'}
                  onValueChange={(value) => {
                    handleFilterChange('sortBy', value as 'price' | 'createdAt' | 'views' | 'favorites');
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-teal-300 focus:border-teal-500 bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Ngày tạo</SelectItem>
                    <SelectItem value="price">Giá</SelectItem>
                    <SelectItem value="views">Lượt xem</SelectItem>
                    <SelectItem value="favorites">Yêu thích</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={currentParams.sortOrder || 'desc'}
                  onValueChange={(value) => {
                    handleFilterChange('sortOrder', value as 'asc' | 'desc');
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-teal-300 focus:border-teal-500 bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Mới nhất</SelectItem>
                    <SelectItem value="asc">Cũ nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Clear filters - Only visible on desktop or when expanded on mobile */}
          {activeFiltersCount > 0 && (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 rounded-xl border border-gray-300 hidden lg:block">
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllFilters}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold"
              >
                <X className="h-4 w-4" />
                Xóa tất cả bộ lọc ({activeFiltersCount})
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
} 