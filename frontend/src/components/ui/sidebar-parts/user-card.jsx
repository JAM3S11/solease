import React, { memo, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import useNotificationStore from "../../../store/notificationStore";
import { cn } from "../../../lib/utils";

/**
 * UserCard component displaying user info and notification settings.
 */
export const UserCard = memo(({ user }) => {
    const { notificationsEnabled, fetchNotificationPreference, toggleNotifications } =
        useNotificationStore();

    useEffect(() => {
        fetchNotificationPreference();
    }, [fetchNotificationPreference]);

    const handleToggle = async () => {
        try {
            await toggleNotifications(!notificationsEnabled);
            toast.success(
                notificationsEnabled ? "Notifications turned off" : "Notifications turned on",
                { duration: 2000 }
            );
        } catch {
            toast.error("Failed to update notification preference");
        }
    };

    if (!user) return null;

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/50 dark:bg-sidebar-accent/30 border border-sidebar-border/50">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="truncate text-sm font-semibold text-sidebar-foreground dark:text-sidebar-primary-foreground">
                    {user.name ?? "User"}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60 dark:text-sidebar-foreground/70">
                    {user.email ?? ""}
                </span>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-7 w-7 flex-shrink-0 hover:bg-sidebar-accent transition-colors duration-200",
                            !notificationsEnabled && "text-muted-foreground/50 hover:text-muted-foreground"
                        )}
                        title={notificationsEnabled ? "Notifications on" : "Notifications off"}
                    >
                        {notificationsEnabled ? (
                            <Bell className="h-4 w-4" />
                        ) : (
                            <BellOff className="h-4 w-4" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-64 p-3">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-foreground">Notifications</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Email &amp; in-app alerts</p>
                            </div>
                            <button
                                onClick={handleToggle}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    notificationsEnabled ? "bg-primary" : "bg-muted-foreground/30"
                                )}
                                role="switch"
                                aria-checked={notificationsEnabled}
                                aria-label="Toggle notifications"
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300",
                                        notificationsEnabled ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>
                        <p className={cn(
                            "text-xs font-medium",
                            notificationsEnabled ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                        )}>
                            {notificationsEnabled
                                ? "✓ You will receive email and in-app alerts"
                                : "✗ All notifications are muted"}
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
});

UserCard.displayName = "UserCard";
