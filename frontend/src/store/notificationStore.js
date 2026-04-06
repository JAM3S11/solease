import { create } from "zustand";
import api from "../lib/axios";

const getNotificationId = (notification) => notification?._id || notification?.id;
const countUnread = (notifications = []) => notifications.filter((n) => !n.read).length;

const useNotificationStore = create((set) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    notificationsEnabled: true,

    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/notifications");
            const fetchedNotifications = res.data.notifications || [];
            set({
                notifications: fetchedNotifications,
                unreadCount:
                    typeof res.data.unreadCount === "number"
                        ? res.data.unreadCount
                        : countUnread(fetchedNotifications),
                loading: false
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({
                error: error.response?.data?.message || "Error fetching notifications",
                loading: false
            });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const res = await api.get("/notifications/unread-count");
            if (typeof res.data.unreadCount === "number") {
                set({ unreadCount: res.data.unreadCount });
            } else {
                set((state) => ({ unreadCount: countUnread(state.notifications) }));
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    },

    markAsRead: async (notificationId) => {
        if (!notificationId) return;
        try {
            const res = await api.put(`/notifications/${notificationId}/read`);
            set((state) => {
                const nextNotifications = state.notifications.map(n =>
                    getNotificationId(n) === notificationId ? { ...n, read: true } : n
                );
                return {
                    notifications: nextNotifications,
                    unreadCount:
                        typeof res?.data?.unreadCount === "number"
                            ? res.data.unreadCount
                            : countUnread(nextNotifications)
                };
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    },

    markAsUnread: async (notificationId) => {
        if (!notificationId) return;
        try {
            const res = await api.put(`/notifications/${notificationId}/unread`);
            set((state) => {
                const nextNotifications = state.notifications.map(n =>
                    getNotificationId(n) === notificationId ? { ...n, read: false } : n
                );
                return {
                    notifications: nextNotifications,
                    unreadCount:
                        typeof res?.data?.unreadCount === "number"
                            ? res.data.unreadCount
                            : countUnread(nextNotifications)
                };
            });
        } catch (error) {
            console.error("Error marking notification as unread:", error);
        }
    },

    markAllAsRead: async () => {
        try {
            await api.put("/notifications/read-all");
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    },

    unmarkAllAsRead: async () => {
        try {
            await api.put("/notifications/unread-all");
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: false })),
                unreadCount: state.notifications.length
            }));
        } catch (error) {
            console.error("Error unmarking all notifications as read:", error);
        }
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    fetchNotificationPreference: async () => {
        try {
            const res = await api.get("/notifications/preferences");
            set({ notificationsEnabled: res.data.notificationsEnabled });
        } catch (error) {
            console.error("Error fetching notification preference:", error);
        }
    },

    toggleNotifications: async (enabled) => {
        // Optimistically update UI first
        set({ notificationsEnabled: enabled });
        try {
            await api.patch("/notifications/preferences", { enabled });
        } catch (error) {
            // Revert on failure
            set({ notificationsEnabled: !enabled });
            console.error("Error toggling notifications:", error);
            throw error;
        }
    },
}));

export default useNotificationStore;
