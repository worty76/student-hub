'use client';

import { useState } from 'react';
import { AdminOverview } from './AdminOverview';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminAllProducts } from './AdminAllProducts';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings,
  Menu,
  X
} from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'products' | 'reports' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'users' as AdminTab, label: 'Quản lý người dùng', icon: Users },
    { id: 'products' as AdminTab, label: 'Quản lý sản phẩm', icon: Package },
    { id: 'reports' as AdminTab, label: 'Báo cáo', icon: FileText },
    { id: 'settings' as AdminTab, label: 'Cài đặt', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUserManagement />;
      case 'products':
        return <AdminAllProducts />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 lg:ml-0 flex flex-col">
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 