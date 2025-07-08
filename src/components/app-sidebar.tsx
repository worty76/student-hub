"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Package,
  Clock,
  FileText,
  Settings,
  Shield,
  DollarSign,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from '@/store/authStore'
import { useAdminNavigation } from '@/contexts/AdminNavigationContext'
import Link from "next/link"

type AdminTab = 'overview' | 'users' | 'products' | 'pending-products' | 'reports' | 'profits' | 'settings';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { activeTab, setActiveTab } = useAdminNavigation();

  const data = {
    navMain: [
      {
        title: "Tổng quan",
        tab: "overview" as AdminTab,
        icon: LayoutDashboard,
      },
      {
        title: "Quản lý người dùng", 
        tab: "users" as AdminTab,
        icon: Users,
      },
      {
        title: "Quản lý sản phẩm",
        tab: "products" as AdminTab,
        icon: Package,
      },
      {
        title: "Sản phẩm chờ duyệt",
        tab: "pending-products" as AdminTab,
        icon: Clock,
      },
      {
        title: "Báo cáo",
        tab: "reports" as AdminTab,
        icon: FileText,
      },
      {
        title: "Thống kê lợi nhuận",
        tab: "profits" as AdminTab,
        icon: DollarSign,
      },
    ],
    navSecondary: [
      {
        title: "Cài đặt",
        tab: "settings" as AdminTab,
        icon: Settings,
      }
    ]
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Shield className="!size-5" />
                <span className="text-base font-semibold">Admin Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} activeTab={activeTab} onTabChange={setActiveTab} />
        <NavSecondary items={data.navSecondary} activeTab={activeTab} onTabChange={setActiveTab} />
      </SidebarContent>
      <SidebarFooter>
        <Link href="/" className="flex items-center gap-2 mb-2 font-bold hover:text-white bg-blue-500 text-white p-3 rounded-md">
          <Home className="w-4 h-4" />
          Chuyển đến trang chủ
        </Link>
        <NavUser user={{
          name: user?.name || "Admin",
          email: user?.email || "admin@example.com",
          avatar: user?.avatar || "/avatars/admin.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
