'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  ChevronDown, 
  Eye, 
  Search, 
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product, getCategoryLabel, getStatusLabel } from '@/types/product';
import { DeleteProductButton } from './DeleteProductButton';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Tiện ích định dạng ngày tháng
const formatDate = {
  dateOnly: (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  
  relative: (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  }
};

// Định dạng giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

interface AdminProductsDataTableProps {
  data: Product[];
  isLoading?: boolean;
}

export function AdminProductsDataTable({ data, isLoading = false }: AdminProductsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  
  const { token } = useAuthStore();
  const { approveProduct, rejectProduct } = useAdminStore();

  const handleApprove = async (productId: string) => {
    if (!token) return;
    
    try {
      await approveProduct(token, productId);
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được phê duyệt",
        variant: "default",
      });
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (productId: string) => {
    if (!token) return;
    
    try {
      await rejectProduct(token, productId, "Không phù hợp với quy định");
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được từ chối",
        variant: "default",
      });
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối sản phẩm",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'books':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'electronics':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clothing':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'furniture':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'sports':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'images',
      header: 'Hình ảnh',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
              <Package className="h-6 w-6 text-gray-400" />
            </div>
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
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Tên sản phẩm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium text-gray-900 max-w-[200px]">
            <div className="truncate" title={row.getValue('title')}>
              {row.getValue('title')}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Giá bán
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = row.getValue('price') as number;
        return (
          <div className="font-semibold text-green-600">
            {formatPrice(price)}
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        return (
          <Badge 
            className={`text-xs ${getCategoryBadgeColor(category)}`} 
            variant="secondary"
          >
            {getCategoryLabel(category)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'seller',
      header: 'Người bán',
      cell: ({ row }) => {
        const seller = row.getValue('seller') as { name?: string; email?: string } | string;
        const sellerName = typeof seller === 'object' ? seller.name || 'Không xác định' : 'Không xác định';
        const sellerEmail = typeof seller === 'object' ? seller.email : '';
        
        return (
          <div>
            <div className="font-medium text-gray-900">{sellerName}</div>
            {sellerEmail && (
              <div className="text-sm text-gray-500">{sellerEmail}</div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Trạng thái
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge 
            className={`text-xs ${getStatusBadgeColor(status)}`} 
            variant="secondary"
          >
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
      header: 'Địa điểm',
      cell: ({ row }) => {
        const location = row.getValue('location') as string;
        
        if (!location) return <span className="text-sm text-gray-600">Chưa xác định</span>;
        
        // Truncate text to 30 characters and add ellipsis if needed
        const maxLength = 30;
        const displayText = location.length > maxLength 
          ? location.substring(0, maxLength) + '...'
          : location;
        
        return (
          <span 
            className="text-sm text-gray-600" 
            title={location} // Show full location on hover
          >
            {displayText}
          </span>
        );
      },
    },
    {
      accessorKey: 'views',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Lượt xem
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const views = row.getValue('views') as number;
        return (
          <span className="text-sm font-medium">
            {(views || 0).toLocaleString('vi-VN')}
          </span>
        );
      },
    },
    {
      accessorKey: 'favorites',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Yêu thích
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const favorites = row.getValue('favorites') as number;
        return (
          <span className="text-sm font-medium text-red-600">
            {(favorites || 0).toLocaleString('vi-VN')}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Ngày đăng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <div className="text-sm">
            <div className="font-medium">{formatDate.dateOnly(date)}</div>
            <div className="text-gray-500">{formatDate.relative(date)}</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => {
        const product = row.original;
        const isPending = product.status === 'pending';
        
        return (
          <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/products/${product._id}`, '_blank')}
              className="cursor-pointer hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem
            </Button>
            
            <DeleteProductButton
              productId={product._id}
              productTitle={product.title}
              variant="ghost"
              size="sm"
              iconOnly={true}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
                      
            {isPending && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(product._id)}
                  className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Duyệt
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(product._id)}
                  className="cursor-pointer hover:bg-red-50 text-red-600 border-red-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Từ chối
                </Button>
              </>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        pageSize: 7,
      },
    },
  });

  // Lấy các giá trị duy nhất cho bộ lọc
  const uniqueCategories = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.category)));
  }, [data]);

  const uniqueStatuses = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.status)));
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="border rounded-md">
          <div className="h-12 bg-gray-100 border-b"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 border-b animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm hoặc người bán..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-10"
            />
          </div>
          
          {/* Bộ lọc danh mục */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Danh mục
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Lọc theo danh mục</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  className="capitalize"
                  checked={
                    (table.getColumn('category')?.getFilterValue() as string[])?.includes(category) ?? false
                  }
                  onCheckedChange={(value) => {
                    const currentFilters = (table.getColumn('category')?.getFilterValue() as string[]) || [];
                    const newFilters = value
                      ? [...currentFilters, category]
                      : currentFilters.filter((c) => c !== category);
                    table.getColumn('category')?.setFilterValue(newFilters.length ? newFilters : undefined);
                  }}
                >
                  {getCategoryLabel(category)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bộ lọc trạng thái */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Trạng thái
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueStatuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={
                    (table.getColumn('status')?.getFilterValue() as string[])?.includes(status) ?? false
                  }
                  onCheckedChange={(value) => {
                    const currentFilters = (table.getColumn('status')?.getFilterValue() as string[]) || [];
                    const newFilters = value
                      ? [...currentFilters, status]
                      : currentFilters.filter((s) => s !== status);
                    table.getColumn('status')?.setFilterValue(newFilters.length ? newFilters : undefined);
                  }}
                >
                  {getStatusLabel(status)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hiển thị cột */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Hiển thị cột
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnLabels: Record<string, string> = {
                  'images': 'Hình ảnh',
                  'title': 'Tên sản phẩm',
                  'price': 'Giá bán',
                  'category': 'Danh mục',
                  'seller': 'Người bán',
                  'status': 'Trạng thái',
                  'location': 'Địa điểm',
                  'views': 'Lượt xem',
                  'favorites': 'Yêu thích',
                  'createdAt': 'Ngày đăng',
                  'actions': 'Thao tác'
                };
                
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
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border bg-white">
        <ScrollArea className="max-w-400 whitespace-nowrap">
          <div className="w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có sản phẩm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} đến{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          của {table.getFilteredRowModel().rows.length} sản phẩm
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
} 