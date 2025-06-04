'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Order } from '@/types/profile';
import Image from 'next/image';

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    type: 'purchase',
    product: {
      id: 'P001',
      title: 'Calculus Textbook - 10th Edition',
      image: '/api/placeholder/100/100',
      price: 89.99
    },
    seller: {
      id: 'S001',
      name: 'John Smith',
      email: 'john@example.com'
    },
    status: 'delivered',
    quantity: 1,
    totalAmount: 89.99,
    orderDate: new Date('2024-01-15'),
    deliveryDate: new Date('2024-01-20'),
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD002',
    type: 'sale',
    product: {
      id: 'P002',
      title: 'Physics Lab Equipment Set',
      image: '/api/placeholder/100/100',
      price: 159.99
    },
    buyer: {
      id: 'B001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    status: 'shipped',
    quantity: 1,
    totalAmount: 159.99,
    orderDate: new Date('2024-01-18'),
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD003',
    type: 'purchase',
    product: {
      id: 'P003',
      title: 'Programming Books Bundle',
      image: '/api/placeholder/100/100',
      price: 129.99
    },
    seller: {
      id: 'S002',
      name: 'Mike Wilson',
      email: 'mike@example.com'
    },
    status: 'pending',
    quantity: 1,
    totalAmount: 129.99,
    orderDate: new Date('2024-01-22')
  }
];

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'sale'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600">Track your purchases and sales</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'purchase' | 'sale') => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="purchase">Purchases</SelectItem>
                <SelectItem value="sale">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={order.product.image}
                    alt={order.product.title}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{order.product.title}</h3>
                      <Badge variant={order.type === 'purchase' ? 'default' : 'secondary'}>
                        {order.type === 'purchase' ? 'Purchase' : 'Sale'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">Order #{order.id}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Quantity: {order.quantity}</span>
                      <span>•</span>
                      <span>Order Date: {order.orderDate.toLocaleDateString()}</span>
                      {order.deliveryDate && (
                        <>
                          <span>•</span>
                          <span>Delivered: {order.deliveryDate.toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {order.trackingNumber && (
                      <p className="text-sm text-blue-600 mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === 'delivered' && order.type === 'purchase' && (
                      <Button size="sm" variant="outline">
                        Leave Review
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 