import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductsQueryParams, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, PRODUCT_STATUS } from '@/types/product';
import { Search, X, Filter, Tag, MapPin, DollarSign, Star, Calendar, TrendingUp } from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (params: Partial<ProductsQueryParams>) => void;
  currentParams: ProductsQueryParams;
  isLoading?: boolean;
  className?: string;
}

export function ProductFilters({ onFiltersChange, currentParams, isLoading = false, className }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentParams.search || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // Update search term when currentParams changes
  useEffect(() => {
    setSearchTerm(currentParams.search || '');
  }, [currentParams.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ search: searchTerm.trim() || undefined });
  };

  const handleFilterChange = (key: keyof ProductsQueryParams, value: string | number | undefined) => {
    onFiltersChange({ [key]: value });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
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
    <Card className={`${className} bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl overflow-hidden`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-bold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter className="h-5 w-5" />
            </div>
            Tìm kiếm & Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-white hover:bg-white/20 border-white/30"
          >
            {isExpanded ? 'Ẩn' : 'Hiện'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 p-6 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        {/* Search */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-blue-200">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
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

        {/* Quick filters */}
        <div className="space-y-4">
          {/* Category */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <label className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Danh mục
            </label>
            <Select
              value={currentParams.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <label className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Tình trạng
            </label>
            <Select
              value={currentParams.condition || 'all'}
              onValueChange={(value) => handleFilterChange('condition', value === 'all' ? undefined : value)}
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

          {/* Status */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
            <label className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trạng thái
            </label>
            <Select
              value={currentParams.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white/80">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {PRODUCT_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200 space-y-3">
            <label className="text-sm font-bold text-indigo-800 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Khoảng giá
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Giá tối thiểu"
                value={currentParams.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                disabled={isLoading}
                className="border-indigo-300 focus:border-indigo-500 bg-white/80"
              />
              <Input
                type="number"
                placeholder="Giá tối đa"
                value={currentParams.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                disabled={isLoading}
                className="border-indigo-300 focus:border-indigo-500 bg-white/80"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <label className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa điểm
            </label>
            <Input
              type="text"
              placeholder="Địa điểm"
              value={currentParams.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              disabled={isLoading}
              className="border-red-300 focus:border-red-500 bg-white/80"
            />
          </div>

          {/* Sort */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 space-y-3">
            <label className="text-sm font-bold text-teal-800 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sắp xếp theo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={currentParams.sortBy || 'createdAt'}
                onValueChange={(value) => handleFilterChange('sortBy', value as 'price' | 'createdAt' | 'views' | 'favorites')}
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
                onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
                disabled={isLoading}
              >
                <SelectTrigger className="border-teal-300 focus:border-teal-500 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mới nhất trước</SelectItem>
                  <SelectItem value="asc">Cũ nhất trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Clear filters */}
        {activeFiltersCount > 0 && (
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl border border-gray-300">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllFilters}
              disabled={isLoading}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-lg"
            >
              <X className="h-4 w-4" />
              Xóa tất cả bộ lọc ({activeFiltersCount})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 