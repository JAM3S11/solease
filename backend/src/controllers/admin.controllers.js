import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

export const getAllUsers = async (req, res) => {
  try {
    const INACTIVE_TIMEOUT = 5 * 60 * 1000;
    const now = new Date();
    const baseUrl = getBaseUrl(req);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        lastLogin: true,
        isOnline: true,
        lastActivity: true,
        onlineAt: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const updatePromises = users
      .filter(user => user.isOnline && user.lastActivity && (now - new Date(user.lastActivity) > INACTIVE_TIMEOUT))
      .map(user => 
        prisma.user.update({
          where: { id: user.id },
          data: { isOnline: false }
        })
      );

    await Promise.all(updatePromises);

    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        lastLogin: true,
        isOnline: true,
        lastActivity: true,
        onlineAt: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const usersWithFullPhotoUrl = updatedUsers.map(user => ({
      ...user,
      profilePhoto: user.profilePhoto ? `${baseUrl}${user.profilePhoto}` : null
    }));

    return res.status(200).json({
      success: true,
      count: updatedUsers.length,
      users: usersWithFullPhotoUrl,
    });
  } catch (error) {
    console.error("Error Fetching users from the admin panel:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users"
    });
  }
};

export const updateUserRoleAndStatus = async (req, res) => {
  try {
    const { username } = req.params;
    const { role, status } = req.body;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token" });
    }

    const adminUser = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!adminUser || adminUser.role !== "MANAGER") {
      return res.status(403).json({ success: false, message: "Forbidden - you are not an admin." });
    }

    const normalizedRole = role?.toUpperCase();
    const normalizedStatus = status?.toUpperCase();

    const updatedUser = await prisma.user.update({
      where: { username },
      data: { 
        role: normalizedRole,
        status: normalizedStatus,
        approvedBy: req.userId
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role and status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role/status:", error);
    res.status(500).json({ success: false, message: "Server error..Error updating user" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Attempting to delete user with ID:", id);
    
    const deleteUser = await prisma.user.delete({
      where: { id }
    });

    console.log("✅ User deleted successfully:", deleteUser.username);

    if(!deleteUser){
      return res.status(404).json({
        success: false,
        message: "User not found. Try again"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!"
    })
  } catch (error) {
    console.error("🗑️ Error deleting in adminController:", error.message);
    console.error("   Error code:", error.code);
    res.status(500).json({
      success: false,
      message: "Server error in deleting user"
    })
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const activeUsers = await prisma.user.findMany({
      where: {
        lastActivity: { gte: fiveMinutesAgo }
      },
      select: {
        name: true,
        email: true,
        role: true,
        lastActivity: true,
        onlineAt: true
      }
    });

    return res.status(200).json({
      success: true,
      count: activeUsers.length,
      activeUsers,
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching active users"
    });
  }
};

export const updateUserActivity = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { 
        lastActivity: new Date(),
        isOnline: true,
        onlineAt: new Date()
      },
      select: {
        name: true,
        email: true,
        role: true,
        lastActivity: true,
        isOnline: true,
        onlineAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating activity"
    });
  }
};

export const markUserOffline = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { isOnline: false },
      select: {
        name: true,
        email: true,
        role: true,
        isOnline: true
      }
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error marking user offline:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking offline"
    });
  }
};

export const updateUserPlanTier = async (req, res) => {
  try {
    const { username } = req.params;
    const { planTier } = req.body;

    const validTiers = ["BASIC", "PRO", "ENTERPRISE"];
    if (!planTier || !validTiers.includes(planTier)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan tier. Must be BASIC, PRO, or ENTERPRISE"
      });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: { 
        planTier: planTier,
        aiReplyCount: 0,
        aiReplyResetAt: new Date()
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        planTier: true,
        aiReplyCount: true,
        aiReplyResetAt: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Plan tier updated to ${planTier}`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating plan tier:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating plan tier"
    });
  }
};

export const getAllUsersPlanUsage = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        planTier: true,
        aiReplyCount: true,
        aiReplyResetAt: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    const now = new Date();
    const usersWithUsage = users.map(user => {
      const resetAt = new Date(user.aiReplyResetAt);
      resetAt.setHours(resetAt.getHours() + 12);
      const hoursUntilReset = (resetAt - now) / (1000 * 60 * 60);
      
      return {
        ...user,
        hoursUntilReset: Math.max(0, hoursUntilReset),
        resetAt: resetAt
      };
    });

    res.status(200).json({
      success: true,
      users: usersWithUsage
    });
  } catch (error) {
    console.error("Error getting users plan usage:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting plan usage"
    });
  }
};
