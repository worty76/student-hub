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
  Search, 
  AlertTriangle,
  User,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductReport } from '@/types/product';

// Utility functions for formatting
const formatDate = {
  dateOnly: (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  
  full: (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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

interface AdminProductReportsDataTableProps {
  data: ProductReport[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusFilterChange: (status: string) => void;
  onReasonFilterChange: (reason: string) => void;
}

export function AdminProductReportsDataTable({ 
  data, 
  isLoading = false, 
  currentPage,
  totalPages,
  onPageChange,
  onStatusFilterChange,
  onReasonFilterChange
}: AdminProductReportsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [reasonFilter, setReasonFilter] = React.useState<string>('all');

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'spam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inappropriate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fraud':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offensive':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const columns: ColumnDef<ProductReport>[] = [
    {
      accessorKey: 'reporter',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            <User className="mr-2 h-4 w-4" />
            Người báo cáo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const reporter = row.original.reporter;
        if (!reporter) {
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                Không có thông tin
              </div>
              <div className="text-sm text-gray-500">
                N/A
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">
              {reporter.name || 'Không có tên'}
            </div>
            <div className="text-sm text-gray-500">
              {reporter.email || 'Không có email'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reported',
      header: 'Người bị báo cáo',
      cell: ({ row }) => {
        const reported = row.original.reported;
        if (!reported) {
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                Không có thông tin
              </div>
              <div className="text-sm text-gray-500">
                N/A
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">
              {reported.name || 'Không có tên'}
            </div>
            <div className="text-sm text-gray-500">
              {reported.email || 'Không có email'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'product',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            <Package className="mr-2 h-4 w-4" />
            Sản phẩm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original.product;
        if (!product) {
          return (
            <div className="max-w-[200px]">
              <div className="font-medium text-gray-900">
                Sản phẩm không tồn tại
              </div>
              <div className="text-sm text-gray-500">
                Đã bị xóa
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-[200px]">
            <div className="font-medium text-gray-900 truncate" title={product.title || 'Không có tiêu đề'}>
              {product.title || 'Không có tiêu đề'}
            </div>
            <div className="text-sm text-gray-500">
              ID: {product._id ? product._id.slice(-8) : 'N/A'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Lý do
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const reason = row.getValue('reason') as string;
        return (
          <Badge variant="outline" className={getReasonBadgeColor(reason)}>
            {reason}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return (
          <div className="max-w-[300px]">
            <div className="text-sm text-gray-900 truncate" title={description}>
              {description}
            </div>
          </div>
        );
      },
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
        const statusLabels: Record<string, string> = {
          pending: 'Đang chờ',
          reviewed: 'Đã xem xét',
          dismissed: 'Đã bỏ qua'
        };
        return (
          <Badge variant="outline" className={getStatusBadgeColor(status)}>
            {statusLabels[status] || status}
          </Badge>
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
            <Calendar className="mr-2 h-4 w-4" />
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {formatDate.dateOnly(createdAt)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate.relative(createdAt)}
            </div>
          </div>
        );
      },
    }
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
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onStatusFilterChange(value);
  };

  const handleReasonFilterChange = (value: string) => {
    setReasonFilter(value);
    onReasonFilterChange(value);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm báo cáo..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Đang chờ</SelectItem>
              <SelectItem value="reviewed">Đã xem xét</SelectItem>
              <SelectItem value="dismissed">Đã bỏ qua</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={handleReasonFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lý do" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lý do</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="inappropriate">Không phù hợp</SelectItem>
              <SelectItem value="fraud">Lừa đảo</SelectItem>
              <SelectItem value="offensive">Xúc phạm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Cột hiển thị <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chuyển đổi cột</DropdownMenuLabel>
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
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
                    <TableCell key={cell.id} className="py-4">
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
                  Không có báo cáo nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {table.getFilteredRowModel().rows.length} trong tổng số{' '}
          {data.length} báo cáo
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 