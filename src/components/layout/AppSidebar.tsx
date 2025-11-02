import { NavLink, useLocation } from "react-router-dom";
import { 
  Database, 
  Shield, 
  Settings, 
  Users, 
  BarChart3,
  Moon,
  Waves,
  ChevronRight,
  ShoppingCart
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Mission Statement", url: "/dashboard", icon: BarChart3 },
  // { title: "Data Analytics", url: "/analytics", icon: Database },
  // { title: "Data Marketplace", url: "/marketplace", icon: ShoppingCart },
];

const dataModules = [
  { 
    title: "Lunar Surface Data", 
    url: "/lunar", 
    icon: Moon,
    description: "Geological & atmospheric data"
  },
  // { 
  //   title: "Seabed Ecology", 
  //   url: "/seabed", 
  //   icon: Waves,
  //   description: "Marine ecosystem analysis"
  // },
];

const adminItems = [
  { title: "User Management", url: "/users", icon: Users },
  { title: "Security & CMMC", url: "/security", icon: Shield },
  { title: "System Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isDataModuleActive = dataModules.some((item) => isActive(item.url));

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} bg-gradient-celestial border-r border-sidebar-border/30`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div>
          <NavLink to={'/'} className="flex items-center mb-8 px-2">
            <img 
              src="/lovable-uploads/21fa0edb-b252-42c1-bd21-38a5e74baa22.png" 
              alt="Potomac Logo" 
              className={`${collapsed ? "w-8 h-8" : "w-10 h-10"}`}
            />
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-primary">POTOMAC</h1>
                <p className="text-xs text-sidebar-foreground/70">Scientific Database</p>
              </div>
            )}
          </NavLink>          
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider">
            {!collapsed ? "Navigation" : "Nav"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Data Modules */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider flex items-center">
            {!collapsed ? "Data Modules" : "Data"}
            {isDataModuleActive && <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-data-pulse" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto py-3">
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <div className="ml-3 flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-sidebar-foreground/50 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      )}
                      {!collapsed && <ChevronRight className="h-4 w-4 opacity-50" />}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider">
            {!collapsed ? "Administration" : "Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}