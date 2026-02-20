import {
    Home, Users, Ticket, Settings, LucideChartSpline
} from "lucide-react";

/**
 * Sidebar navigation configuration organized by user role.
 */
export const MENU_CONFIG = {
    Manager: {
        top: [
            { name: "Dashboard", icon: Home, path: "/admin-dashboard" },
            {
                name: "Users",
                icon: Users,
                submenu: [{ name: "All Users", path: "/admin-dashboard/users" }],
            },
            {
                name: "Tickets",
                icon: Ticket,
                badge: 5,
                submenu: [
                    { name: "All Tickets", path: "/admin-dashboard/admin-tickets", badge: 3 },
                    { name: "Pending", path: "/admin-dashboard/admin-pending-tickets", badge: 2 },
                    { name: "New Ticket", path: "/admin-dashboard/admin-new-ticket" },
                ],
            },
            { name: "Reports", icon: LucideChartSpline, path: "/admin-dashboard/admin-reports" },
        ],
        // bottom: [
        //     { name: "Settings", icon: Settings, path: "/admin-dashboard/admin-settings" },
        // ],
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
                ],
            },
            { name: "Reports", icon: LucideChartSpline, path: "/reviewer-dashboard/report" },
        ],
        // bottom: [
        //     { name: "Settings", icon: Settings, path: "/reviewer-dashboard/settings" },
        // ],
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
                ],
            },
            { name: "Report", icon: LucideChartSpline, path: "/client-dashboard/report" },
        ],
        // bottom: [
        //     { name: "Profile", icon: Users, path: "/client-dashboard/profile" },
        // ],
    },
};
