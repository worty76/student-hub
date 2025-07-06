'use client';

import { AdminPendingProducts } from '@/components/admin/AdminPendingProducts';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPendingProductsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto py-6">
        <AdminPendingProducts />
      </div>
    </ProtectedRoute>
  );
} 