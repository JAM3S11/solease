//backend>src>models>tickets.model.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Owner of the ticket
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    issueType: {
        type: String,
        enum: ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"],
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Low",
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Officer handling the ticket
        default: null,
    },
}, { timestamps: true });

export const Ticket = mongoose.model("Ticket", ticketSchema);