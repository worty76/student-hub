"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type AdminTab = 'overview' | 'users' | 'products' | 'pending-products' | 'reports' | 'profits' | 'settings';

export function NavSecondary({
  items,
  activeTab,
  onTabChange,
  ...props
}: {
  items: {
    title: string
    tab: AdminTab | null
    icon: LucideIcon
  }[]
  activeTab?: AdminTab
  onTabChange?: (tab: AdminTab) => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                onClick={() => item.tab && onTabChange?.(item.tab)}
                isActive={activeTab === item.tab}
                className={activeTab === item.tab ? "bg-accent text-accent-foreground" : ""}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
