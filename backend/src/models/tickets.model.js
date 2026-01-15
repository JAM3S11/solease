//backend>src>models>tickets.model.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Creator/owner of the ticket
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
    isAutomated: {
        type: Boolean,
        default: false
    },
    autoResolvedAt: {
        type: Date,
        default: null
    },
    automationHistory: [{
        action: String,
        timestamp: Date,
        details: String
    }],
    resolutionMethod: {
        type: String,
        enum: ["Manual", "Auto"],
        default: "Manual"
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
} });

export const Ticket = mongoose.model("Ticket", ticketSchema);