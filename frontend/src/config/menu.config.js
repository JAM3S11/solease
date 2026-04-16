import {
    Home, Users, Tickets, Settings, LucideChartSpline, NotepadText, Crown, Bot
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
                submenu: [
                    { name: "All Users", path: "/admin-dashboard/users" },
                    { name: "Plan Tier", path: "/admin-dashboard/plan-tier" },
                ],
            },
            {
                name: "Tickets",
                icon: Tickets,
                badge: 5,
                submenu: [
                    { name: "All Tickets", path: "/admin-dashboard/admin-tickets", badge: 3 },
                    { name: "Pending", path: "/admin-dashboard/admin-pending-tickets", badge: 2 },
                    { name: "New Ticket", path: "/admin-dashboard/admin-new-ticket" },
                ],
            },
            {
                name: "AI Assistant",
                icon: Bot,
                path: "/admin-dashboard/ai-chat",
            },
            { name: "Reports", icon: NotepadText, path: "/admin-dashboard/admin-reports" },
        ],
    },
    Reviewer: {
        top: [
            { name: "Dashboard", icon: Home, path: "/reviewer-dashboard" },
            {
                name: "Tickets",
                icon: Tickets,
                badge: 8,
                submenu: [
                    { name: "New Ticket", path: "/reviewer-dashboard/new-ticket" },
                    { name: "Assigned", path: "/reviewer-dashboard/assigned-ticket", badge: 8 },
                ],
            },
            {
                name: "AI Assistant",
                icon: Bot,
                path: "/reviewer-dashboard/ai-chat",
            },
            { name: "Reports", icon: NotepadText, path: "/reviewer-dashboard/report" },
        ],
    },
    Client: {
        top: [
            { name: "Dashboard", icon: Home, path: "/client-dashboard" },
            {
                name: "My Tickets",
                icon: Tickets,
                badge: 2,
                submenu: [
                    { name: "All Tickets", path: "/client-dashboard/all-tickets" },
                    { name: "New Ticket", path: "/client-dashboard/new-ticket" },
                ],
            },
            {
                name: "AI Assistant",
                icon: Bot,
                path: "/client-dashboard/ai-chat",
            },
            { name: "Report", icon: NotepadText, path: "/client-dashboard/report" },
        ],
    },
};
