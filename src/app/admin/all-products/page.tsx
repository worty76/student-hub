'use client';

import { AdminAllProducts } from '@/components/admin/AdminAllProducts';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminAllProductsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto py-6">
        <AdminAllProducts />
      </div>
    </ProtectedRoute>
  );
} 