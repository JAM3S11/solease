// components/ui/Sidebar.jsx
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronsUpDown, Hash, Clock, Briefcase, MoreHorizontal, Plus, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./shadcn-sidebar";
import { Button } from "./button";
import { useAuthenticationStore } from "../../store/authStore";
import { toast } from "sonner"
import { cn } from "../../lib/utils";

import { MENU_CONFIG } from "../../config/menu.config";
import { CanvasLogo } from "./sidebar-parts/canvas-logo";
import { UserCard } from "./sidebar-parts/user-card";
import { NavItem } from "./sidebar-parts/nav-item";

export function AppSidebar({ userRole }) {
  const { logout, user } = useAuthenticationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, isMobile, toggleSidebar } = useSidebar();

  const isCollapsed = state === "collapsed";
  const currentMenu = MENU_CONFIG[userRole] ?? { top: [] };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success(`See you later ${user.name}`, {
        position: "bottom-right",
        description: "It was a pleasure having you in our platform",
        action: {
          label: "Sign out successfully"
        }
      });
      navigate("/auth/login");
    } catch {
      toast.error("Signing out failed.", {
        position: "bottom-right",
        description: "Please try again later!",
        action: {
          label: "Sign out unsuccessfull"
        }
      });
    }
  }, [logout, navigate]);

  // Sample projects data
  // const projects = [
  //   { name: "Design Engineering", icon: Hash },
  //   { name: "Sales & Marketing", icon: Clock },
  //   { name: "Travel", icon: Briefcase },
  // ];

  return (
    <Sidebar
      variant="default"
      collapsible="icon"
      className="sticky top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 group/sidebar"
    >
      {/* Header: Logo + Company name + Tier + Dropdown */}
      <SidebarHeader className={cn(
        "py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300",
        isCollapsed ? "px-0" : "px-3"
      )}>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center">
            <SidebarMenuButton
              size="lg"
              className="h-auto transition-all duration-200 text-gray-900 dark:text-white hover:bg-transparent cursor-pointer flex-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
              <div className={cn(
                "flex items-center w-full transition-all duration-300",
                isCollapsed ? "justify-center gap-0" : "gap-1 px-2P"
              )}>
                <div className="relative flex-shrink-0">
                  <CanvasLogo />
                </div>
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <div className="grid flex-1 text-left text-sm leading-tight animate-in fade-in slide-in-from-left-2">
                      <span className="truncate font-bold text-gray-900 dark:text-white text-base">
                        SOLEASE
                      </span>
                      <span className="truncate text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
                        {userRole || "Enterprise"}
                      </span>
                    </div>
                    <ChevronsUpDown className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                )}
              </div>
            </SidebarMenuButton>
            
            {/* {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-7 w-7 absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm z-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )} */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main nav items */}
      <SidebarContent className="py-4 bg-white dark:bg-gray-900 custom-scrollbar">
        <SidebarMenu className={cn("gap-1 transition-all duration-300", isCollapsed ? "px-0" : "px-2")}>
          {currentMenu.top.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              pathname={location.pathname}
            />
          ))}
        </SidebarMenu>

        {/* Projects Section - Now handles collapsed state */}
        {/* <div className={cn("mt-8 transition-all duration-300", isCollapsed ? "px-0" : "px-2")}>
          <div className={cn(
            "px-3 mb-2 flex items-center justify-between",
            isCollapsed && "justify-center px-0"
          )}>
            {!isCollapsed ? (
              <>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Projects
                </span>
                <Plus className="size-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
              </>
            ) : (
              <div className="h-px w-8 bg-gray-100 dark:bg-gray-800" />
            )}
          </div>
          <SidebarMenu className="gap-1">
            {projects.map((project, index) => {
              const ProjectIcon = project.icon;
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    tooltip={isCollapsed ? project.name : undefined}
                    className={cn(
                      "h-9 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200",
                      isCollapsed ? "justify-center px-0 rounded-none" : "rounded-lg px-3"
                    )}
                  >
                    <ProjectIcon className="size-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="flex-1 text-sm font-medium ml-3 truncate animate-in fade-in slide-in-from-left-2">
                        {project.name}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={isCollapsed ? "More Projects" : undefined}
                className={cn(
                  "h-9 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200",
                  isCollapsed ? "justify-center px-0 rounded-none" : "rounded-lg px-3"
                )}
              >
                <MoreHorizontal className="size-4 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1 text-sm font-medium ml-3">More</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div> */}
      </SidebarContent>

      {/* Footer: Bottom nav + User card */}
      <SidebarFooter className="py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <SidebarMenu className={cn("gap-1 transition-all duration-300", isCollapsed ? "px-0" : "px-2")}>
          {/* {currentMenu.bottom.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              pathname={location.pathname}
            />
          ))} */}

          <SidebarMenuItem className={cn("transition-all duration-300", isCollapsed ? "mt-2" : "mt-4")}>
            <UserCard user={user} userRole={userRole} isCollapsed={isCollapsed} onLogout={handleLogout} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}