import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey"); 

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        notificationsEnabled: true,
        profilePhoto: true,
        passwordStrength: true,
        passwordUpdateDeadline: true,
        hasUpdatedWeakPassword: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    res.status(500).json({ success: false, message: "Server error in authentication" });
  }
};
