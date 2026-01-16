//backend>src>routes>ticket.routes.js
import express from "express";
import { protect } from "../middleware/authTicketTok.js";
import { createTicket, getTickets, updateTicketStatus, submitFeedback, addReply, editReply, deleteReply, hideFeedback, unhideFeedback, viewHiddenFeedback, approveHiddenForManager, managerIntervention, triggerAIResponse } from "../controllers/ticket.controllers.js";

const router = express.Router();

// Create ticket router
router.post("/create-ticket", protect, createTicket);

// Get tickets router
router.get("/get-ticket", protect, getTickets);

// Update ticket status router
router.put("/ticket/:id/status", protect, updateTicketStatus);

// Submit feedback/comment on resolved ticket
router.post("/ticket/:id/feedback", protect, submitFeedback);

// Add reply to feedback/comment
router.post("/ticket/:ticketId/comment/:commentId/reply", protect, addReply);

// Edit reply
router.put("/ticket/:ticketId/comment/:commentId/reply/:replyId", protect, editReply);

// Delete reply
router.delete("/ticket/:ticketId/comment/:commentId/reply/:replyId", protect, deleteReply);

// Hide feedback (Reviewer only)
router.put("/ticket/:ticketId/comment/:commentId/hide", protect, hideFeedback);

// Unhide feedback (Reviewer only)
router.put("/ticket/:ticketId/comment/:commentId/unhide", protect, unhideFeedback);

// View hidden feedback with code (Manager only)
router.post("/ticket/:ticketId/comment/:commentId/view-hidden", protect, viewHiddenFeedback);

// Approve hidden feedback for Manager view (Reviewer only)
router.put("/ticket/:ticketId/comment/:commentId/approve", protect, approveHiddenForManager);

// Manager intervention - add reply to conversation
router.post("/ticket/:ticketId/comment/:commentId/manager-intervention", protect, managerIntervention);

// AI-triggered reply (for automation)
router.post("/ticket/:ticketId/comment/:commentId/ai-response", protect, triggerAIResponse);

export default router;
