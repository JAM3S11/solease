import { User } from "../models/user.model.js";

export const checkPasswordStatus = async (req, res, next) => {
    try {
        // Skip if no user (will be handled by auth middleware)
        if (!req.userId) {
            return next();
        }

        const user = await User.findById(req.userId).select("passwordStrength passwordUpdateDeadline hasUpdatedWeakPassword");
        
        if (!user) {
            return next();
        }

        // Skip if password is already strong or has been updated
        if (user.passwordStrength === 'strong' || user.hasUpdatedWeakPassword) {
            return next();
        }

        // Check if deadline has expired
        if (user.passwordUpdateDeadline && new Date() > user.passwordUpdateDeadline) {
            return res.status(403).json({
                success: false,
                message: "Password update required. Your 24-hour window has expired. Please update your password to continue.",
                passwordUpdateRequired: true,
                deadlineExpired: true
            });
        }

        // Add flag to request for frontend to show warning
        req.passwordUpdateRequired = true;
        req.passwordUpdateDeadline = user.passwordUpdateDeadline;

        next();
    } catch (error) {
        console.log("Error in checkPasswordStatus middleware:", error);
        next();
    }
};
