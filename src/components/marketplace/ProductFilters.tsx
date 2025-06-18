import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductsQueryParams, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, PRODUCT_STATUS } from '@/types/product';
import { Search, X, Filter } from 'lucide-react';

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
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tìm kiếm & Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            {isExpanded ? 'Ẩn' : 'Hiện'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" size="sm" disabled={isLoading} className="w-full">
            Tìm kiếm
          </Button>
        </form>

        {/* Quick filters */}
        <div className="space-y-3">
          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Danh mục</label>
            <Select
              value={currentParams.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger>
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
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tình trạng</label>
            <Select
              value={currentParams.condition || 'all'}
              onValueChange={(value) => handleFilterChange('condition', value === 'all' ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger>
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
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Trạng thái</label>
            <Select
              value={currentParams.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Khoảng giá</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Giá tối thiểu"
                value={currentParams.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                disabled={isLoading}
              />
              <Input
                type="number"
                placeholder="Giá tối đa"
                value={currentParams.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Địa điểm</label>
            <Input
              type="text"
              placeholder="Địa điểm"
              value={currentParams.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              disabled={isLoading}
            />
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Sắp xếp theo</label>
            <div className="grid grid-cols-2 gap-1">
              <Select
                value={currentParams.sortBy || 'createdAt'}
                onValueChange={(value) => handleFilterChange('sortBy', value as 'price' | 'createdAt' | 'views' | 'favorites')}
                disabled={isLoading}
              >
                <SelectTrigger>
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
                <SelectTrigger>
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
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            disabled={isLoading}
            className="w-full flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Xóa tất cả bộ lọc
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 