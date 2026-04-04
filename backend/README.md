# Deprecated: MongoDB Models

> **Warning**: These Mongoose models are deprecated. The backend now uses PostgreSQL with Prisma ORM.

## Migration Status

The database has been migrated from MongoDB to PostgreSQL. The models in this directory are kept for reference only and are no longer used by the application.

## Legacy Models

The following Mongoose schema definitions were used with MongoDB:

### 1. User Model (`src/models/user.model.js`)
Used for user authentication and management.

```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Client", "Manager", "Reviewer"], default: "Client" },
    status: { type: String, enum: ["Active", "Rejected"], default: "Active" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    notificationsEnabled: { type: Boolean, default: true },
    passwordStrength: { type: String, enum: ['weak', 'medium', 'strong'] },
    passwordUpdateDeadline: Date,
    hasUpdatedWeakPassword: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastActivity: Date,
    onlineAt: Date,
    profilePhoto: String,
}, { timestamps: true });
```

### 2. Ticket Model (`src/models/tickets.model.js`)
Used for support ticket management with comments and attachments.

```javascript
const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    location: { type: String, required: true },
    issueType: { type: String, enum: ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"], required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Low" },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    visibility: { type: String, enum: ["Role-Based"], default: "Role-Based" },
    isAutomated: { type: Boolean, default: false },
    autoResolvedAt: Date,
    automationHistory: [{ action: String, timestamp: Date, details: String }],
    resolutionMethod: { type: String, enum: ["Manual", "Auto"], default: "Manual" },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        isHidden: { type: Boolean, default: false },
        unhideCode: String,
        approvedForManager: { type: Boolean, default: false },
        isOffensive: { type: Boolean, default: false },
        replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: Date,
            aiGenerated: { type: Boolean, default: false },
            editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            editedAt: Date
        }],
        commentCount: { type: Number, default: 0 }
    }],
    feedbackSubmitted: { type: Boolean, default: false },
    chatEnabled: { type: Boolean, default: false },
    attachments: [{
        filename: { type: String, required: true },
        originalName: String,
        mimetype: String,
        size: { type: Number, required: true },
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });
```

### 3. Notification Model (`src/models/notification.model.js`)
Used for user notifications about ticket updates.

```javascript
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    type: { type: String, enum: ["status_update", "new_comment", "ticket_assigned", "ticket_resolved", "feedback_requested"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    previousStatus: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"] },
    newStatus: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"] },
    read: { type: Boolean, default: false },
    readAt: Date
}, { timestamps: true });
```

### 4. ContactUs Model (`src/models/contacts.model.js`)
Used for contact form submissions.

```javascript
const contactUsSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
```

### 5. ContactUserProfile Model (`src/models/contactuser.model.js`)
Extended user profile with contact details.

```javascript
const contactUserSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    county: { type: String, default: "" },
    telephoneNumber: { type: String, default: "" },
}, { timestamps: true });
```

## Why MongoDB Was Deprecated

1. **Data Loss Issues**: MongoDB Atlas free tier clusters automatically pause after 30 days of inactivity, leading to potential data loss
2. **Scaling Limitations**: Free tier has strict limitations and deprecated offerings
3. **Better Alternatives**: PostgreSQL with Prisma provides better data integrity, type safety, and relational modeling

## Current Database

The application now uses PostgreSQL with Prisma ORM. See `prisma/schema.prisma` for the current data models.

## Migration Date

April 2026 - MongoDB models deprecated in favor of PostgreSQL with Prisma ORM.
