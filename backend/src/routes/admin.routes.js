import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllUsers, updateUserRoleAndStatus, deleteUserById, getActiveUsers, updateUserActivity, markUserOffline, updateUserPlanTier, getAllUsersPlanUsage } from "../controllers/admin.controllers.js";

const router = express.Router();

// Admin gets users from the system
router.get("/users", verifyToken, getAllUsers);

// Admin gets active users (online in last 5 minutes)
router.get("/active-users", verifyToken, getActiveUsers);

// Update user activity (called periodically from frontend)
router.post("/activity", verifyToken, updateUserActivity);

// Mark user as offline
router.post("/offline", verifyToken, markUserOffline);

// Admin updates user role and status by username
router.put("/users/:username", verifyToken, updateUserRoleAndStatus);

// Admin deletes user by id
router.delete("/users/:id", verifyToken, deleteUserById);

// Update user plan tier by username
router.put("/users/:username/plan-tier", verifyToken, updateUserPlanTier);

// Get all users plan usage
router.get("/users/plan-usage", verifyToken, getAllUsersPlanUsage);

export default router;