import React, { useEffect } from 'react';
import { useProductsListStore } from '@/store/productsListStore';
import { ProductListCard } from './ProductListCard';
import { ProductFilters } from './ProductFilters';
import { Pagination } from './Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Package, AlertCircle } from 'lucide-react';

interface ProductsListProps {
  className?: string;
}

export function ProductsList({ className }: ProductsListProps) {
  const {
    displayedProducts,
    pagination,
    currentParams,
    isLoading,
    error,
    fetchAllProducts,
    goToPage,
    updateFilters,
    clearError,
    refreshProducts,
  } = useProductsListStore();

  // Fetch products on component mount
  useEffect(() => {
    fetchAllProducts();
    
    // Cleanup on unmount
    return () => {
      // Could add cleanup logic here if needed
    };
  }, [fetchAllProducts]);

  const handleFiltersChange = (newParams: Parameters<typeof updateFilters>[0]) => {
    updateFilters(newParams);
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleRefresh = async () => {
    await refreshProducts();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            {pagination ? `${pagination.total} sản phẩm có sẵn` : 'Khám phá chợ trực tuyến của chúng tôi'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            currentParams={currentParams}
            isLoading={isLoading}
            className="sticky top-4"
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Lỗi khi tải sản phẩm</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearError();
                      handleRefresh();
                    }}
                    className="ml-auto"
                  >
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && displayedProducts.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Đang tải sản phẩm...
                  </h3>
                  <p className="text-gray-600">
                    Vui lòng đợi trong khi chúng tôi tải các sản phẩm mới nhất cho bạn.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && displayedProducts.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Chúng tôi không thể tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                  </p>
                  <Button variant="outline" onClick={() => updateFilters({})}>
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          {displayedProducts.length > 0 && (
            <div className="space-y-6">
              {/* Results summary */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {pagination && (
                    <>
                      Hiển thị {((pagination.page - 1) * pagination.limit) + 1}-
                      {Math.min(pagination.page * pagination.limit, pagination.total)} trên{' '}
                      {pagination.total} sản phẩm
                    </>
                  )}
                </p>
                
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductListCard
                    key={product._id}
                    product={product}
                    className={`${isLoading ? 'opacity-75' : ''} transition-opacity`}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                  className="mt-8"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 