import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Client", "Manager", "Reviewer"],
        default: "Client",
    },
    status: {
        type: String,
        enum: ["Active", "Rejected"],
        default: "Active",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    notificationsEnabled: {
        type: Boolean,
        default: true,
    },
    passwordStrength: {
        type: String,
        enum: ['weak', 'medium', 'strong'],
        default: null
    },
    passwordUpdateDeadline: {
        type: Date,
        default: null
    },
    hasUpdatedWeakPassword: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastActivity: {
        type: Date,
        default: null
    },
    onlineAt: {
        type: Date,
        default: null
    },
    profilePhoto: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);