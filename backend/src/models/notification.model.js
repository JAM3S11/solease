import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    type: {
        type: String,
        enum: ["status_update", "new_comment", "ticket_assigned", "ticket_resolved", "feedback_requested"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    previousStatus: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: null
    },
    newStatus: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: null
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
