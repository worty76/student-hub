'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  AlertTriangle, 
  User,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Report {
  _id: string;
  type: 'user' | 'product';
  reason: string;
  description: string;
  reporter: {
    _id: string;
    name: string;
    email: string;
  };
  reported: {
    _id: string;
    name: string;
    email?: string;
    title?: string;
  };
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<Report['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Report['status'] | 'all'>('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockReports: Report[] = [
          {
            _id: '1',
            type: 'user',
            reason: 'inappropriate',
            description: 'User is sending inappropriate messages to other users',
            reporter: {
              _id: '1',
              name: 'John Doe',
              email: 'john.doe@student.edu'
            },
            reported: {
              _id: '4',
              name: 'Suspended User',
              email: 'suspended.user@student.edu'
            },
            status: 'pending',
            createdAt: '2024-01-20T14:30:00Z'
          },
          {
            _id: '2',
            type: 'product',
            reason: 'fraud',
            description: 'Product description does not match the actual item',
            reporter: {
              _id: '2',
              name: 'Jane Smith',
              email: 'jane.smith@student.edu'
            },
            reported: {
              _id: '3',
              name: 'Gaming Chair - Red',
              title: 'Gaming Chair - Red'
            },
            status: 'resolved',
            createdAt: '2024-01-18T10:15:00Z',
            resolvedAt: '2024-01-19T09:30:00Z'
          },
          {
            _id: '3',
            type: 'user',
            reason: 'spam',
            description: 'User is posting too many listings in a short time',
            reporter: {
              _id: '3',
              name: 'Admin User',
              email: 'admin@studenthub.com'
            },
            reported: {
              _id: '5',
              name: 'Spammer User',
              email: 'spammer@student.edu'
            },
            status: 'dismissed',
            createdAt: '2024-01-17T16:45:00Z',
            resolvedAt: '2024-01-18T08:20:00Z'
          },
          {
            _id: '4',
            type: 'product',
            reason: 'offensive',
            description: 'Product contains offensive content in description',
            reporter: {
              _id: '1',
              name: 'John Doe',
              email: 'john.doe@student.edu'
            },
            reported: {
              _id: '4',
              name: 'iPhone 12 Pro',
              title: 'iPhone 12 Pro'
            },
            status: 'pending',
            createdAt: '2024-01-19T12:00:00Z'
          },
        ];
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesType && matchesStatus;
  });

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      // Mock action - replace with actual API call
      setReports(prevReports => 
        prevReports.map(report => {
          if (report._id === reportId) {
            return {
              ...report,
              status: action === 'resolve' ? 'resolved' as const : 'dismissed' as const,
              resolvedAt: new Date().toISOString()
            };
          }
          return report;
        })
      );
    } catch (error) {
      console.error('Error performing report action:', error);
    }
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'inappropriate':
        return 'bg-red-100 text-red-800';
      case 'fraud':
        return 'bg-orange-100 text-orange-800';
      case 'spam':
        return 'bg-purple-100 text-purple-800';
      case 'offensive':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Review and manage user and product reports</p>
        </div>
        <Button onClick={fetchReports} variant="outline" size="sm">
          Refresh Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Reports
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolved Reports
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reports
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={typeFilter} onValueChange={(value: Report['type'] | 'all') => setTypeFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">User Reports</SelectItem>
                <SelectItem value="product">Product Reports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: Report['status'] | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {report.type === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Package className="h-4 w-4 text-green-600" />
                      )}
                      <span className="capitalize">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getReasonBadgeColor(report.reason)}`} variant="secondary">
                      {report.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.reporter.name}</div>
                      <div className="text-sm text-gray-500">{report.reporter.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.reported.name}</div>
                      {report.reported.email && (
                        <div className="text-sm text-gray-500">{report.reported.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusBadgeColor(report.status)}`} variant="secondary">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Resolve Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to mark this report as resolved? This will indicate that appropriate action has been taken.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleReportAction(report._id, 'resolve')}
                              >
                                Resolve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dismiss Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to dismiss this report? This will mark it as not requiring action.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleReportAction(report._id, 'dismiss')}
                              >
                                Dismiss
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    {report.status !== 'pending' && (
                      <span className="text-sm text-gray-500">
                        {report.resolvedAt && new Date(report.resolvedAt).toLocaleDateString()}
                      </span>
                    )}
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