import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate("ticket", "subject status")
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ 
            user: req.user._id, 
            read: false 
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

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { 
                read: true,
                readAt: new Date()
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        const unreadCount = await Notification.countDocuments({ 
            user: req.user._id, 
            read: false 
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
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { 
                read: true,
                readAt: new Date()
            }
        );

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

export const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({ 
            user: req.user._id, 
            read: false 
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
        const notification = await Notification.create({
            user: userId,
            ticket: ticketId,
            type,
            title,
            message,
            previousStatus,
            newStatus
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};
