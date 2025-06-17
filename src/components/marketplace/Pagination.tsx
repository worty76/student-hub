import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Pagination as PaginationType } from '@/types/product';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({ pagination, onPageChange, isLoading = false, className }: PaginationProps) {
  const { page, pages, total, limit } = pagination;

  // Generate page numbers to show
  const generatePageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    // Always include last page if there's more than one page
    if (pages > 1) {
      range.push(pages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    for (let i = 0; i < uniqueRange.length; i++) {
      if (i === 0) {
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] === 2) {
        rangeWithDots.push(uniqueRange[i - 1] + 1);
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] !== 1) {
        rangeWithDots.push('...');
        rangeWithDots.push(uniqueRange[i]);
      } else {
        rangeWithDots.push(uniqueRange[i]);
      }
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (pages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Hiển thị {startItem}-{endItem} trên {total} sản phẩm
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={index} className="px-3 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isCurrentPage = pageNumber === page;

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                disabled={isLoading}
                className={`min-w-[40px] ${
                  isCurrentPage 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages || isLoading}
          className="flex items-center gap-1"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile pagination (simpler version) */}
      <div className="flex md:hidden items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600 px-3">
          {page} trên {pages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 