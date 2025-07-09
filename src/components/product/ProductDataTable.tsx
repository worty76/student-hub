/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { 
  Package2, 
  Eye,
  Heart,
  Edit,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Calendar,
  MapPin,
  Grid,
  Table as TableIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Product, getCategoryLabel, getConditionLabel, getStatusLabel } from '@/types/product';
import { DeleteProductButton } from '@/components/product/DeleteProductButton';
import { useToast } from '@/components/ui/use-toast';

interface ProductDataTableProps {
  data: Product[];
  showActions?: boolean;
  isCurrentUser?: boolean;
  token?: string;
  onEdit?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  onDeleteSuccess?: () => void;
}

export function ProductDataTable({
  data,
  showActions = true,
  isCurrentUser = true,
  token,
  onEdit,
  onViewDetails,
  onDeleteSuccess
}: ProductDataTableProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Auto-detect mobile and set default view mode
  React.useEffect(() => {
    const checkMobile = () => {
      setViewMode(window.innerWidth < 768 ? 'cards' : 'table');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Vietnamese column labels for visibility dropdown
  const columnLabels: Record<string, string> = {
    'images': 'Ảnh',
    'title': 'Tiêu đề',
    'description': 'Mô tả',
    'price': 'Giá',
    'category': 'Danh mục',
    'condition': 'Điều kiện',
    'status': 'Trạng thái',
    'location': 'Vị trí',
    'stats': 'Thống kê',
    'createdAt': 'Ngày tạo',
    'actions': 'Hành động'
  };

  // Helper functions
  const stripHtmlTags = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'sold':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'text-green-600';
      case 'like-new':
        return 'text-blue-600';
      case 'good':
        return 'text-yellow-600';
      case 'fair':
        return 'text-orange-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleEdit = useCallback((productId: string) => {
    onEdit?.(productId);
  }, [onEdit]);

  const handleViewDetails = useCallback((productId: string) => {
    if (onViewDetails) {
      onViewDetails(productId);
    } else {
      window.open(`/products/${productId}`, '_blank');
    }
  }, [onViewDetails]);

  // Column definitions
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'images',
        header: 'Ảnh',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkgzMiIgc3Ryb2tlPSIjOUIwOTEyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjggMjhWMzYiIHN0cm9rZT0iIzlCMDkxMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package2 className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                </div>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto p-0 font-medium text-xs sm:text-sm"
            >
              Tiêu đề
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-medium text-gray-900 max-w-[120px] sm:max-w-[200px] truncate text-xs sm:text-sm">
              {row.getValue('title')}
            </div>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Mô tả',
        cell: ({ row }) => {
          const description = row.getValue('description') as string;
          const plainText = description ? stripHtmlTags(description) : '';
          return (
            <div className="max-w-[150px] sm:max-w-[300px] text-xs sm:text-sm text-gray-600 line-clamp-2">
              {plainText}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'price',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto p-0 font-medium text-xs sm:text-sm"
            >
              Giá
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const price = parseFloat(row.getValue('price'));
          return (
            <div className="font-semibold text-green-600 text-xs sm:text-sm">
              {formatPrice(price)}
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({ row }) => {
          return (
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(row.getValue('category'))}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'condition',
        header: 'Điều kiện',
        cell: ({ row }) => {
          const condition = row.getValue('condition') as string;
          return (
            <span className={`text-xs sm:text-sm font-medium ${getConditionColor(condition)}`}>
              {getConditionLabel(condition)}
            </span>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge variant={getStatusVariant(status)} className="text-xs">
              {getStatusLabel(status)}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'location',
        header: 'Vị trí',
        cell: ({ row }) => {
          return (
            <div className="text-xs sm:text-sm text-gray-600 max-w-[100px] sm:max-w-none truncate">
              {row.getValue('location')}
            </div>
          );
        },
      },
      {
        id: 'stats',
        header: 'Thống kê',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {product.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {product.favorites || 0}
              </div>
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto p-0 font-medium text-xs sm:text-sm"
            >
              Ngày tạo
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="text-xs sm:text-sm text-gray-600">
              {formatDate(row.getValue('createdAt'))}
            </div>
          );
        },
      },
      ...(showActions
        ? [
            {
              id: 'actions',
              header: 'Hành động',
              cell: ({ row }: { row: { original: Product } }) => {
                const product = row.original;
                return (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(product._id)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 cursor-pointer"
                      title="Xem chi tiết sản phẩm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product._id)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 cursor-pointer"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {token && (
                      <DeleteProductButton
                        productId={product._id}
                        productTitle={product.title}
                        token={token}
                        variant="icon"
                        size="sm"
                        onDeleteSuccess={() => {
                          toast({
                            title: 'Thành công',
                            description: 'Sản phẩm đã được xóa thành công',
                          });
                          onDeleteSuccess?.();
                        }}
                      />
                    )}
                  </div>
                );
              },
              enableSorting: false,
              enableColumnFilter: false,
            } as ColumnDef<Product>,
          ]
        : []),
    ],
    [showActions, isCurrentUser, token, onDeleteSuccess, toast, handleEdit, handleViewDetails]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        description: false, // Hide description on mobile by default
        location: false,    // Hide location on mobile by default
        stats: false,       // Hide stats on mobile by default
      },
    },
  });

  // Mobile Card Component
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      {/* Product Header */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package2 className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
            {product.title}
          </h3>
          <div className="text-lg font-bold text-green-600 mb-2">
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(product.category)}
            </Badge>
            <Badge variant={getStatusVariant(product.status)} className="text-xs">
              {getStatusLabel(product.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <span className={`font-medium ${getConditionColor(product.condition)}`}>
          {getConditionLabel(product.condition)}
        </span>
        
        {product.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{product.location}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {product.views || 0}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {product.favorites || 0}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {formatDate(product.createdAt)}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(product._id)}
            className="h-8 px-3 text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Xem
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(product._id)}
            className="h-8 px-3 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Sửa
          </Button>
                     {token && (
             <DeleteProductButton
               productId={product._id}
               productTitle={product.title}
               token={token}
               variant="icon"
               size="sm"
               onDeleteSuccess={() => {
                 toast({
                   title: 'Thành công',
                   description: 'Sản phẩm đã được xóa thành công',
                 });
                 onDeleteSuccess?.();
               }}
             />
           )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Table Controls */}
      <div className="flex flex-col gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Top Row - Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* View Mode Toggle - Desktop Only */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="text-xs"
            >
              <TableIcon className="h-3 w-3 mr-1" />
              Bảng
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="text-xs"
            >
              <Grid className="h-3 w-3 mr-1" />
              Thẻ
            </Button>
          </div>
        </div>

        {/* Bottom Row - Filters and Settings */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs border-gray-300 hover:bg-blue-50 hover:border-blue-400">
                <Filter className="mr-1 h-3 w-3" />
                Danh mục
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Lọc theo danh mục</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Array.from(new Set(data.map(item => item.category))).map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  className="capitalize"
                  checked={(table.getColumn('category')?.getFilterValue() as string[])?.includes(category)}
                  onCheckedChange={(value) => {
                    const currentFilter = table.getColumn('category')?.getFilterValue() as string[] | undefined;
                    const newFilter = value
                      ? [...(currentFilter || []), category]
                      : (currentFilter || []).filter(val => val !== category);
                    table.getColumn('category')?.setFilterValue(newFilter.length ? newFilter : undefined);
                  }}
                >
                  {getCategoryLabel(category)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs border-gray-300 hover:bg-blue-50 hover:border-blue-400">
                <Filter className="mr-1 h-3 w-3" />
                Trạng thái
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Array.from(new Set(data.map(item => item.status))).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={(table.getColumn('status')?.getFilterValue() as string[])?.includes(status)}
                  onCheckedChange={(value) => {
                    const currentFilter = table.getColumn('status')?.getFilterValue() as string[] | undefined;
                    const newFilter = value
                      ? [...(currentFilter || []), status]
                      : (currentFilter || []).filter(val => val !== status);
                    table.getColumn('status')?.setFilterValue(newFilter.length ? newFilter : undefined);
                  }}
                >
                  {getStatusLabel(status)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Visibility - Table Mode Only */}
          {viewMode === 'table' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs border-gray-300 hover:bg-gray-50 hover:border-gray-400">
                  <Settings2 className="mr-1 h-3 w-3" />
                  Cột
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {columnLabels[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'cards' ? (
        // Mobile Cards View
        <div className="space-y-4">
          {table.getRowModel().rows?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {table.getRowModel().rows.map((row) => (
                <ProductCard key={row.id} product={row.original} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Không có sản phẩm nào.</p>
            </div>
          )}
        </div>
      ) : (
        // Desktop Table View
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="font-semibold text-gray-700 py-3 sm:py-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 sm:py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Package2 className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500 font-medium">Không có sản phẩm nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-xs sm:text-sm font-medium text-gray-600 text-center sm:text-left">
          Hiển thị{' '}
          <span className="text-blue-600 font-semibold">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          đến{' '}
          <span className="text-blue-600 font-semibold">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          của{' '}
          <span className="text-blue-600 font-semibold">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          sản phẩm
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white hover:bg-blue-50 border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Trước</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white hover:bg-blue-50 border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
} 