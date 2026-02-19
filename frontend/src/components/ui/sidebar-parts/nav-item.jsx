import React, { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "../shadcn-sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible";
import useNotificationStore from "../../../store/notificationStore";
import { cn } from "../../../lib/utils";

/**
 * A notification badge component.
 */
export const Badge = ({ count, small = false }) => {
    const { notificationsEnabled } = useNotificationStore();
    if (!notificationsEnabled || !count || count <= 0) return null;
    return (
        <span
            className={cn(
                "bg-red-500 text-white font-semibold rounded-full text-center leading-none",
                small
                    ? "absolute -top-1 -right-1 text-[9px] px-1 py-px min-w-[16px]"
                    : "ml-auto text-xs px-1.5 py-0.5 min-w-[20px]"
            )}
        >
            {count}
        </span>
    );
};

/**
 * A memoized navigation item component used in the side menu.
 */
export const NavItem = memo(({ item, isCollapsed, pathname }) => {
    const Icon = item.icon;
    const navigate = useNavigate();

    const isParentActive = item.path
        ? pathname === item.path
        : item.submenu?.some((s) => pathname === s.path) ?? false;

    const activeButtonCls = "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-primary dark:text-white font-semibold";
    const idleButtonCls = "hover:bg-sidebar-accent dark:hover:bg-sidebar-accent text-sidebar-foreground";

    if (item.submenu) {
        return (
            <Collapsible
                asChild
                defaultOpen={isParentActive}
                className="group/collapsible w-full"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.name}
                            className={cn(
                                "relative h-11 transition-all duration-200 hover:scale-[1.02]",
                                isParentActive ? activeButtonCls : idleButtonCls,
                                isCollapsed && "w-12 justify-center px-0"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-5 flex-shrink-0 transition-colors duration-200",
                                    isParentActive && "text-primary"
                                )}
                            />
                            {!isCollapsed && (
                                <>
                                    <span className={cn("flex-1 text-sm font-medium", isParentActive && "text-primary dark:text-white font-semibold")}>
                                        {item.name}
                                    </span>
                                    <Badge count={item.badge} />
                                    <ChevronDown
                                        className={cn(
                                            "size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180",
                                            isParentActive && "text-primary"
                                        )}
                                    />
                                </>
                            )}
                            {isCollapsed && <Badge count={item.badge} small />}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {!isCollapsed && (
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:collapse">
                            <SidebarMenuSub className="gap-1">
                                {item.submenu.map((sub) => {
                                    const isSubActive = pathname === sub.path;
                                    return (
                                        <SidebarMenuSubItem key={sub.name}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isSubActive}
                                                className={cn(
                                                    "h-10 pl-7 rounded-md transition-all duration-200 hover:scale-[1.01] cursor-pointer",
                                                    isSubActive
                                                        ? "bg-primary/15 dark:bg-primary/25 border-l-2 border-primary text-primary dark:text-white font-medium"
                                                        : "hover:bg-sidebar-accent text-sidebar-foreground"
                                                )}
                                            >
                                                <NavLink
                                                    to={sub.path}
                                                    className="flex items-center justify-between w-full"
                                                >
                                                    <span className="text-sm">{sub.name}</span>
                                                    <Badge count={sub.badge} />
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    );
                                })}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    )}
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                tooltip={item.name}
                isActive={pathname === item.path}
                className={cn(
                    "relative h-11 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm cursor-pointer",
                    isParentActive ? activeButtonCls : idleButtonCls,
                    isCollapsed && "w-12 justify-center px-0"
                )}
            >
                <NavLink
                    to={item.path}
                    className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
                >
                    <Icon
                        className={cn(
                            "size-5 flex-shrink-0 transition-colors duration-200",
                            isParentActive && "text-primary"
                        )}
                    />
                    {!isCollapsed && (
                        <>
                            <span className={cn("flex-1 text-sm font-medium", isParentActive && "text-primary dark:text-white font-semibold")}>
                                {item.name}
                            </span>
                            <Badge count={item.badge} />
                        </>
                    )}
                    {isCollapsed && <Badge count={item.badge} small />}
                </NavLink>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
});

NavItem.displayName = "NavItem";
