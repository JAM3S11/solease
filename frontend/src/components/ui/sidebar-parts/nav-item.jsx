import React, { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
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

export const NavItem = memo(({ item, isCollapsed, pathname }) => {
    const Icon = item.icon;
    const navigate = useNavigate();

    const isParentActive = item.path
        ? pathname === item.path
        : item.submenu?.some((s) => pathname === s.path) ?? false;

    const activeButtonCls = cn(
        "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold",
        "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:bg-blue-600 before:dark:bg-blue-400 before:rounded-r-full before:z-10"
    );
    const idleButtonCls = "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:scale-[1.01]";

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
                                "relative h-10 transition-all duration-200",
                                isParentActive ? activeButtonCls : idleButtonCls,
                                isCollapsed 
                                    ? "w-full justify-center rounded-lg mx-0 px-0" 
                                    : "rounded-lg mx-1 px-2"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg flex-shrink-0 transition-all duration-200",
                                isParentActive 
                                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover/collapsible:bg-slate-200 dark:group-hover/collapsible:bg-slate-700"
                            )}>
                                <Icon className="size-[18px]" />
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className={cn("flex-1 text-sm font-medium text-left", isParentActive ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-300")}>
                                        {item.name}
                                    </span>
                                    <Badge count={item.badge} />
                                    <ChevronDown
                                        className={cn(
                                            "size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180",
                                            isParentActive ? "text-blue-500" : "text-slate-400"
                                        )}
                                    />
                                </>
                            )}
                            {isCollapsed && (
                                <div className={cn(
                                    "absolute inset-0 rounded-lg ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900 pointer-events-none opacity-0 group-hover/collapsible:opacity-100 transition-opacity",
                                    isParentActive && "opacity-100"
                                )} />
                            )}
                            {isCollapsed && <Badge count={item.badge} small />}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {!isCollapsed && (
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-1 data-[state=closed]:slide-out-to-top-1 duration-200">
                            <SidebarMenuSub className="gap-0.5 pb-2 pl-2 pr-2">
                                {item.submenu.map((sub) => {
                                    const isSubActive = pathname === sub.path;
                                    return (
                                        <SidebarMenuSubItem key={sub.name}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isSubActive}
                                                className={cn(
                                                    "h-9 pl-10 pr-3 rounded-md transition-all duration-200 cursor-pointer my-0.5",
                                                    isSubActive
                                                        ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium border-l-[3px] border-blue-600 dark:border-blue-400"
                                                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
                    "relative h-10 transition-all duration-200 cursor-pointer",
                    isParentActive ? activeButtonCls : idleButtonCls,
                    isCollapsed 
                        ? "w-full justify-center rounded-lg mx-0 px-0" 
                        : "rounded-lg mx-1 px-2"
                )}
            >
                <NavLink
                    to={item.path}
                    className={cn("flex items-center gap-3 w-full px-1", isCollapsed && "justify-center")}
                >
                    <div className={cn(
                        "p-2 rounded-lg flex-shrink-0 transition-all duration-200",
                        isParentActive 
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    )}>
                        <Icon className="size-[18px]" />
                    </div>
                    {!isCollapsed && (
                        <>
                            <span className={cn("flex-1 text-sm font-medium text-left", isParentActive ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-300")}>
                                {item.name}
                            </span>
                            <Badge count={item.badge} />
                            {item.submenu && (
                                <ChevronRight
                                    className={cn(
                                        "size-4 flex-shrink-0",
                                        isParentActive ? "text-blue-500" : "text-slate-400"
                                    )}
                                />
                            )}
                        </>
                    )}
                    {isCollapsed && (
                        <div className={cn(
                            "absolute inset-0 rounded-lg ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900 pointer-events-none opacity-0 hover:opacity-100 transition-opacity",
                            isParentActive && "opacity-100"
                        )} />
                    )}
                    {isCollapsed && <Badge count={item.badge} small />}
                </NavLink>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
});

NavItem.displayName = "NavItem";
