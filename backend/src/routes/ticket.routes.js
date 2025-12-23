//backend>src>routes>ticket.routes.js
import express from "express";
import { protect } from "../middleware/authTicketTok.js";
import { createTicket, getTickets, updateTicket } from "../controllers/ticket.controllers.js";

const router = express.Router();

// Create ticket router
router.post("/create-ticket", protect, createTicket);

// Get ticket router
router.get("/get-ticket", protect, getTickets);

// Update ticket router
router.put("/update-ticket/:id", protect, updateTicket);

export default router;