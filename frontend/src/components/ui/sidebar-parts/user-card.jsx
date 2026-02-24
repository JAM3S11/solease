import React, { memo, useEffect, useState } from "react";
import { ChevronsUpDown, Sparkles, CheckCircle2, CreditCard, Bell, LogOut, Settings, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import useNotificationStore from "../../../store/notificationStore";
import { cn } from "../../../lib/utils";

import {
    SidebarMenuButton,
} from "../shadcn-sidebar";
import { useNavigate } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";

export const UserCard = memo(({ user, isCollapsed, onLogout, userRole }) => {
    const { notificationsEnabled, fetchNotificationPreference, toggleNotifications } =
        useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isUseMobile = useIsMobile();
    const position = isUseMobile ? 'top-center' : 'top-right';

    useEffect(() => {
        fetchNotificationPreference();
    }, [fetchNotificationPreference]);

    const handleToggle = async () => {
        try {
            await toggleNotifications(!notificationsEnabled);
            toast.success(
                notificationsEnabled ? "Notifications turned off" : "Notifications turned on", {
                    position,
                    description: notificationsEnabled ? "You shall not receive any notification" : "You shall receive updates",
                    action: {
                        label: notificationsEnabled ? "Disabled" : "Enabled"
                    }
                }
            );
        } catch {
            toast.error("Failed to update notification preference");
        }
    };

    if (!user) return null;

    const getSettingsPath = (role) => {
        switch(role){
            case "Manager":
                return "/admin-dashboard/admin-settings";
            case "Reviewer":
                return "/reviewer-dashboard/settings";
            case "Client":
            default: 
                return "/client-dashboard/profile";
        }
    }

    const menuItems = [
        { 
            icon: Sparkles, 
            label: "Upgrade to Pro", 
            onClick: () => {},
            isUpgrade: true,
            description: "Unlock all features"
        },
    ];

    const settingsItems = [
        { 
            icon: CheckCircle2, 
            label: "Account", 
            onClick: () => navigate(getSettingsPath(userRole)),
            description: "Profile & settings"
        },
        { 
            icon: CreditCard, 
            label: "Billing", 
            onClick: () => {},
            description: "Payment methods",
            badge: "Coming Soon"
        },
        { 
            icon: Bell, 
            label: "Notifications", 
            onClick: handleToggle,
            description: notificationsEnabled ? "Enabled" : "Disabled",
            isActive: notificationsEnabled
        },
    ];

    const Content = (
        <div className={cn(
            "flex items-center gap-3 w-full transition-all duration-300 rounded-lg",
            isOpen && "bg-gray-50 dark:bg-gray-800/50",
            isCollapsed ? "justify-center px-0 py-2" : "px-3 py-2.5"
        )}>
            <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-75"></span>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    <div className="flex flex-col flex-1 min-w-0 text-left animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {user.name ?? "User"}
                        </span>
                        <span className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                            {user.email ?? ""}
                        </span>
                    </div>
                    <ChevronsUpDown className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-auto" />
                </>
            )}
        </div>
    );

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="h-auto p-0 hover:bg-transparent group-data-[collapsible=icon]:!p-0 w-full"
                    tooltip={isCollapsed ? user.name : undefined}
                >
                    {Content}
                </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent 
                side="top"
                align="start" 
                sideOffset={6}
                alignOffset={0}
                className="w-64 p-0 shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
            >
                {/* User Info Header */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full">
                            <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-75"></span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {user.name ?? "User"}
                        </span>
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {user.email ?? ""}
                        </span>
                        <span className="truncate text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mt-0.5">
                            {userRole}
                        </span>
                    </div>
                </div>

                {/* Upgrade to Pro */}
                <div className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-800/30">
                    <button
                        onClick={menuItems[0].onClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200 group"
                    >
                        <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
                            <Sparkles className="size-4 text-white" />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                            <span className="text-sm font-bold text-white">{menuItems[0].label}</span>
                            <span className="text-[10px] text-white/80">{menuItems[0].description}</span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-orange-600 rounded-full">NEW</span>
                    </button>
                </div>

                {/* Settings Items */}
                <div className="py-1 px-1">
                    {settingsItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group mx-1",
                                    item.badge 
                                        ? "opacity-70 cursor-not-allowed" 
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg flex-shrink-0 transition-all duration-200",
                                    item.isActive !== undefined 
                                        ? item.isActive 
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-600" 
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                        : item.badge
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110"
                                )}>
                                    <Icon className="size-4" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <span className={cn(
                                        "text-sm font-medium text-left w-full",
                                        item.badge 
                                            ? "text-gray-500 dark:text-gray-400" 
                                            : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                    )}>
                                        {item.label}
                                    </span>
                                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                        {item.description}
                                    </span>
                                </div>
                                {item.badge && (
                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {item.isActive !== undefined && !item.badge && (
                                    <span className={cn(
                                        "w-2 h-2 rounded-full flex-shrink-0",
                                        item.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="mx-4 my-1 h-px bg-gray-100 dark:bg-gray-800" />

                {/* Help & Support */}
                <div className="py-1.5 px-1">
                    <button
                        onClick={() => {}}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 mx-1"
                    >
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            <HelpCircle className="size-4" />
                        </div>
                        <span className="text-sm font-medium">Help & Support</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-4 my-1 h-px bg-gray-100 dark:bg-gray-800" />

                {/* Logout */}
                <div className="py-1.5 px-1 pb-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group mx-1"
                    >
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                            <LogOut className="size-4" />
                        </div>
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
});

UserCard.displayName = "UserCard";
