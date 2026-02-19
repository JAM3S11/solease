// controllers/ticket.controller.js
import { Ticket } from "../models/tickets.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "../controllers/notification.controllers.js";
import { sendTicketStatusUpdateEmail } from "../mailtrap/emails.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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

// Create a ticket
export const createTicket = async (req, res) => {
    const { location, issueType, subject, description, urgency } = req.body;

    try {
        // Check if fields are empty
        if (!location || !issueType || !subject || !description || !urgency) {
            return res.status(400).json({
                success: false,
                message: "Kindly fill in all the details"
            });
        };

        // Object of the ticket
        const ticket = await Ticket({
            user: req.user._id,
            location,
            issueType,
            subject,
            description,
            urgency,
            visibility: "Role-Based"
        });

        // Handle file attachment if present
        if (req.file) {
            ticket.attachments.push({
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/uploads/${req.file.filename}`,
                uploadedBy: req.user._id,
                uploadedAt: new Date()
            });
        }

        // Save the ticket
        await ticket.save();

        // return a response
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket,
        })
    } catch (error) {
        console.log("Error creating the ticket", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating ticket"
        })
    }
};

// Get tickets
export const getTickets = async (req, res) => {
    try {
        let query = {};
        let sort = { createdAt: -1 };

        if (req.user.role === "Client") {
            query.user = req.user._id;
            sort = { createdAt: -1 };
        } else if (req.user.role === "Reviewer" || req.user.role === "Manager") {
            query = {}
            sort = {
                createdAt: -1
            };
        };

        const tickets = await Ticket.find(query)
            .populate("user", "username name role")
            .populate("comments.user", "username name role")
            .populate("comments.replies.user", "username name role")
            .select("location issueType subject description urgency status createdAt updatedAt feedbackSubmitted chatEnabled comments attachments")
            .sort(sort);

        res.status(200).json({
            success: true,
            tickets
        });
    } catch (error) {
        console.log("Error fetching the tickets", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching tickets"
        });
    }
};

// Update ticket status (for automation or admin purposes)
export const updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status, isAutomated, chatEnabled } = req.body;

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        // Authorization check: Only Manager and Reviewer can update status
        if (!["Manager", "Reviewer"].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have permission to update ticket status",
            });
        }

        const previousStatus = ticket.status;

        if (status) {
            ticket.status = status;
        }

        if (isAutomated) {
            ticket.isAutomated = isAutomated;
            ticket.autoResolvedAt = new Date();
            ticket.resolutionMethod = "Auto";
        }

        if (typeof chatEnabled === 'boolean') {
            ticket.chatEnabled = chatEnabled;
        }

        await ticket.save();

        if (status && status !== previousStatus) {
            try {
                const ticketOwner = await User.findById(ticket.user);

                if (ticketOwner && ticketOwner.notificationsEnabled !== false) {
                    if (ticketOwner.email) {
                        await sendTicketStatusUpdateEmail(
                            ticketOwner.email,
                            ticketOwner.name,
                            ticket._id.toString(),
                            ticket.subject,
                            previousStatus,
                            status
                        );
                    }

                    await createNotification(
                        ticket.user,
                        ticket._id,
                        "status_update",
                        `Ticket Status Updated: ${status}`,
                        `Your ticket "${ticket.subject}" has been updated from ${previousStatus} to ${status}`,
                        previousStatus,
                        status
                    );
                }
            } catch (notificationError) {
                console.error("Error sending notification/email:", notificationError);
            }
        }

        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            ticket,
        });
    } catch (error) {
        console.log("Error updating ticket status", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating ticket status"
        });
    }
};

// Submit feedback/comment on resolved or in progress ticket
export const submitFeedback = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        if (req.user.role !== "Client" || ticket.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to submit feedback on this ticket"
            });
        }

        if (ticket.status !== "Resolved" && ticket.status !== "In Progress" && ticket.status !== "Closed") {
            return res.status(400).json({
                success: false,
                message: "Can only submit feedback on resolved, in progress, or closed tickets"
            });
        }

        ticket.comments.push({
            user: req.user._id,
            content: content,
            isHidden: false,
            isOffensive: false,
            replies: [],
            commentCount: 0
        });

        ticket.feedbackSubmitted = true;
        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            ticket,
        });
    } catch (error) {
        console.log("Error submitting feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while submitting feedback"
        });
    }
};

// Add reply to feedback/comment
export const addReply = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.isHidden && req.user.role !== "Reviewer" && req.user.role !== "Manager") {
            return res.status(403).json({
                success: false,
                message: "Cannot reply to hidden comments"
            });
        }

        comment.replies.push({
            user: req.user._id,
            content: content,
            createdAt: new Date(),
            updatedAt: new Date(),
            aiGenerated: false
        });

        comment.commentCount += 1;

        const totalReplies = ticket.comments.reduce(
            (sum, c) => sum + c.commentCount, 0
        );
        const hoursSinceCreation = (
            Date.now() - new Date(ticket.createdAt)
        ) / (1000 * 60 * 60);

        if (totalReplies >= 4 && hoursSinceCreation >= 48) {
            ticket.chatEnabled = true;
        }

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Reply added successfully",
            comment,
        });
    } catch (error) {
        console.log("Error adding reply", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding reply"
        });
    }
};

// Edit comment
export const editComment = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to edit this comment"
            });
        }

        comment.content = content;
        comment.updatedAt = new Date();
        comment.editedBy = req.user._id;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment,
        });
    } catch (error) {
        console.log("Error editing comment", error);
        res.status(500).json({
            success: false,
            message: "Server error while editing comment"
        });
    }
};

// Delete comment
export const deleteComment = async (req, res) => {
    const { ticketId, commentId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this comment"
            });
        }

        ticket.comments.pull({ _id: commentId });

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            ticket,
        });
    } catch (error) {
        console.log("Error deleting comment", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting comment"
        });
    }
};

// Edit reply
export const editReply = async (req, res) => {
    const { ticketId, commentId, replyId } = req.params;
    const { content } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        if (reply.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to edit this reply"
            });
        }

        reply.content = content;
        reply.updatedAt = new Date();
        reply.editedBy = req.user._id;
        reply.editedAt = new Date();

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Reply updated successfully",
            reply,
        });
    } catch (error) {
        console.log("Error editing reply", error);
        res.status(500).json({
            success: false,
            message: "Server error while editing reply"
        });
    }
};

// Delete reply
export const deleteReply = async (req, res) => {
    const { ticketId, commentId, replyId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        const replyUserId = reply.user.toString();

        if (replyUserId !== req.user._id.toString() && req.user.role !== "Manager") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this reply"
            });
        }

        comment.replies.pull(replyId);
        comment.commentCount = Math.max(0, comment.commentCount - 1);

        await ticket.save();

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

// Hide feedback (Reviewer only)
export const hideFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { unhideCode } = req.body;

    try {
        if (req.user.role !== "Reviewer") {
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

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
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

        comment.isHidden = true;
        comment.unhideCode = "SOLEASEHIDE";
        comment.approvedForManager = false;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Feedback hidden successfully",
            comment,
        });
    } catch (error) {
        console.log("Error hiding feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while hiding feedback"
        });
    }
};

// Unhide feedback (Reviewer only)
export const unhideFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { unhideCode } = req.body;

    try {
        if (req.user.role !== "Reviewer") {
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

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
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

        comment.isHidden = false;
        comment.approvedForManager = false;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Feedback unhidden successfully",
            comment,
        });
    } catch (error) {
        console.log("Error unhiding feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while unhiding feedback"
        });
    }
};

// View hidden feedback with code (Manager only)
export const viewHiddenFeedback = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { code } = req.body;

    try {
        if (req.user.role !== "Manager") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view hidden feedback"
            });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
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

// Approve hidden feedback for Manager view (Reviewer only)
export const approveHiddenForManager = async (req, res) => {
    const { ticketId, commentId } = req.params;

    try {
        if (req.user.role !== "Reviewer") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to approve hidden feedback"
            });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        comment.approvedForManager = true;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Hidden feedback approved for Manager view",
            comment,
        });
    } catch (error) {
        console.log("Error approving hidden feedback", error);
        res.status(500).json({
            success: false,
            message: "Server error while approving hidden feedback"
        });
    }
};

// Manager intervention - add reply to conversation
export const managerIntervention = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { content } = req.body;

    try {
        if (req.user.role !== "Manager") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        comment.replies.push({
            user: req.user._id,
            content: content,
            createdAt: new Date(),
            updatedAt: new Date(),
            aiGenerated: false
        });

        comment.commentCount += 1;

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Manager intervention added successfully",
            reply: comment.replies[comment.replies.length - 1],
        });
    } catch (error) {
        console.log("Error adding manager intervention", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding manager intervention"
        });
    }
};

// AI-triggered reply (for automation)
export const triggerAIResponse = async (req, res) => {
    const { ticketId, commentId } = req.params;
    const { aiContent } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const comment = ticket.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        comment.replies.push({
            user: req.user._id,
            content: aiContent,
            createdAt: new Date(),
            updatedAt: new Date(),
            aiGenerated: true
        });

        comment.commentCount += 1;
        ticket.automationHistory.push({
            action: "AI response generated",
            timestamp: new Date(),
            details: `AI reply for comment ${commentId} on ticket ${ticketId}`
        });

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "AI response triggered successfully",
            reply: comment.replies[comment.replies.length - 1],
        });
    } catch (error) {
        console.log("Error triggering AI response", error);
        res.status(500).json({
            success: false,
            message: "Server error while triggering AI response"
        });
    }
};

// Upload attachment to existing ticket
export const uploadAttachment = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        if (req.user.role !== "Client" || ticket.user.toString() !== req.user._id.toString()) {
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

        ticket.attachments.push({
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`,
            uploadedBy: req.user._id,
            uploadedAt: new Date()
        });

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Attachment uploaded successfully",
            attachment: ticket.attachments[ticket.attachments.length - 1],
        });
    } catch (error) {
        console.log("Error uploading attachment", error);
        res.status(500).json({
            success: false,
            message: "Server error while uploading attachment"
        });
    }
};
