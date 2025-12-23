import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllUsers, updateUserRoleAndStatus, deleteUserById } from "../controllers/admin.controllers.js";

const router = express.Router();

// Admin gets users from the system
router.get("/users", verifyToken, getAllUsers);

// Admin updates user role and status by username
router.put("/users/:username", verifyToken, updateUserRoleAndStatus);

// Admin deletes user by id
router.delete("/users/:id", verifyToken, deleteUserById);

export default router;