import express from "express";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadCount, getNotificationPreference, toggleNotificationPreference } from "../controllers/notification.controllers.js";
import { protect } from "../middleware/authTicketTok.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.get("/preferences", protect, getNotificationPreference);
router.patch("/preferences", protect, toggleNotificationPreference);
router.put("/:id/read", protect, markNotificationAsRead);
router.put("/read-all", protect, markAllNotificationsAsRead);

export default router;
