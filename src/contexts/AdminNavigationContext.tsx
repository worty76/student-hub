'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AdminTab = 'overview' | 'users' | 'products' | 'pending-products' | 'reports' | 'profits' | 'settings';

interface AdminNavigationContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  getTabTitle: (tab: AdminTab) => string;
}

const AdminNavigationContext = createContext<AdminNavigationContextType | undefined>(undefined);

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);
  if (context === undefined) {
    throw new Error('useAdminNavigation must be used within an AdminNavigationProvider');
  }
  return context;
}

interface AdminNavigationProviderProps {
  children: ReactNode;
}

export function AdminNavigationProvider({ children }: AdminNavigationProviderProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const getTabTitle = (tab: AdminTab): string => {
    const titles = {
      'overview': 'Tổng quan',
      'users': 'Quản lý người dùng',
      'products': 'Quản lý sản phẩm',
      'pending-products': 'Sản phẩm chờ duyệt',
      'reports': 'Báo cáo',
      'profits': 'Thống kê lợi nhuận',
      'settings': 'Cài đặt',
    };
    return titles[tab];
  };

  return (
    <AdminNavigationContext.Provider 
      value={{ 
        activeTab, 
        setActiveTab, 
        getTabTitle 
      }}
    >
      {children}
    </AdminNavigationContext.Provider>
  );
} 