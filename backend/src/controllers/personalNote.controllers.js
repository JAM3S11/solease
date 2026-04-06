import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const createPersonalNote = async (req, res) => {
  try {
    const { ticketId, content, sharedWith } = req.body;
    const userId = req.user.id;

    if (!ticketId || !content) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID and content are required"
      });
    }

    const note = await prisma.personalNote.create({
      data: {
        userId,
        ticketId,
        content: content.trim(),
        sharedWith: sharedWith || []
      },
      include: {
        user: {
          select: { id: true, username: true, name: true, profilePhoto: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      note
    });
  } catch (error) {
    console.error("Error creating personal note:", error);
    res.status(500).json({
      success: false,
      message: "Error creating personal note"
    });
  }
};

export const getPersonalNotes = async (req, res) => {
  try {
    const { ticketId } = req.query;
    const userId = req.user.id;

    let where = {};
    
    if (ticketId) {
      where = {
        OR: [
          { userId, ticketId },
          { sharedWith: { has: userId }, ticketId }
        ]
      };
    } else {
      where = {
        OR: [
          { userId },
          { sharedWith: { has: userId } }
        ]
      };
    }

    const notes = await prisma.personalNote.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, name: true, profilePhoto: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error("Error fetching personal notes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching personal notes"
    });
  }
};

export const updatePersonalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, sharedWith } = req.body;
    const userId = req.user.id;

    const existingNote = await prisma.personalNote.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (existingNote.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own notes"
      });
    }

    const updateData = {};
    if (content) updateData.content = content.trim();
    if (sharedWith) updateData.sharedWith = sharedWith;

    const note = await prisma.personalNote.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, username: true, name: true, profilePhoto: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error("Error updating personal note:", error);
    res.status(500).json({
      success: false,
      message: "Error updating personal note"
    });
  }
};

export const deletePersonalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingNote = await prisma.personalNote.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (existingNote.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own notes"
      });
    }

    await prisma.personalNote.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting personal note:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting personal note"
    });
  }
};

export const sharePersonalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWith } = req.body;
    const userId = req.user.id;

    const existingNote = await prisma.personalNote.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (existingNote.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only share your own notes"
      });
    }

    const note = await prisma.personalNote.update({
      where: { id },
      data: { sharedWith },
      include: {
        user: {
          select: { id: true, username: true, name: true, profilePhoto: true }
        }
      }
    });

    // Create notifications for each user the note is shared with
    if (sharedWith && sharedWith.length > 0) {
      const notificationsToCreate = sharedWith.map((recipientId) => ({
        userId: recipientId,
        ticketId: note.ticketId,
        type: "NOTE_SHARED",
        title: "Personal Note Shared With You",
        message: `${note.user.name || note.user.username} shared a note with you: "${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}"`,
        read: false
      }));

      await prisma.notification.createMany({
        data: notificationsToCreate
      });

      // Also notify the note owner that they shared the note (different type to avoid modal)
      await prisma.notification.create({
        data: {
          userId: note.userId,
          ticketId: note.ticketId,
          type: "NOTE_SHARED_OWNER",
          title: "Note Shared Successfully",
          message: `You shared your note with ${sharedWith.length} user${sharedWith.length > 1 ? 's' : ''}: "${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}"`,
          read: false
        }
      });
    }

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error("Error sharing personal note:", error);
    res.status(500).json({
      success: false,
      message: "Error sharing personal note"
    });
  }
};

export const unsharePersonalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: userToRemove } = req.body;
    const userId = req.user.id;

    const existingNote = await prisma.personalNote.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    const currentSharedWith = existingNote.sharedWith || [];
    let newSharedWith;
    let isOwnerRemoving = existingNote.userId === userId;
    let isSharedUserRemovingSelf = currentSharedWith.includes(userId) && userToRemove === userId;

    // Allow either the owner to remove someone, OR a shared user to remove themselves
    if (!isOwnerRemoving && !isSharedUserRemovingSelf) {
      return res.status(403).json({
        success: false,
        message: "You can only remove yourself or be removed by the note owner"
      });
    }

    newSharedWith = currentSharedWith.filter(uid => uid !== userToRemove);

    const note = await prisma.personalNote.update({
      where: { id },
      data: { sharedWith: newSharedWith },
      include: {
        user: {
          select: { id: true, username: true, name: true, profilePhoto: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error("Error unsharing personal note:", error);
    res.status(500).json({
      success: false,
      message: "Error unsharing personal note"
    });
  }
};