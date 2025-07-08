'use client';

import { AdminOverview } from './AdminOverview';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminAllProducts } from './AdminAllProducts';
import { AdminPendingProducts } from './AdminPendingProducts';
import { AdminReports } from './AdminReports';
import { AdminProfitStatistics } from './AdminProfitStatistics';
import { AdminSettings } from './AdminSettings';
import { useAdminNavigation } from '@/contexts/AdminNavigationContext';

export function AdminDashboardContent() {
  const { activeTab } = useAdminNavigation();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUserManagement />;
      case 'products':
        return <AdminAllProducts />;
      case 'pending-products':
        return <AdminPendingProducts />;
      case 'reports':
        return <AdminReports />;
      case 'profits':
        return <AdminProfitStatistics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="h-full max-h-[calc(100vh-200px)] overflow-y-auto space-y-6 px-4 lg:px-6">
      {renderActiveTab()}
    </div>
  );
} 