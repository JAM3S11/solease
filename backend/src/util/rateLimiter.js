import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const RATE_LIMITS = {
  BASIC: { maxPerHour: 0, resetHours: 12 },
  PRO: { maxPerHour: 15, resetHours: 12 },
  ENTERPRISE: { maxPerHour: Infinity, resetHours: 12 }
};

export async function checkAIRateLimit(user) {
  const limit = RATE_LIMITS[user.planTier];
  
  if (!limit) {
    return { allowed: false, remaining: 0, error: "Invalid plan tier" };
  }
  
  if (limit.maxPerHour === Infinity) {
    return { allowed: true, remaining: Infinity, resetAt: null };
  }
  
  const now = new Date();
  const resetAt = new Date(user.aiReplyResetAt);
  resetAt.setHours(resetAt.getHours() + limit.resetHours);
  
  const hoursSinceReset = (now - new Date(user.aiReplyResetAt)) / (1000 * 60 * 60);
  
  if (hoursSinceReset >= limit.resetHours) {
    return { allowed: true, remaining: limit.maxPerHour, resetAt: resetAt };
  }
  
  const remaining = limit.maxPerHour - user.aiReplyCount;
  return { 
    allowed: remaining > 0, 
    remaining: Math.max(0, remaining),
    resetAt: resetAt
  };
}

export async function incrementAIReplyCount(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const limit = RATE_LIMITS[user.planTier];
    
    if (limit.maxPerHour === Infinity) {
      return { success: true, newCount: user.aiReplyCount };
    }
    
    const now = new Date();
    const hoursSinceReset = (now - new Date(user.aiReplyResetAt)) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= limit.resetHours) {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          aiReplyCount: 1,
          aiReplyResetAt: now
        }
      });
      return { success: true, newCount: 1 };
    }
    
    const newCount = user.aiReplyCount + 1;
    
    await prisma.user.update({
      where: { id: userId },
      data: { aiReplyCount: newCount }
    });
    
    return { success: true, newCount };
    
  } catch (error) {
    console.error("Error incrementing AI reply count:", error);
    return { success: false, error: error.message };
  }
}

export async function getAIUsageForUser(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return null;
    }
    
    const limit = RATE_LIMITS[user.planTier];
    const now = new Date();
    const hoursSinceReset = (now - new Date(user.aiReplyResetAt)) / (1000 * 60 * 60);
    
    let currentCount = user.aiReplyCount;
    let remaining = limit.maxPerHour;
    let needsReset = false;
    
    if (hoursSinceReset >= limit.resetHours) {
      currentCount = 0;
      remaining = limit.maxPerHour;
      needsReset = true;
    } else if (limit.maxPerHour !== Infinity) {
      remaining = Math.max(0, limit.maxPerHour - currentCount);
    }
    
    const resetAt = new Date(user.aiReplyResetAt);
    resetAt.setHours(resetAt.getHours() + limit.resetHours);
    
    return {
      planTier: user.planTier,
      currentCount,
      maxPerHour: limit.maxPerHour,
      remaining: remaining === Infinity ? "Unlimited" : remaining,
      resetAt: resetAt,
      needsReset,
      canUse: limit.maxPerHour > 0 || limit.maxPerHour === Infinity
    };
    
  } catch (error) {
    console.error("Error getting AI usage:", error);
    return null;
  }
}

export async function checkAndConsumeAIReply(userId, isCritical = false) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return { allowed: false, error: "User not found" };
    }
    
    const limit = RATE_LIMITS[user.planTier];
    
    if (limit.maxPerHour === Infinity) {
      return { allowed: true, remaining: Infinity };
    }
    
    const now = new Date();
    const hoursSinceReset = (now - new Date(user.aiReplyResetAt)) / (1000 * 60 * 60);
    
    let shouldReset = hoursSinceReset >= limit.resetHours;
    let currentCount = shouldReset ? 0 : user.aiReplyCount;
    
    const isPro = user.planTier === "PRO";
    const canBypass = isPro && isCritical;
    
    if (currentCount >= limit.maxPerHour && !canBypass) {
      return { 
        allowed: false, 
        remaining: 0,
        error: "Rate limit exceeded",
        resetAt: new Date(user.aiReplyResetAt.getTime() + limit.resetHours * 60 * 60 * 1000)
      };
    }
    
    const newCount = currentCount + 1;
    const newResetAt = shouldReset ? now : user.aiReplyResetAt;
    
    await prisma.user.update({
      where: { id: userId },
      data: { 
        aiReplyCount: newCount,
        aiReplyResetAt: newResetAt
      }
    });
    
    return { 
      allowed: true, 
      remaining: limit.maxPerHour - newCount,
      isCriticalBypass: canBypass
    };
    
  } catch (error) {
    console.error("Error checking AI rate limit:", error);
    return { allowed: false, error: error.message };
  }
}