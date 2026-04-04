import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const checkPasswordStatus = async (req, res, next) => {
    try {
        if (!req.userId) {
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                passwordStrength: true,
                passwordUpdateDeadline: true,
                hasUpdatedWeakPassword: true
            }
        });
        
        if (!user) {
            return next();
        }

        if (user.passwordStrength === 'strong' || user.hasUpdatedWeakPassword) {
            return next();
        }

        if (user.passwordUpdateDeadline && new Date() > user.passwordUpdateDeadline) {
            return res.status(403).json({
                success: false,
                message: "Password update required. Your 24-hour window has expired. Please update your password to continue.",
                passwordUpdateRequired: true,
                deadlineExpired: true
            });
        }

        req.passwordUpdateRequired = true;
        req.passwordUpdateDeadline = user.passwordUpdateDeadline;

        next();
    } catch (error) {
        console.log("Error in checkPasswordStatus middleware:", error);
        next();
    }
};
