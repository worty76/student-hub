import React, { useEffect } from 'react';
import { useProductsListStore } from '@/store/productsListStore';
import { ProductListCard } from './ProductListCard';
import { ProductFilters } from './ProductFilters';
import { Pagination } from './Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, AlertCircle, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    fetchAllProducts();
    return () => {
    };
  }, [fetchAllProducts]);

  const handleFiltersChange = (newParams: Parameters<typeof updateFilters>[0]) => {
    console.log('ProductsList received filter change:', newParams);
    updateFilters(newParams);
  };

  const handlePageChange = (page: number) => {
    console.log('ProductsList page change:', page);
    goToPage(page);
  };

  const handleRefresh = async () => {
    await refreshProducts();
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Stats Card */}
      <Card className="bg-gradient-to-r from-white to-blue-50 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Tất cả sản phẩm
                </h2>
                <p className="text-gray-600">
                  {pagination ? `${pagination.total} sản phẩm có sẵn` : 'Khám phá chợ trực tuyến của chúng tôi'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1">
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            currentParams={currentParams}
            isLoading={isLoading}
            className="sticky top-4"
          />
        </div>

        <div className="lg:col-span-3">
          {error && (
            <Card className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
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
                    className="bg-white hover:bg-red-50 border-red-200 text-red-700"
                  >
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading && displayedProducts.length === 0 && (
            <Card className="bg-gradient-to-br from-white to-blue-50 shadow-xl border-blue-200">
              <CardContent className="p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Đang tải sản phẩm...
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Vui lòng đợi trong khi chúng tôi tải các sản phẩm mới nhất cho bạn.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && displayedProducts.length === 0 && (
            <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-gray-200">
              <CardContent className="p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6">
                    <Package className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Chúng tôi không thể tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => updateFilters({})}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {displayedProducts.length > 0 && (
            <div className="space-y-8">
              <Card className="bg-gradient-to-r from-white to-indigo-50 border-indigo-200 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {pagination && (
                        <>
                          Hiển thị{' '}
                          <span className="text-indigo-600 font-semibold">
                            {((pagination.page - 1) * pagination.limit) + 1}-
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                          </span>{' '}
                          trên{' '}
                          <span className="text-indigo-600 font-semibold">{pagination.total}</span> sản phẩm
                        </>
                      )}
                    </p>
                    
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductListCard
                    key={product._id}
                    product={product}
                    className={`${isLoading ? 'opacity-75' : ''} transition-all duration-300 hover:scale-105`}
                  />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="mt-12">
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                    className="flex justify-center"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 