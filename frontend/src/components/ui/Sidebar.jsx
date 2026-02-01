// components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home, Users, Ticket, Settings, LogOut,
  LucideChartSpline, ChevronDown
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "./shadcn-sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";

const MENU_CONFIG = {
  Manager: {
    top: [
      { name: "Dashboard", icon: Home, path: "/admin-dashboard" },
      { name: "Users", icon: Users, submenu: [{ name: "All Users", path: "/admin-dashboard/users" }] },
      { 
        name: "Tickets", 
        icon: Ticket, 
        submenu: [
          { name: "All Tickets", path: "/admin-dashboard/admin-tickets" },
          { name: "Pending", path: "/admin-dashboard/admin-pending-tickets" },
          { name: "New Ticket", path: "/admin-dashboard/admin-new-ticket" },
        ] 
      },
      { name: "Reports", icon: LucideChartSpline, path: "/admin-dashboard/admin-reports" },
    ],
    bottom: [
      { name: "Settings", icon: Settings, path: "/admin-dashboard/admin-settings" },
    ],
  },
  Reviewer: {
    top: [
      { name: "Dashboard", icon: Home, path: "/reviewer-dashboard" },
      { 
        name: "Tickets", 
        icon: Ticket, 
        submenu: [
          { name: "New Ticket", path: "/reviewer-dashboard/new-ticket" },
          { name: "Assigned", path: "/reviewer-dashboard/assigned-ticket" },
        ]
      },
      { name: "Report", icon: LucideChartSpline, path: "/reviewer-dashboard/report" },
    ],
    bottom: [
      { name: "Settings", icon: Settings, path: "/reviewer-dashboard/settings" },
    ],
  },
  Client: {
    top: [
      { name: "Dashboard", icon: Home, path: "/client-dashboard" },
      { 
        name: "My Tickets", 
        icon: Ticket, 
        submenu: [
          { name: "All Tickets", path: "/client-dashboard/all-tickets" },
          { name: "New Ticket", path: "/client-dashboard/new-ticket" },
        ]
      },
      { name: "Report", icon: LucideChartSpline, path: "/client-dashboard/report" },
    ],
    bottom: [
      { name: "Profile", icon: Users, path: "/client-dashboard/profile" },
    ],
  },
};

export function AppSidebar({ userRole }) {
  const { logout } = useAuthenticationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("See you later!", { duration: 2000 });
      navigate("/auth/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const currentMenu = MENU_CONFIG[userRole] || { top: [], bottom: [] };

  const isRouteActive = (path, submenu) => {
    if (path) return location.pathname === path;
    if (submenu) return submenu.some(sub => location.pathname === sub.path);
    return false;
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = isRouteActive(item.path, item.submenu);

    if (item.submenu) {
      return (
        <Collapsible key={item.name} asChild defaultOpen={isActive} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.name}>
                <Icon className={cn("size-4", isActive && "text-primary")} />
                <span className="font-medium">{item.name}</span>
                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.submenu.map((sub) => (
                  <SidebarMenuSubItem key={sub.name}>
                    <SidebarMenuSubButton asChild isActive={location.pathname === sub.path}>
                      <NavLink to={sub.path}>
                        <span>{sub.name}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton 
          asChild 
          tooltip={item.name}
          isActive={location.pathname === item.path}
        >
          <NavLink to={item.path}>
            <Icon className="size-4" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="sticky top-0 h-screen">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <img src="/solease.svg" alt="Logo" className="size-5 brightness-200" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold">SOLEASE</span>
                  <span className="truncate text-xs text-muted-foreground">{userRole}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenu.top.map((item) => <NavItem key={item.name} item={item} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {currentMenu.bottom.map((item) => <NavItem key={item.name} item={item} />)}
          <SidebarSeparator className="mx-0 my-2" />
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}