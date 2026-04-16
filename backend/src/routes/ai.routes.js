import express from "express";
import { generateChatResponse } from "../util/geminiService.js";
import prisma from "../config/db.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, ticketContext, userRole, userName, sessionId, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const isFirstMessage = !sessionId;
    const aiResult = await generateChatResponse({
      message,
      ticketContext: ticketContext || null,
      userRole: userRole || "Client",
      userName: userName || "User",
      isFirstMessage
    });

    const response = typeof aiResult === "object" ? aiResult.response : aiResult;
    const generatedTitle = typeof aiResult === "object" ? aiResult.title : null;

    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (session) {
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: "USER",
            content: message
          }
        });
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: "ASSISTANT",
            content: response
          }
        });
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() }
        });
      }
    }

    if (!session && userId) {
      const title = generatedTitle || message.slice(0, 50) + (message.length > 50 ? "..." : "");
      session = await prisma.chatSession.create({
        data: {
          userId,
          title,
          messages: {
            create: [
              { role: "USER", content: message },
              { role: "ASSISTANT", content: response }
            ]
          }
        }
      });
    }

    return res.json({ response, sessionId: session?.id });
  } catch (error) {
    console.error("AI Chat error:", error);
    return res.status(500).json({ error: "Failed to get response from AI" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 20
    });

    return res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { timestamp: "asc" } } }
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ error: "Failed to fetch session" });
  }
});

router.delete("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    await prisma.chatSession.delete({ where: { id: sessionId } });
    return res.json({ message: "Session deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return res.status(500).json({ error: "Failed to delete session" });
  }
});

export default router;