import express from "express";
import { generateChatResponse } from "../util/geminiService.js";
import prisma from "../config/db.js";

const router = express.Router();

const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/JPEG", "image/PNG", "image/WEBP", "image/GIF"];

function validateImages(images) {
  if (!images || !Array.isArray(images)) return { valid: true, images: [] };
  
  const validImages = [];
  for (const img of images) {
    if (!img.base64 || !img.mimeType) {
      console.warn("Image missing base64 or mimeType, skipping");
      continue;
    }
    
    const size = (img.base64.length * 3) / 4;
    console.log(`Image size estimate: ${(size / 1024).toFixed(2)}KB`);
    
    if (size > MAX_IMAGE_SIZE) {
      console.warn(`Image too large: ${(size / 1024 / 1024).toFixed(2)}MB, skipping`);
      continue;
    }
    
    const normalizedMime = img.mimeType.toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(normalizedMime)) {
      console.warn(`Invalid image type: ${img.mimeType}, skipping`);
      continue;
    }
    
    validImages.push({
      base64: img.base64,
      mimeType: normalizedMime,
      filename: img.filename || "uploaded-image",
      size: size
    });
  }
  
  return { valid: true, images: validImages };
}

router.post("/chat", async (req, res) => {
  try {
    console.log("AI Chat request received");
    console.log("Body keys:", Object.keys(req.body));
    console.log("Has images:", req.body.images ? req.body.images.length : 0);
    
    const { message, ticketContext, userRole, userName, sessionId, userId, images } = req.body;

    if (!message && (!images || images.length === 0)) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    const imageValidation = validateImages(images);
    console.log("Validated images:", imageValidation.images.length);
    
    const processedMessage = message || "Please analyze the uploaded image(s) and provide insights.";

    const isFirstMessage = !sessionId;
    console.log("Calling Gemini with isFirstMessage:", isFirstMessage);
    
    const aiResult = await generateChatResponse({
      message: processedMessage,
      ticketContext: ticketContext || null,
      userRole: userRole || "Client",
      userName: userName || "User",
      isFirstMessage,
      images: imageValidation.images
    });

    console.log("Gemini response received, type:", typeof aiResult);
    
    const response = typeof aiResult === "object" ? aiResult.response : aiResult;
    const generatedTitle = typeof aiResult === "object" ? aiResult.title : null;

    console.log("Response:", response?.substring(0, 100));

    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (session) {
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: "USER",
            content: processedMessage,
            images: imageValidation.images.length > 0 ? imageValidation.images : null
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
      const title = generatedTitle || (processedMessage.length > 50 ? processedMessage.slice(0, 50) + "..." : processedMessage);
      session = await prisma.chatSession.create({
        data: {
          userId,
          title,
          messages: {
            create: [
              { 
                role: "USER", 
                content: processedMessage,
                images: imageValidation.images.length > 0 ? imageValidation.images : null
              },
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

router.get("/search", async (req, res) => {
  try {
    const { userId, query } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!query || query.trim() === "") {
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        select: { id: true, title: true, createdAt: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 10
      });
      return res.json(sessions);
    }

    const searchTerm = query.toLowerCase();
    
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          where: {
            content: { contains: searchTerm }
          },
          select: { content: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const results = sessions
      .map(session => {
        const titleMatch = session.title.toLowerCase().includes(searchTerm);
        const messageMatches = session.messages.map(m => m.content);
        
        let snippet = null;
        if (messageMatches.length > 0) {
          const match = messageMatches[0];
          const index = match.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 30);
          const end = Math.min(match.length, index + searchTerm.length + 30);
          snippet = (start > 0 ? "..." : "") + match.slice(start, end) + (end < match.length ? "..." : "");
        }

        return {
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          titleMatch,
          messageMatches: messageMatches.length,
          snippet
        };
      })
      .filter(s => s.titleMatch || s.messageMatches > 0)
      .slice(0, 20);

    return res.json(results);
  } catch (error) {
    console.error("Error searching sessions:", error);
    return res.status(500).json({ error: "Failed to search sessions" });
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

router.get("/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: { messages: true }
    });

    const totalSessions = sessions.length;
    const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
    const userMessages = sessions.reduce((sum, session) => 
      sum + session.messages.filter(m => m.role === "USER").length, 0);
    const assistantMessages = sessions.reduce((sum, session) => 
      sum + session.messages.filter(m => m.role === "ASSISTANT").length, 0);
    
    let totalImages = 0;
    sessions.forEach(session => {
      session.messages.forEach(msg => {
        if (msg.images && Array.isArray(msg.images)) {
          totalImages += msg.images.length;
        }
      });
    });

    const firstSession = sessions.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt))[0];
    const lastSession = sessions.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    return res.json({
      totalSessions,
      totalMessages,
      userMessages,
      assistantMessages,
      totalImages,
      firstActivity: firstSession?.createdAt || null,
      lastActivity: lastSession?.updatedAt || null
    });
  } catch (error) {
    console.error("Error fetching AI stats:", error);
    return res.status(500).json({ error: "Failed to fetch AI statistics" });
  }
});

router.get("/stats/over-time", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const periods = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      periods.push({
        label: monthNames[date.getMonth()],
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: { messages: true }
    });

    const data = periods.map(p => {
      const periodSessions = sessions.filter(s => {
        const d = new Date(s.createdAt);
        return d >= p.start && d <= p.end;
      });
      
      let periodMessages = 0;
      let periodImages = 0;
      
      periodSessions.forEach(session => {
        session.messages.forEach(msg => {
          periodMessages++;
          if (msg.images && Array.isArray(msg.images)) {
            periodImages += msg.images.length;
          }
        });
      });
      
      return {
        sessions: periodSessions.length,
        messages: periodMessages,
        images: periodImages
      };
    });

    return res.json({
      labels: periods.map(p => p.label),
      sessions: data.map(d => d.sessions),
      messages: data.map(d => d.messages),
      images: data.map(d => d.images)
    });
  } catch (error) {
    console.error("Error fetching AI stats over time:", error);
    return res.status(500).json({ error: "Failed to fetch AI statistics over time" });
  }
});

export default router;