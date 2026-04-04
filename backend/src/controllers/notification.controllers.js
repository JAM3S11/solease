import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            include: { ticket: { select: { subject: true, status: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, read: false }
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications"
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.update({
            where: { id, userId: req.user.id },
            data: {
                read: true,
                readAt: new Date()
            }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, read: false }
        });

        res.status(200).json({
            success: true,
            notification,
            unreadCount
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Error marking notification as read"
        });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: {
                read: true,
                readAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            unreadCount: 0
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Error marking all notifications as read"
        });
    }
};

export const unmarkAllNotificationsAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, read: true },
            data: {
                read: false,
                readAt: null
            }
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, read: false }
        });

        res.status(200).json({
            success: true,
            message: "All notifications unmarked as read",
            unreadCount
        });
    } catch (error) {
        console.error("Error unmarking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Error unmarking all notifications as read"
        });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, read: false }
        });

        res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error("Error getting unread count:", error);
        res.status(500).json({
            success: false,
            message: "Error getting unread count"
        });
    }
};

export const createNotification = async (userId, ticketId, type, title, message, previousStatus = null, newStatus = null) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                ticketId,
                type,
                title,
                message,
                previousStatus,
                newStatus
            }
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

export const getNotificationPreference = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            notificationsEnabled: req.user.notificationsEnabled !== false,
        });
    } catch (error) {
        console.error("Error fetching notification preference:", error);
        res.status(500).json({ success: false, message: "Error fetching notification preference" });
    }
};

export const toggleNotificationPreference = async (req, res) => {
    try {
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            return res.status(400).json({ success: false, message: "enabled must be a boolean" });
        }

        await prisma.user.update({
            where: { id: req.user.id },
            data: { notificationsEnabled: enabled }
        });

        res.status(200).json({
            success: true,
            notificationsEnabled: enabled,
            message: `Notifications ${enabled ? "enabled" : "disabled"} successfully`,
        });
    } catch (error) {
        console.error("Error toggling notification preference:", error);
        res.status(500).json({ success: false, message: "Error updating notification preference" });
    }
};
