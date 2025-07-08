"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type AdminTab = 'overview' | 'users' | 'products' | 'pending-products' | 'reports' | 'profits' | 'settings';

export function NavMain({
  items,
  activeTab,
  onTabChange,
}: {
  items: {
    title: string
    tab: AdminTab | null
    icon?: LucideIcon
  }[]
  activeTab?: AdminTab
  onTabChange?: (tab: AdminTab) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => item.tab && onTabChange?.(item.tab)}
                isActive={activeTab === item.tab}
                className={activeTab === item.tab ? "bg-accent text-accent-foreground" : ""}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
