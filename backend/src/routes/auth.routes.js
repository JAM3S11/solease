import expres from "express";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, createReviewer, changePassword } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { signupLimiter, loginLimiter, verifyEmailLimiter, forgotPasswordLimiter, resetPasswordLimiter } from "../middleware/rateLimiter.js";

const router = expres.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/create-reviewer", verifyToken, createReviewer);
router.put("/change-password", verifyToken, changePassword);

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmailLimiter, verifyEmail)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

export default router
