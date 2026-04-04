import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { createNotification } from "./notification.controllers.js";
import { sendTicketStatusUpdateEmail } from "../mailtrap/emails.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."));
        }
    }
});

export const uploadMiddleware = upload.single("attachment");

const ISSUE_TYPE_MAP = {
    "Hardware issue": "HARDWARE_ISSUE",
    "Software issue": "SOFTWARE_ISSUE",
    "Network Connectivity": "NETWORK_CONNECTIVITY",
    "Account Access": "ACCOUNT_ACCESS",
    "Other": "OTHER"
};

const URGENCY_MAP = {
    "Low": "LOW",
    "Medium": "MEDIUM",
    "High": "HIGH",
    "Critical": "CRITICAL"
};

const STATUS_MAP = {
    "Open": "OPEN",
    "In Progress": "IN_PROGRESS",
    "Resolved": "RESOLVED",
    "Closed": "CLOSED"
};

export const createTicket = async (req, res) => {
    const { location, issueType, subject, description, urgency } = req.body;

    try {
        if (!location || !issueType || !subject || !description || !urgency) {
            return res.status(400).json({
                success: false,
                message: "Kindly fill in all the details"
            });
        };

        const ticketData = {
            userId: req.user.id,
            location,
            issueType: ISSUE_TYPE_MAP[issueType] || "OTHER",
            subject,
            description,
            urgency: URGENCY_MAP[urgency] || "LOW",
            visibility: "ROLE_BASED"
        };

        const ticket = await prisma.ticket.create({
            data: ticketData,
            include: {
                user: {
                    select: { id: true, username: true, name: true, role: true, profilePhoto: true }
                }
            }
        });

        if (req.file) {
            await prisma.attachment.create({
                data: {
                    ticketId: ticket.id,
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: `/uploads/${req.file.filename}`,
                    uploadedById: req.user.id
                }
            });
        }

        const updatedTicket = await prisma.ticket.findUnique({
            where: { id: ticket.id },
            include: {
                user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } },
                assignedTo: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } },
                comments: { include: { user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } }, replies: { include: { user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } } } } } },
                attachments: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket: updatedTicket,
        })
    } catch (error) {
        console.log("Error creating the ticket", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating ticket"
        })
    }
};

export const getTickets = async (req, res) => {
    try {
        let where = {};
        const orderBy = { createdAt: 'desc' };
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        if (req.user.role === "CLIENT") {
            where.userId = req.user.id;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            orderBy,
            include: {
                user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } },
                assignedTo: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } },
                comments: { 
                    include: { 
                        user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } }, 
                        replies: { include: { user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } } } } 
                    } 
                },
                attachments: true
            }
        });

        const ticketsWithFullPhotoUrl = tickets.map(ticket => ({
            ...ticket,
            user: ticket.user ? { ...ticket.user, profilePhoto: ticket.user.profilePhoto ? `${baseUrl}${ticket.user.profilePhoto}` : null } : null,
            assignedTo: ticket.assignedTo ? { ...ticket.assignedTo, profilePhoto: ticket.assignedTo.profilePhoto ? `${baseUrl}${ticket.assignedTo.profilePhoto}` : null } : null,
            comments: ticket.comments?.map(comment => ({
                ...comment,
                user: comment.user ? { ...comment.user, profilePhoto: comment.user.profilePhoto ? `${baseUrl}${comment.user.profilePhoto}` : null } : null,
                replies: comment.replies?.map(reply => ({
                    ...reply,
                    user: reply.user ? { ...reply.user, profilePhoto: reply.user.profilePhoto ? `${baseUrl}${reply.user.profilePhoto}` : null } : null
                }))
            }))
        }));

        res.status(200).json({
            success: true,
            tickets: ticketsWithFullPhotoUrl
        });
    } catch (error) {
        console.log("Error fetching the tickets", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching tickets"
        });
    }
};

export const updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status, isAutomated, chatEnabled } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        if (!["MANAGER", "REVIEWER"].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have permission to update ticket status",
            });
        }

        const previousStatus = ticket.status;

        const updateData = {};
        if (status) {
            updateData.status = STATUS_MAP[status] || status;
        }
        if (isAutomated !== undefined) {
            updateData.isAutomated = isAutomated;
            if (isAutomated) {
                updateData.autoResolvedAt = new Date();
                updateData.resolutionMethod = "AUTO";
            }
        }
        if (typeof chatEnabled === 'boolean') {
            updateData.chatEnabled = chatEnabled;
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, username: true, name: true, email: true, profilePhoto: true, notificationsEnabled: true } }
            }
        });

        if (status && previousStatus !== updatedTicket.status) {
            try {
                const ticketOwner = updatedTicket.user;
                if (ticketOwner && ticketOwner.notificationsEnabled !== false && ticketOwner.email) {
                    await sendTicketStatusUpdateEmail(
                        ticketOwner.email,
                        ticketOwner.name,
                        ticket.id,
                        ticket.subject,
                        previousStatus,
                        status,
                        new Date().toLocaleString()
                    );
                }

                await createNotification(
                    ticket.userId,
                    ticket.id,
                    "STATUS_UPDATE",
                    `Ticket Status Updated: ${status}`,
                    `Your ticket "${ticket.subject}" has been updated from ${previousStatus} to ${status}`,
                    previousStatus,
                    status
                );
            } catch (notificationError) {
                console.error("Error sending notification/email:", notificationError);
            }
        }

        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            ticket: updatedTicket,
        });
    } catch (error) {
        console.log("Error updating ticket status", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating ticket status"
        });
    }
};

export const assignTicket = async (req, res) => {
    const { id } = req.params;
    const { assignedTo, mode } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        if (mode !== 'auto' && req.user.role !== 'MANAGER') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only Managers can manually assign tickets",
            });
        }

        let assignedUser = null;

        if (mode === 'auto') {
            const reviewers = await prisma.user.findMany({ where: { role: 'REVIEWER' } });
            
            if (reviewers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No reviewers available for assignment",
                });
            }

            const reviewerStats = await Promise.all(
                reviewers.map(async (reviewer) => {
                    const activeTickets = await prisma.ticket.count({
                        where: {
                            assignedToId: reviewer.id,
                            status: { in: ['OPEN', 'IN_PROGRESS'] }
                        }
                    });
                    return { reviewer, activeTickets };
                })
            );

            reviewerStats.sort((a, b) => {
                if (a.activeTickets !== b.activeTickets) {
                    return a.activeTickets - b.activeTickets;
                }
                const nameA = (a.reviewer.name || a.reviewer.username || '').toLowerCase();
                const nameB = (b.reviewer.name || b.reviewer.username || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });
            
            assignedUser = reviewerStats[0].reviewer;
        } else {
            assignedUser = await prisma.user.findUnique({ where: { id: assignedTo } });
            
            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned user not found",
                });
            }

            if (!['REVIEWER', 'MANAGER'].includes(assignedUser.role)) {
                return res.status(400).json({
                    success: false,
                    message: "Can only assign to Reviewer or Manager",
                });
            }
        }

        const previousAssigneeId = ticket.assignedToId;
        
        const updateData = { assignedToId: assignedUser.id };
        if (ticket.status === 'OPEN') {
            updateData.status = 'IN_PROGRESS';
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                assignedTo: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } }
            }
        });

        try {
            await createNotification(
                assignedUser.id,
                ticket.id,
                "TICKET_ASSIGNED",
                `New Ticket Assigned: ${ticket.subject}`,
                `You have been assigned to ticket "${ticket.subject}" by ${mode === 'auto' ? 'system (auto-assigned)' : req.user.name}`,
                previousAssigneeId,
                assignedUser.id
            );
        } catch (notificationError) {
            console.error("Error creating notification:", notificationError);
        }

        res.status(200).json({
            success: true,
            message: mode === 'auto' ? "Ticket auto-assigned successfully" : "Ticket assigned successfully",
            ticket: updatedTicket,
        });
    } catch (error) {
        console.log("Error assigning ticket", error);
        res.status(500).json({
            success: false,
            message: "Server error while assigning ticket"
        });
    }
};

export const submitFeedback = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const isClient = req.user.role === "CLIENT" && ticket.userId === req.user.id;
        const isManager = req.user.role === "MANAGER";
        const isReviewer = req.user.role === "REVIEWER";

        if (!isClient && !isManager && !isReviewer) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to submit feedback on this ticket"
            });
        }

        if (ticket.status !== "RESOLVED" && ticket.status !== "IN_PROGRESS" && ticket.status !== "CLOSED") {
            return res.status(400).json({
                success: false,
                message: "Can only submit feedback on resolved, in progress, or closed tickets"
            });
        }

        const comment = await prisma.comment.create({
            data: {
                ticketId: ticket.id,
                userId: req.user.id,
                content: content,
                isHidden: false,
                isOffensive: false,
                commentCount: 0
            }
        });

        await prisma.ticket.update({
            where: { id },
            data: { feedbackSubmitted: true }
        });

        const updatedTicket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                comments: { 
                    where: { id: comment.id },
                    include: { user: { select: { id: true, username: true, name: true, role: true, profilePhoto: true } } }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            ticket: updatedTicket,
        });
    } catch (error) {
        console.log("Error submitting feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while submitting feedback"
        });
    }
};

export const addReply = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        const canViewHidden = ["REVIEWER", "MANAGER"].includes(req.user.role);
        if (comment.isHidden && !canViewHidden) {
            return res.status(403).json({
                success: false,
                message: "Cannot reply to hidden comments"
            });
        }

        const reply = await prisma.reply.create({
            data: {
                commentId: comment.id,
                userId: req.user.id,
                content: content,
                aiGenerated: false
            }
        });

        await prisma.comment.update({
            where: { id: commentId },
            data: { commentCount: { increment: 1 } }
        });

        const allComments = await prisma.comment.findMany({
            where: { ticketId }
        });

        const totalReplies = allComments.reduce((sum, c) => sum + c.commentCount, 0);
        const hoursSinceCreation = (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);

        if (totalReplies >= 4 && hoursSinceCreation >= 48) {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { chatEnabled: true }
            });
        }

        res.status(201).json({
            success: true,
            message: "Reply added successfully",
            comment: reply,
        });
    } catch (error) {
        console.log("Error adding reply", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding reply"
        });
    }
};

export const editComment = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to edit this comment"
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { 
                content: content,
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    } catch (error) {
        console.log("Error editing comment", error);
        res.status(500).json({
            success: false,
            message: "Server error while editing comment"
        });
    }
};

export const deleteComment = async (req, res) => {
    const { ticketId, commentId } = req.params;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this comment"
            });
        }

        await prisma.comment.delete({ where: { id: commentId } });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.log("Error deleting comment", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting comment"
        });
    }
};

export const editReply = async (req, res) => {
    const { ticketId, commentId, replyId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const reply = await prisma.reply.findUnique({ where: { id: replyId } });
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        if (reply.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to edit this reply"
            });
        }

        const updatedReply = await prisma.reply.update({
            where: { id: replyId },
            data: {
                content: content,
                updatedAt: new Date(),
                editedAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: "Reply updated successfully",
            reply: updatedReply,
        });
    } catch (error) {
        console.log("Error editing reply", error);
        res.status(500).json({
            success: false,
            message: "Server error while editing reply"
        });
    }
};

export const deleteReply = async (req, res) => {
    const { ticketId, commentId, replyId } = req.params;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const reply = await prisma.reply.findUnique({ where: { id: replyId } });
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        if (reply.userId !== req.user.id && req.user.role !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this reply"
            });
        }

        await prisma.reply.delete({ where: { id: replyId } });

        await prisma.comment.update({
            where: { id: commentId },
            data: { commentCount: { decrement: 1 } }
        });

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
        });
    } catch (error) {
        console.log("Error deleting reply", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting reply"
        });
    }
};

export const hideFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { unhideCode } = req.body;

    try {
        if (req.user.role !== "REVIEWER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to hide feedback"
            });
        }

        if (unhideCode !== "SOLEASEHIDE") {
            return res.status(403).json({
                success: false,
                message: "Invalid hide code"
            });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.isHidden) {
            return res.status(400).json({
                success: false,
                message: "Comment is already hidden"
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                isHidden: true,
                unhideCode: "SOLEASEHIDE",
                approvedForManager: false
            }
        });

        res.status(200).json({
            success: true,
            message: "Feedback hidden successfully",
            comment: updatedComment,
        });
    } catch (error) {
        console.log("Error hiding feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while hiding feedback"
        });
    }
};

export const unhideFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { unhideCode } = req.body;

    try {
        if (req.user.role !== "REVIEWER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to unhide feedback"
            });
        }

        if (unhideCode !== "SOLEASEUNHIDE") {
            return res.status(403).json({
                success: false,
                message: "Invalid unhide code"
            });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (!comment.isHidden) {
            return res.status(400).json({
                success: false,
                message: "Comment is not hidden"
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                isHidden: false,
                approvedForManager: false
            }
        });

        res.status(200).json({
            success: true,
            message: "Feedback unhidden successfully",
            comment: updatedComment,
        });
    } catch (error) {
        console.log("Error unhiding feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while unhiding feedback"
        });
    }
};

export const viewHiddenFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { code } = req.body;

    try {
        if (req.user.role !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view hidden feedback"
            });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (!comment.isHidden || !comment.approvedForManager) {
            return res.status(403).json({
                success: false,
                message: "This feedback is not available for viewing"
            });
        }

        if (comment.unhideCode !== code) {
            return res.status(403).json({
                success: false,
                message: "Invalid unhide code"
            });
        }

        res.status(200).json({
            success: true,
            comment,
        });
    } catch (error) {
        console.log("Error viewing hidden feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while viewing hidden feedback"
        });
    }
};

export const approveHiddenForManager = async (req, res) => {
    const { ticketId, commentId } = req.params;

    try {
        if (req.user.role !== "REVIEWER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to approve hidden feedback"
            });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { approvedForManager: true }
        });

        res.status(200).json({
            success: true,
            message: "Hidden feedback approved for Manager view",
            comment: updatedComment,
        });
    } catch (error) {
        console.log("Error approving hidden feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while approving hidden feedback"
        });
    }
};

export const managerIntervention = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        if (req.user.role !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const reply = await prisma.reply.create({
            data: {
                commentId: commentId,
                userId: req.user.id,
                content: content,
                aiGenerated: false
            }
        });

        await prisma.comment.update({
            where: { id: commentId },
            data: { commentCount: { increment: 1 } }
        });

        res.status(201).json({
            success: true,
            message: "Manager intervention added successfully",
            reply: reply,
        });
    } catch (error) {
        console.log("Error adding manager intervention", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding manager intervention"
        });
    }
};

export const triggerAIResponse = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { aiContent } = req.body;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const reply = await prisma.reply.create({
            data: {
                commentId: commentId,
                userId: req.user.id,
                content: aiContent,
                aiGenerated: true
            }
        });

        await prisma.comment.update({
            where: { id: commentId },
            data: { commentCount: { increment: 1 } }
        });

        const existingHistory = ticket.automationHistory || [];
        const newHistory = [
            ...existingHistory,
            {
                action: "AI response generated",
                timestamp: new Date(),
                details: `AI reply for comment ${commentId} on ticket ${ticketId}`
            }
        ];

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { automationHistory: newHistory }
        });

        res.status(201).json({
            success: true,
            message: "AI response triggered successfully",
            reply: reply,
        });
    } catch (error) {
        console.log("Error triggering AI response", error);
        res.status(500).json({
            success: false,
            message: "Server error while triggering AI response"
        });
    }
};

export const uploadAttachment = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        if (req.user.role !== "CLIENT" || ticket.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to upload to this ticket"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const attachment = await prisma.attachment.create({
            data: {
                ticketId: ticket.id,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/uploads/${req.file.filename}`,
                uploadedById: req.user.id
            }
        });

        res.status(201).json({
            success: true,
            message: "Attachment uploaded successfully",
            attachment: attachment,
        });
    } catch (error) {
        console.log("Error uploading attachment", error);
        res.status(500).json({
            success: false,
            message: "Server error while uploading attachment"
        });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        const userId = req.user.id;
        const ticketOwnerId = ticket.userId;
        const userRole = req.user.role;
        
        if (userId !== ticketOwnerId && userRole !== "REVIEWER" && userRole !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this ticket"
            });
        }

        await prisma.ticket.delete({ where: { id: ticketId } });

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });
    } catch (error) {
        console.log("Error deleting ticket", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting ticket"
        });
    }
};
