import express from "express";
import { getNotifications, markNotificationAsRead, markNotificationAsUnread, markAllNotificationsAsRead, unmarkAllNotificationsAsRead, getUnreadCount, getNotificationPreference, toggleNotificationPreference } from "../controllers/notification.controllers.js";
import { protect } from "../middleware/authTicketTok.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.get("/preferences", protect, getNotificationPreference);
router.patch("/preferences", protect, toggleNotificationPreference);
router.put("/:id/read", protect, markNotificationAsRead);
router.put("/:id/unread", protect, markNotificationAsUnread);
router.put("/read-all", protect, markAllNotificationsAsRead);
router.put("/unread-all", protect, unmarkAllNotificationsAsRead);

export default router;
