'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  Eye, 
  Trash2, 
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'sold' | 'removed' | 'pending';
  reportCount: number;
  createdAt: string;
  images: string[];
}

export function AdminProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<AdminProduct['status'] | 'all'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockProducts: AdminProduct[] = [
          {
            _id: '1',
            title: 'MacBook Pro 13" 2020',
            price: 899,
            condition: 'Like New',
            category: 'Electronics',
            seller: {
              _id: '2',
              name: 'Jane Smith',
              email: 'jane.smith@student.edu'
            },
            status: 'active',
            reportCount: 0,
            createdAt: '2024-01-15T10:30:00Z',
            images: ['/api/placeholder/300/200']
          },
          {
            _id: '2',
            title: 'Calculus Textbook 8th Edition',
            price: 45,
            condition: 'Good',
            category: 'Books',
            seller: {
              _id: '1',
              name: 'John Doe',
              email: 'john.doe@student.edu'
            },
            status: 'sold',
            reportCount: 0,
            createdAt: '2024-01-10T14:20:00Z',
            images: ['/api/placeholder/300/200']
          },
          {
            _id: '3',
            title: 'Gaming Chair - Red',
            price: 120,
            condition: 'Fair',
            category: 'Furniture',
            seller: {
              _id: '4',
              name: 'Suspended User',
              email: 'suspended.user@student.edu'
            },
            status: 'removed',
            reportCount: 3,
            createdAt: '2024-01-05T09:15:00Z',
            images: ['/api/placeholder/300/200']
          },
          {
            _id: '4',
            title: 'iPhone 12 Pro',
            price: 650,
            condition: 'Good',
            category: 'Electronics',
            seller: {
              _id: '2',
              name: 'Jane Smith',
              email: 'jane.smith@student.edu'
            },
            status: 'pending',
            reportCount: 1,
            createdAt: '2024-01-20T11:45:00Z',
            images: ['/api/placeholder/300/200']
          },
        ];
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProductAction = async (productId: string, action: 'approve' | 'remove' | 'delete') => {
    try {
      // Mock action - replace with actual API call
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product._id === productId) {
            switch (action) {
              case 'approve':
                return { ...product, status: 'active' as const };
              case 'remove':
                return { ...product, status: 'removed' as const };
              case 'delete':
                return product; // Would actually remove from list
              default:
                return product;
            }
          }
          return product;
        }).filter(product => !(product._id === productId && action === 'delete'))
      );
    } catch (error) {
      console.error('Error performing product action:', error);
    }
  };

  const getStatusBadgeColor = (status: AdminProduct['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage product listings and moderate content</p>
        </div>
        <Button onClick={fetchProducts} variant="outline" size="sm">
          Refresh Products
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by title or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: AdminProduct['status'] | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.condition}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${product.price}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.seller.name}</div>
                      <div className="text-sm text-gray-500">{product.seller.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusBadgeColor(product.status)}`} variant="secondary">
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={product.reportCount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                      {product.reportCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {product.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductAction(product._id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductAction(product._id, 'remove')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {product.status === 'active' && product.reportCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductAction(product._id, 'remove')}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete &quot;{product.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleProductAction(product._id, 'delete')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 