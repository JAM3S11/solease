// components/ui/Sidebar.jsx
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./shadcn-sidebar";
import { Button } from "./button";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";

// Extracted parts
import { MENU_CONFIG } from "../../config/menu.config";
import { CanvasLogo } from "./sidebar-parts/canvas-logo";
import { UserCard } from "./sidebar-parts/user-card";
import { NavItem } from "./sidebar-parts/nav-item";

/**
 * Main application sidebar component.
 */
export function AppSidebar({ userRole }) {
  const { logout, user } = useAuthenticationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, isMobile, toggleSidebar } = useSidebar();

  const isCollapsed = state === "collapsed";
  const currentMenu = MENU_CONFIG[userRole] ?? { top: [], bottom: [] };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success("See you later!", { duration: 2000 });
      navigate("/auth/login");
    } catch {
      toast.error("Logout failed");
    }
  }, [logout, navigate]);

  return (
    <Sidebar
      variant="default"
      collapsible="icon"
      className="sticky top-0 h-screen bg-sidebar dark:bg-background border-r border-sidebar-border dark:border-sidebar-border transition-colors duration-300"
    >
      {/* ── Header: Logo + App name + Collapse toggle ── */}
      <SidebarHeader className="py-4 border-b border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-12 transition-all duration-200 text-sidebar-foreground dark:text-sidebar-primary-foreground hover:bg-transparent cursor-default flex-1"
            >
              <div className="flex items-center gap-3">
                <CanvasLogo />
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden transition-all duration-200">
                  <span className="truncate font-bold text-sidebar-foreground dark:text-sidebar-primary-foreground tracking-wide">
                    SOLEASE
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60 dark:text-sidebar-foreground/70 font-medium">
                    {userRole}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>

            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "h-8 w-8 flex-shrink-0 hover:bg-sidebar-accent dark:hover:bg-sidebar-accent transition-all duration-200",
                  isCollapsed && "rotate-180"
                )}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Main nav items ── */}
      <SidebarContent className="py-3 bg-sidebar dark:bg-background">
        <SidebarMenu className="gap-1 px-2">
          {currentMenu.top.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              pathname={location.pathname}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* ── Footer: Bottom nav + User card + Logout ── */}
      <SidebarFooter className="py-3 border-t border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu className="gap-1 px-2">
          {currentMenu.bottom.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              pathname={location.pathname}
            />
          ))}

          {!isCollapsed && (
            <SidebarMenuItem className="mt-1">
              <UserCard user={user} />
            </SidebarMenuItem>
          )}

          <SidebarSeparator className="mx-0 my-2 bg-sidebar-border dark:bg-sidebar-border" />

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className={cn(
                "h-11 text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300 hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-all duration-200 rounded-md font-medium",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="size-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}