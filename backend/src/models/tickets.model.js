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
    visibility: {
        type: String,
        enum: ["Role-Based"],
        default: "Role-Based"
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
        },
        isHidden: {
            type: Boolean,
            default: false
        },
        unhideCode: {
            type: String
        },
        approvedForManager: {
            type: Boolean,
            default: false
        },
        isOffensive: {
            type: Boolean,
            default: false
        },
        replies: [{
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
            },
            updatedAt: {
                type: Date
            },
            aiGenerated: {
                type: Boolean,
                default: false
            },
            editedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            editedAt: {
                type: Date
            }
        }],
        commentCount: {
            type: Number,
            default: 0
        }
    }],
    feedbackSubmitted: {
        type: Boolean,
        default: false
    },
    chatEnabled: {
        type: Boolean,
        default: false
    },
    attachments: [{
        filename: {
            type: String,
            required: true,
            trim: true
        },
        originalName: {
            type: String,
            trim: true
        },
        mimetype: {
            type: String,
        },
        size: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            default: null
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            default: null
        }
    }]
}, { timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
} });

export const Ticket = mongoose.model("Ticket", ticketSchema);