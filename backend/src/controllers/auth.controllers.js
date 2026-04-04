import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendPasswordUpdateRequiredEmail } from "../mailtrap/emails.js";
import { calculatePasswordStrength } from "../util/passwordStrength.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const signup = async (req, res) => {
    const { username, name, email, password } = req.body;

    console.log("\n📝 SIGNUP REQUEST RECEIVED");
    console.log("  Username:", username);
    console.log("  Name:", name);
    console.log("  Email:", email ? email.substring(0, 3) + "***@" + email.split('@')[1] : "NOT PROVIDED");
    console.log("  Password:", password ? "✅ Provided (length: " + password.length + ")" : "NOT PROVIDED");

    try {
        if(!username || !name || !email || !password){
            throw new Error("All Fields are required for one to proceed");
        }

        const userAlreadyExists = await prisma.user.findUnique({ where: { email } });
        console.log("  User already exists:", userAlreadyExists ? "YES" : "NO");

        if(userAlreadyExists){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const usernameExists = await prisma.user.findUnique({ where: { username } });
        if(usernameExists){
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const passwordStrength = calculatePasswordStrength(password);

        const user = await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                passwordStrength,
                hasUpdatedWeakPassword: passwordStrength === 'strong'
            }
        });

        const normalizedUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role?.toLowerCase() || 'client',
            status: user.status?.toLowerCase() || 'active',
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        generateTokenAndSetCookie(res, user.id);

        console.log("✅ User created successfully:", user.email);
        console.log("📧 Attempting to send verification email to:", user.email.substring(0, 3) + "***@" + user.email.split('@')[1]);

        sendVerificationEmail(user.email, verificationToken)
            .then(() => {
                console.log("📧 Verification email sent successfully!");
            })
            .catch(err => {
                console.error("❌ Failed to send verification email:");
                console.error("  Error:", err.message);
            });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: normalizedUser,
        });
    } catch (error) {
        console.log("Error in sign up", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: { gt: new Date() }
            }
        });

        if(!user){
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired verification code" 
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null
            }
        });

        await sendWelcomeEmail(updatedUser.email, updatedUser.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role?.toLowerCase() || 'client',
                status: updatedUser.status?.toLowerCase() || 'pending',
                isVerified: updatedUser.isVerified
            },
        });
    } catch (error) {
        console.log("Error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        };

        if (user.status === "REJECTED") {
            return res.status(403).json({
                success: false,
                message: "Your account has been rejected"
            });
        }          

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials, please try again." 
            });
        }

        generateTokenAndSetCookie(res, user.id);

        let passwordStrength = user.passwordStrength || calculatePasswordStrength(password);
        let passwordUpdateRequired = false;
        let passwordUpdateDeadline = user.passwordUpdateDeadline;
        
        if (passwordStrength === 'weak' && !user.hasUpdatedWeakPassword) {
            if (!user.passwordUpdateDeadline) {
                const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
                user.passwordUpdateDeadline = deadline;
                passwordUpdateDeadline = deadline;
                
                try {
                    await sendPasswordUpdateRequiredEmail(user.email, user.name, deadline);
                } catch (emailError) {
                    console.error("Error sending password update email:", emailError);
                }
            }
            passwordUpdateRequired = true;
        } else if (passwordStrength !== 'weak') {
            user.passwordStrength = passwordStrength;
            user.passwordUpdateDeadline = null;
            user.hasUpdatedWeakPassword = true;
            passwordUpdateDeadline = null;
        }
        
        user.passwordStrength = passwordStrength;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                passwordStrength: passwordStrength,
                passwordUpdateDeadline: passwordUpdateDeadline,
                hasUpdatedWeakPassword: user.hasUpdatedWeakPassword
            }
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            passwordUpdateRequired,
            passwordUpdateDeadline,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role?.toLowerCase() || 'client',
                status: updatedUser.status?.toLowerCase() || 'active',
                isVerified: updatedUser.isVerified,
                profilePhoto: updatedUser.profilePhoto,
                notificationsEnabled: updatedUser.notificationsEnabled,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            },
        });
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user){
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: expiresAt
            }
        });

        await sendPasswordResetEmail(
            user.email, 
            `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`
        );
        
        res.status(200).json({ 
            success: true, 
            message: "Password reset link sent to your email" 
        });
    } catch (error) {
        console.log("Error in the process of forgot password", error);
        throw new Error(`Error in the process of forgetting password ${error}`);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { gt: new Date() }
            }
        });

        if(!user){
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null
            }
        });

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const createReviewer = async (req, res) => {
    if (req.user.role !== "MANAGER") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { username, name, email, password } = req.body;

    try {
        if(!username || !name || !email || !password){
            throw new Error("All Fields are required for one to proceed");
        }

        const userAlreadyExists = await prisma.user.findUnique({ where: { email } });
        if(userAlreadyExists){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
                role: "REVIEWER",
                status: "ACTIVE"
            }
        });

        const resetToken = crypto.randomBytes(20).toString("hex");
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
            }
        });

        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`
        );

        res.status(201).json({
            success: true,
            message: "Reviewer created successfully; password reset email sent",
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role?.toLowerCase() || 'reviewer',
                status: user.status?.toLowerCase() || 'active'
            },
        });
    } catch (error) {
        console.log("Error in createReviewer ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                status: true,
                isVerified: true,
                profilePhoto: true,
                notificationsEnabled: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: {
                ...user,
                role: user.role?.toLowerCase() || 'client',
                status: user.status?.toLowerCase() || 'pending'
            }
        });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match"
            });
        }
        
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        
        const passwordStrength = calculatePasswordStrength(newPassword);
        if (passwordStrength !== 'strong') {
            return res.status(400).json({
                success: false,
                message: "New password must be strong. It must have at least 8 characters, one uppercase, one lowercase, one number, and one special character."
            });
        }
        
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordStrength: 'strong',
                hasUpdatedWeakPassword: true,
                passwordUpdateDeadline: null
            }
        });
        
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.log("Error in changePassword ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
