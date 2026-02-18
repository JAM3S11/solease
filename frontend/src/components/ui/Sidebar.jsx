// components/Sidebar.jsx
import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home, Users, Ticket, Settings, LogOut,
  LucideChartSpline, ChevronDown, ChevronLeft,
  Bell
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
import { Button } from "./button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";
import { useTheme } from "./theme-provider";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  return isDark;
};

const CanvasLogo = ({ isBlurred }) => {
  const canvasRef = useRef(null);
  const isDark = useDarkMode();

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    // CLear for redrawing
    ctx.clearRect(0, 0, 40, 40);

    // Background gradient based on the scroll state and dark mode
    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    if(isBlurred){
      gradient.addColorStop(0, '#2563EB');
      gradient.addColorStop(1, '#06B6D4');
    } else if (isDark) {
      gradient.addColorStop(0, '#60A5FA');
      gradient.addColorStop(1, '#22D3EE');
    } else {
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#06B6D4');
    }

    ctx.fillStyle = gradient;

    // Drew the S-shape layer
    const drawChevron = (yOffset, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(10, yOffset + 8);
      ctx.lineTo(20, yOffset);
      ctx.lineTo(30, yOffset + 8);
      ctx.lineTo(20, yOffset + 16);
      ctx.fill();
    }

    drawChevron(18, 0.6); // Bottom
    drawChevron(10, 0.8); // Middle
    drawChevron(2, 1);    // Top

    ctx.globalAlpha = 1;
  }, [isBlurred, isDark]);

  return <canvas ref={canvasRef} width='40' height='40' className="w-8 h-8 md:w-10 md:h-10" />
}

const MENU_CONFIG = {
  Manager: {
    top: [
      { name: "Dashboard", icon: Home, path: "/admin-dashboard" },
      { name: "Users", icon: Users, submenu: [{ name: "All Users", path: "/admin-dashboard/users" }] },
      { 
        name: "Tickets", 
        icon: Ticket, 
        badge: 5,
        submenu: [
          { name: "All Tickets", path: "/admin-dashboard/admin-tickets", badge: 3 },
          { name: "Pending", path: "/admin-dashboard/admin-pending-tickets", badge: 2 },
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
        badge: 8,
        submenu: [
          { name: "New Ticket", path: "/reviewer-dashboard/new-ticket" },
          { name: "Assigned", path: "/reviewer-dashboard/assigned-ticket", badge: 8 },
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
        badge: 2,
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
  const { logout, user } = useAuthenticationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

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

  const isSubmenuActive = (submenu) => {
    if (!submenu) return false;
    return submenu.some(sub => location.pathname === sub.path);
  };

  const NavItem = ({ item, isCollapsed }) => {
    const Icon = item.icon;
    const isActive = isRouteActive(item.path, item.submenu);
    const isSubmenuItemActive = isSubmenuActive(item.submenu);

    const handleKeyDown = (e, path) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate(path);
      }
    };

    if (item.submenu) {
      return (
        <Collapsible key={item.name} asChild defaultOpen={isActive || isSubmenuItemActive} className="group/collapsible w-full">
          <SidebarMenuItem className={isCollapsed ? "flex justify-center" : ""}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton 
                tooltip={item.name}
                className={cn(
                  "transition-all duration-200 hover:scale-[1.02] h-12",
                  isActive || isSubmenuItemActive ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-sidebar-primary dark:text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground",
                  isCollapsed ? "w-12 justify-center px-0" : "py-2"
                )}
              >
                <Icon className={cn("size-5 transition-colors duration-200 flex-shrink-0", (isActive || isSubmenuItemActive) ? "text-primary font-semibold" : "")} />
                {!isCollapsed && (
                  <>
                    <span className={cn("font-medium text-sm transition-colors duration-200 flex-1", (isActive || isSubmenuItemActive) ? "text-primary dark:text-white font-semibold" : "")}>{item.name}</span>
                    {item.badge > 0 ? (
                      <span className="ml-auto bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    ) : null}
                    <ChevronDown className={cn("ml-auto size-5 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180", (isActive || isSubmenuItemActive) ? "text-primary" : "")} />
                  </>
                )}
                {isCollapsed && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium px-1 py-0.5 rounded-full min-w-[16px] text-center">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:collapse">
                <SidebarMenuSub className="gap-1.5">
                  {item.submenu.map((sub) => (
                    <SidebarMenuSubItem key={sub.name}>
                      <SidebarMenuSubButton 
                        asChild 
                        isActive={location.pathname === sub.path}
                        className={cn(
                          "h-11 py-2.5 pl-8 transition-all duration-200 rounded-md hover:scale-[1.02] hover:shadow-sm cursor-pointer",
                          location.pathname === sub.path ? "bg-primary/15 dark:bg-primary/25 border-l-3 border-primary text-primary dark:text-white font-medium" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground"
                        )}
                      >
                        <NavLink 
                          to={sub.path}
                          tabIndex={0}
                          onKeyDown={(e) => handleKeyDown(e, sub.path)}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="text-base">{sub.name}</span>
                          {sub.badge > 0 ? (
                            <span className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center ml-2">
                              {sub.badge}
                            </span>
                          ) : null}
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.name} className={isCollapsed ? "flex justify-center" : ""}>
        <SidebarMenuButton 
          asChild 
          tooltip={item.name}
          isActive={location.pathname === item.path}
          onKeyDown={(e) => handleKeyDown(e, item.path)}
          className={cn(
            "transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer h-12",
            location.pathname === item.path ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-sidebar-primary dark:text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground",
            isCollapsed ? "w-12 justify-center px-0" : "py-2"
          )}
        >
          <NavLink to={item.path} tabIndex={0} className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "")}>
            <Icon className={cn("size-5 transition-colors duration-200 flex-shrink-0", location.pathname === item.path ? "text-primary font-semibold" : "")} />
            {!isCollapsed && (
              <>
                <span className={cn("font-medium text-sm transition-colors duration-200", location.pathname === item.path ? "text-primary dark:text-white font-semibold" : "")}>{item.name}</span>
                {item.badge > 0 ? (
                  <span className="ml-auto bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
            {isCollapsed && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium px-1 py-0.5 rounded-full min-w-[16px] text-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="default" collapsible="icon" className="sticky top-0 h-screen bg-sidebar dark:bg-background border-r border-sidebar-border dark:border-sidebar-border transition-colors duration-300">
      <SidebarHeader className="md:py-4 py-5 border-b border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton size="lg" asChild className="md:h-auto h-12 md:py-2 py-3 transition-all duration-200 text-sidebar-foreground dark:text-sidebar-primary-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent flex-1">
              <div className="flex items-center gap-3">
                <CanvasLogo />
                <div className="grid flex-1 text-left md:text-sm text-base leading-tight group-data-[collapsible=icon]:hidden transition-all duration-200">
                  <span className="truncate font-bold text-sidebar-foreground dark:text-sidebar-primary-foreground">SOLEASE</span>
                  <span className="truncate md:text-xs text-sm text-sidebar-foreground/70 dark:text-sidebar-foreground/80 font-medium">{userRole}</span>
                </div>
              </div>
            </SidebarMenuButton>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "md:flex hidden h-8 w-8 hover:bg-sidebar-accent dark:hover:bg-sidebar-accent transition-all duration-200",
                state === "collapsed" ? "rotate-180" : ""
              )}
              title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
            </Button>
          </SidebarMenuItem>
          {user && state !== "collapsed" && (
            <SidebarMenuItem className="px-2 mt-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50 dark:bg-sidebar-accent/30">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-sidebar-foreground dark:text-sidebar-primary-foreground">
                    {user.name || 'User'}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70 dark:text-sidebar-foreground/80">
                    {user.email || ''}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="md:py-4 py-5 bg-sidebar dark:bg-background">
        <SidebarGroup className="md:gap-3 gap-4">
          <SidebarGroupContent>
            <SidebarMenu className="md:gap-2 gap-2.5">
              {currentMenu.top.map((item) => <NavItem key={item.name} item={item} isCollapsed={state === "collapsed"} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="md:py-4 py-5 border-t border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-background">
        <SidebarMenu className="md:gap-2 gap-2.5">
          {currentMenu.bottom.map((item) => <NavItem key={item.name} item={item} isCollapsed={state === "collapsed"} />)}
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