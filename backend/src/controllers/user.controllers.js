import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getITSupportUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ 
      where: { role: "REVIEWER" },
      select: { username: true, email: true }
    });
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching IT Support users:", err);
    res.status(500).json({ message: "Failed to fetch IT Support users" });
  }
};

export const getReviewers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ 
      where: { role: "REVIEWER" },
      select: { name: true, username: true, email: true, role: true }
    });
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching Reviewer users:", err);
    res.status(500).json({ message: "Failed to fetch Reviewer users" });
  }
};
