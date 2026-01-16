import expres from "express";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, createReviewer } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = expres.Router();

// Makes the router be protected
router.get("/check-auth", verifyToken, checkAuth);
router.post("/create-reviewer", verifyToken, createReviewer);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Verify email
router.post("/verify-email", verifyEmail)
// Forgot password
router.post("/forgot-password", forgotPassword);
// Reset password
router.post("/reset-password/:token", resetPassword);

export default router