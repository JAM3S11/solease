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
              <SidebarMenuButton 
                tooltip={item.name}
                className={cn(
                  "md:h-auto h-12 md:py-2 py-3 transition-all duration-200",
                  isActive ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-sidebar-primary dark:text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <Icon className={cn("md:size-4 size-5 transition-colors duration-200", isActive && "text-primary font-semibold")} />
                <span className={cn("font-medium md:text-sm text-base transition-colors duration-200", isActive && "text-primary dark:text-white font-semibold")}>{item.name}</span>
                <ChevronDown className={cn("ml-auto md:size-4 size-5 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180", isActive && "text-primary")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:collapse">
              <SidebarMenuSub className="md:gap-1 gap-1.5">
                {item.submenu.map((sub) => (
                  <SidebarMenuSubItem key={sub.name}>
                    <SidebarMenuSubButton 
                      asChild 
                      isActive={location.pathname === sub.path}
                      className={cn(
                        "md:h-auto h-11 md:py-1.5 py-2.5 md:pl-6 pl-8 transition-all duration-200 rounded-md",
                        location.pathname === sub.path ? "bg-primary/15 dark:bg-primary/25 border-l-3 border-primary text-primary dark:text-white font-medium" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                    >
                      <NavLink to={sub.path}>
                        <span className="md:text-sm text-base">{sub.name}</span>
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
          className={cn(
            "md:h-auto h-12 md:py-2 py-3 transition-all duration-200",
            location.pathname === item.path ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-sidebar-primary dark:text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground"
          )}
        >
          <NavLink to={item.path}>
            <Icon className={cn("md:size-4 size-5 transition-colors duration-200", location.pathname === item.path && "text-primary font-semibold")} />
            <span className={cn("font-medium md:text-sm text-base transition-colors duration-200", location.pathname === item.path && "text-primary dark:text-white font-semibold")}>{item.name}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="default" collapsible="icon" className="sticky top-0 h-screen bg-sidebar dark:bg-background border-r border-sidebar-border dark:border-sidebar-border transition-colors duration-300">
      <SidebarHeader className="md:py-4 py-5 border-b border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-auto h-12 md:py-2 py-3 transition-all duration-200 text-sidebar-foreground dark:text-sidebar-primary-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square md:size-8 size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-200">
                  <img src="/solease.svg" alt="Logo" className="md:size-5 size-6 brightness-200" />
                </div>
                <div className="grid flex-1 text-left md:text-sm text-base leading-tight group-data-[collapsible=icon]:hidden transition-all duration-200">
                  <span className="truncate font-bold text-sidebar-foreground dark:text-sidebar-primary-foreground">SOLEASE</span>
                  <span className="truncate md:text-xs text-sm text-sidebar-foreground/70 dark:text-sidebar-foreground/80 font-medium">{userRole}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="md:py-4 py-5 bg-sidebar dark:bg-background">
        <SidebarGroup className="md:gap-3 gap-4">
          <SidebarGroupContent>
            <SidebarMenu className="md:gap-2 gap-2.5">
              {currentMenu.top.map((item) => <NavItem key={item.name} item={item} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="md:py-4 py-5 border-t border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu className="md:gap-2 gap-2.5">
          {currentMenu.bottom.map((item) => <NavItem key={item.name} item={item} />)}
          <SidebarSeparator className="mx-0 md:my-2 my-3 bg-sidebar-border dark:bg-sidebar-border" />
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className={cn(
                "md:h-auto h-12 md:py-2 py-3 text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300 hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-all duration-200 rounded-md font-medium",
              )}
            >
              <LogOut className="md:size-4 size-5" />
              <span className="md:text-sm text-base">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}