import { create } from "zustand";
import api from "../lib/axios";

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/notifications");
            set({ 
                notifications: res.data.notifications, 
                unreadCount: res.data.unreadCount,
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
            set({ unreadCount: res.data.unreadCount });
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    },

    markAsRead: async (notificationId) => {
        try {
            const res = await api.put(`/notifications/${notificationId}/read`);
            set((state) => ({
                notifications: state.notifications.map(n => 
                    n._id === notificationId ? { ...n, read: true } : n
                ),
                unreadCount: res.data.unreadCount
            }));
        } catch (error) {
            console.error("Error marking notification as read:", error);
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

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));

export default useNotificationStore;
