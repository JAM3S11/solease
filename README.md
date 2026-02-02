# SOLEASE - IT Service Management Platform

![SolEase Showcase](https://ik.imagekit.io/jimdanliveurl/Screenshot%202026-01-13%20183119.png) <!-- Placeholder image -->

**SolEase** is a production-ready, comprehensive IT service management platform designed for organizations of all types and sizes. Whether you're a private enterprise, public institution, educational facility, healthcare organization, or non-profit requiring structured support operations, SolEase provides a robust and scalable platform to streamline your support workflows. The platform features role-based dashboards, complete ticket lifecycle management, and a modern responsive interface. **Note**: The system currently supports Client, Reviewer, and Manager roles, with AI-powered automation capabilities being developed to enhance ticket processing efficiency.

---

## 📖 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [System Requirements](#-system-requirements)
- [Installation & Setup](#-installation--setup)
- [Default Administrator](#-default-administrator)
- [Architecture Overview](#-architecture-overview)
- [Authentication & Security](#-authentication--security)
- [Project Structure](#-project-structure)
- [Roles & Features](#-roles--features)
- [Ticket Lifecycle](#-ticket-lifecycle)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Changelog](#-changelog)
- [License](#-license)
- [Future Updates](#-future-updates)

---

## ✨ Features

### Core Functionality
-   **Universal Applicability**: Designed for any organization—from private enterprises to public services, educational institutions, healthcare facilities, and non-profits. SolEase adapts to your organization's unique support needs with flexible configuration options.
-   **Production-Ready**: Fully functional and ready for deployment with complete user management, authentication, ticket lifecycle management, and analytics.
-   **Role-Based Dashboards**: Tailored interfaces for Clients, Reviewers and Managers with role-specific features and permissions.
-   **AI-Ready Architecture**: Foundation for AI-powered ticket automation with `triggerAIResponse` functionality, automated ticket resolution tracking, and comprehensive audit trails.

### Ticket Management
-   **Full Ticket Lifecycle**: Complete ticket management from creation to resolution, including status tracking (Open, In Progress, Resolved, Closed), priority assignment (Low, Medium, High, Critical), and detailed history logging.
-   **Issue Categorization**: Intelligent categorization system supporting Hardware, Software, Network, Account Access, and Other issues with auto-detection capabilities.
-   **Advanced Filtering & Search**: Powerful search and filtering capabilities to quickly locate tickets by status, priority, category, date range, assignee, and keywords.
-   **Comment & Reply System**: Threaded communication with role-based visibility, AI-generated response tracking, and comprehensive audit trails.
-   **File Attachments**: Support for file uploads with secure storage and download functionality.
-   **Feedback System**: Client feedback collection for resolved tickets with satisfaction tracking.

### Security & Authentication
-   **Secure Authentication**: JWT-based authentication with HTTP-only cookies for enhanced security and automatic session management.
-   **Email Verification**: Robust email verification system with 6-digit codes to prevent unauthorized account creation.
-   **Password Security**: Strong password requirements with bcrypt hashing and secure password reset workflows.
-   **Session Management**: Automatic session restoration and secure logout functionality.

### User Management
-   **Comprehensive User Management**: Managers can manage user roles, statuses, and permissions with granular control.
-   **Account Approval Workflow**: New user accounts require Manager approval before becoming active, ensuring controlled access.
-   **User Status Tracking**: Monitor user account statuses (Pending, Approved, Rejected) with audit trails.
-   **Profile Management**: Users can update their profile information, change passwords, and manage email preferences.
-   **Role-Based Access Control**: Secure access control with Client, Reviewer, and Manager roles, each with specific permissions and dashboard views.

### Analytics & Reporting
-   **Real-time Analytics**: Comprehensive performance metrics with interactive charts and dashboards for all user roles.
-   **Data Export**: Export ticket data to CSV format for external analysis and reporting.
-   **Performance Metrics**: Track key performance indicators including resolution rates, ticket volumes, response times, and user satisfaction scores.
-   **Activity Monitoring**: Real-time monitoring of user activities, ticket assignments, and system performance.
-   **Visual Analytics**: Beautiful charts and graphs using Recharts and MUI X-Charts for data visualization.

### Communication
-   **Email Notifications**: Automated emails for critical events including signup confirmations, email verification, password resets, and ticket updates.
-   **Notification Preferences**: Configurable notification settings to match user preferences and organizational policies.

### Additional Features
-   **Modern Responsive Design**: Fully responsive interface built with React 19 and Tailwind CSS that works seamlessly across desktop, tablet, and mobile devices.
-   **Dark/Light Theme Support**: User preference-based theming with smooth transitions and persistent settings.
-   **Rich UI Components**: Modern interface using Radix UI components, DaisyUI, Framer Motion animations, and Lucide React icons.
-   **Advanced Navigation**: Breadcrumb navigation, sidebar menus, and intuitive routing with React Router 7.
-   **Legal Pages**: Complete Terms of Service and Privacy Policy pages for compliance.
-   **Contact System**: Integrated contact form for general inquiries and support requests.
-   **Comprehensive Audit Logging**: Complete logging of all system activities, AI actions, and user interactions for compliance and troubleshooting.

---

## 🛠️ Technology Stack

-   **Frontend**: React 19, Vite, TailwindCSS, DaisyUI, Zustand, React Router 7, Framer Motion, MUI X Charts, Radix UI, Axios, Recharts.
-   **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT, Nodemailer, bcryptjs, Mailtrap, Multer, Redis (for AI processing), Rate limiting with Upstash.

---

## 🏗️ Architecture Overview

SOLEASE follows a modern full-stack architecture designed for scalability, maintainability, and security:

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React SPA)   │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Express 5     │    │ • Users         │
│ • Vite          │    │ • JWT Auth      │    │ • Tickets       │
│ • TailwindCSS   │    │ • Nodemailer    │    │ • Contacts      │
│ • Zustand       │    │ • bcrypt        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Roles    │    │   Email Service │    │   Analytics     │
│ • Manager       │    │   (Gmail SMTP)  │    │   (Charts)      │
│ • Client        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Frontend**: Single Page Application built with React, providing role-based dashboards and real-time interactions
- **Backend**: RESTful API server handling business logic, authentication, and data processing
- **Database**: NoSQL MongoDB database for flexible data storage and querying
- **Authentication**: JWT-based session management with email verification
- **Email Service**: Automated notifications for user actions and ticket updates
- **State Management**: Client-side state handled via Zustand stores

### Data Flow

1. User interacts with React frontend
2. API requests are sent to Express backend
3. Backend validates requests and interacts with MongoDB
4. Responses are processed and displayed in the UI
5. Real-time updates via polling or WebSocket (future enhancement)

### Security Measures

- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Role-based access control (RBAC)

---

## 📋 System Requirements

-   Node.js 18+ and npm
-   MongoDB Atlas cluster or a local MongoDB server
-   A Gmail account with an "App Password" for sending transactional emails.
-   A modern web browser (e.g., Chrome, Firefox, Edge).

---

## 🚀 Installation & Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm**: Comes bundled with Node.js
- **Git**: For cloning the repository
- **MongoDB**: Either MongoDB Atlas (cloud) or local MongoDB server
- **Gmail Account**: For email notifications with App Password configured

Verify installations:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 8.x.x or higher
git --version   # Should show version info
```

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/solease.git
cd solease
```

### 2. Install Dependencies

Install dependencies for both the backend and frontend,

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD_APP=your_gmail_app_password
NODE_ENV=development
```

Optionally, you can create a `.env` file in the `frontend` directory if you need to override the default API URL:

```env
VITE_API_URL=http://localhost:5001/sol
```

### 4. Run the Application

Run the backend and frontend servers in separate terminals.

```bash
# Run the backend server (from the 'backend' directory)
npm run dev

# Run the frontend development server (from the 'frontend' directory)
npm run dev
```

-   The backend will be available at `http://localhost:5001`.
-   The frontend will be available at `http://localhost:5173`.

---

## 👤 Default Administrator

On the first run, a default **Manager** account is created with the following credentials:
-   **Username**: `adminManager`
-   **Password**: `Admin@123`

It is strongly recommended to change the password and email for this account immediately after your first login.

---

## 🔐 Authentication & Security

-   **Signup & Verification**: New users sign up and receive a 6-digit verification code via email. Once verified, their account is "Pending" until a Manager approves it.
-   **Login**: Authenticated users receive a secure, HTTP-only JWT cookie.
-   **Session Management**: A `check-auth` endpoint restores user sessions on application load.
-   **Route Protection**:
    -   **Frontend**: `ProtectedRoute` and `RedirectAuthenticatedUser` components handle access control based on authentication status, verification, and user role.
    -   **Backend**: `verifyToken` and `protect` middleware secure API endpoints.

---

## 📂 Project Structure

### Backend

The backend follows a standard MVC-like pattern:

-   `src/server.js`: Main application entry point.
-   `src/config/`: Database connection and data seeding.
-   `src/models/`: Mongoose schemas for Users, Tickets, and Contacts.
-   `src/controllers/`: Business logic for handling requests.
-   `src/routes/`: API endpoint definitions.
-   `src/middleware/`: Authentication and authorization guards.
-   `src/mailtrap/`: Email templates and sending logic.

### Frontend

The frontend is structured by feature and role:

-   `src/main.jsx`: Application entry point.
-   `src/App.jsx`: Main router and layout management.
-   `src/store/`: Zustand stores for global state management (`authStore`, `ticketStore`, etc.).
-   `src/components/`: Contains subdirectories for each role (`admin`, `client`, etc.), shared UI (`ui`), and authentication forms.
-   `src/pages/`: Components for the public-facing landing pages.
-   `src/lib/`: Shared utilities, including the configured Axios instance.

---

## 🎭 Roles & Features

The platform supports a comprehensive role-based system with clear responsibilities and permissions:

-   **Manager**: Full administrative access. Can manage all users, view system analytics, configure settings, oversee all tickets, perform user approvals, and have complete system oversight. Managers can also override AI decisions and manage automation settings.
-   **Reviewer**: Handles assigned tickets, manages ticket resolution workflow, provides technical solutions, and communicates with clients. Reviewers can update ticket status, add comments, and manage attachments.
-   **Client**: End-users who create tickets, view their own tickets, track status, submit feedback, and communicate with support staff. Clients can update their profiles and manage their support requests.
-   **Pending**: Initial status for new users awaiting Manager approval before gaining full system access.

---

## 🎫 Ticket Lifecycle

1.  **Creation**: Clients or Managers create tickets with title

---

## 📚 API Reference

The SOLEASE API provides RESTful endpoints for managing users, tickets, and system administration. All endpoints require authentication except for signup and email verification.

### Authentication Endpoints

#### POST /sol/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "client"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "user": {
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "client",
    "isVerified": false,
    "status": "pending"
  }
}
```

**Error Responses:**
- `400`: Validation error (invalid email, weak password, etc.)
- `409`: User already exists

#### POST /sol/auth/verify-email
Verify user email with 6-digit code.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "verificationCode": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully. Your account is pending approval."
}
```

#### POST /sol/auth/login
Authenticate user and receive JWT cookie.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "client",
    "status": "approved"
  }
}
```

**Cookies Set:**
- `token`: HTTP-only JWT cookie

#### POST /sol/auth/logout
Clear the authentication session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /sol/auth/check-auth
Restore user session on application load.

**Response (200):**
```json
{
  "user": {
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "client",
    "status": "approved"
  }
}
```

### Ticket Management Endpoints

#### POST /sol/ticket/create-ticket
Create a new support ticket.

**Request Body:**
```json
{
  "title": "Unable to access email",
  "description": "I cannot log into my email account. Error: Invalid credentials.",
  "priority": "high",
  "category": "technical"
}
```

**Response (201):**
```json
{
  "message": "Ticket created successfully",
  "ticket": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Unable to access email",
    "description": "I cannot log into my email account...",
    "status": "open",
    "priority": "high",
    "category": "technical",
    "createdBy": "johndoe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /sol/ticket/get-ticket
Retrieve tickets based on user role.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (open, in_progress, resolved, closed)
- `priority`: Filter by priority (low, medium, high, urgent)

**Response (200):**
```json
{
  "tickets": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Unable to access email",
      "status": "open",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### PUT /sol/ticket/update-ticket/:id
Update ticket status, assignment, or details.

**Request Body:**
```json
{
  "status": "in_progress",
  "assignedTo": "manager1",
  "notes": "Investigating the issue...",
  "priority": "urgent"
}
```

**Response (200):**
```json
{
  "message": "Ticket updated successfully",
  "ticket": {
    "id": "507f1f77bcf86cd799439011",
    "status": "in_progress",
    "assignedTo": "manager1",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Administration Endpoints

#### GET /sol/admin/users
Retrieve all users (Manager only).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `role`: Filter by role
- `status`: Filter by status

**Response (200):**
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "role": "client",
      "status": "approved",
      "createdAt": "2024-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### PUT /sol/admin/users/:username
Update user role and status (Manager only).

**Request Body:**
```json
{
  "role": "manager",
  "status": "approved"
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "username": "johndoe",
    "role": "manager",
    "status": "approved"
  }
}
```

#### DELETE /sol/admin/users/:id
Delete a user account (Manager only).

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### Profile Management Endpoints

#### GET /sol/profile/get-profile
Get current user's profile information.

**Response (200):**
```json
{
  "user": {
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "client",
    "status": "approved",
    "createdAt": "2024-01-10T09:00:00Z",
    "lastLogin": "2024-01-15T10:00:00Z"
  }
}
```

#### PUT /sol/profile/put-profile
Update user profile information.

**Request Body:**
```json
{
  "email": "new.email@example.com",
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "username": "johndoe",
    "email": "new.email@example.com"
  }
}
```

### Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error information"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid request data
- `AUTHENTICATION_ERROR`: Invalid or missing credentials
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (duplicate, etc.)
- `INTERNAL_ERROR`: Server error

---

## 🚀 Deployment

### Production Environment Setup

#### Prerequisites
- Node.js 18+ installed on production server
- MongoDB Atlas cluster or dedicated MongoDB server
- Domain name with SSL certificate
- Reverse proxy (nginx recommended)
- Process manager (PM2 recommended)

#### 1. Server Preparation
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt-get install nginx
```

#### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/your-username/solease.git
cd solease

# Install dependencies for both backend and frontend
cd backend && npm install --production
cd ../frontend && npm install && npm run build
cd ..
```

#### 3. Environment Configuration
Create production `.env` files:

**backend/.env:**
```env
PORT=5001
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret_key
CLIENT_URL=https://yourdomain.com
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASSWORD_APP=your_app_password
```

**frontend/.env:**
```env
VITE_API_URL=https://yourdomain.com/api
```

#### 4. Build and Start Application
```bash
# Build frontend for production
cd frontend
npm run build
cp -r dist/* ../backend/public/

# Start backend with PM2
cd ../backend
pm2 start src/server.js --name "solease-backend"
pm2 startup
pm2 save
```

#### 5. Nginx Configuration
Create `/etc/nginx/sites-available/solease`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Serve static files
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /sol/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/solease /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com
```

#### 7. Database Setup
- Create MongoDB Atlas cluster or set up local MongoDB
- Ensure network access is configured for your server IP
- Create database user with appropriate permissions

#### 8. Email Configuration
- Set up Gmail App Password for production email sending
- Consider using services like SendGrid for higher volume

#### 9. Monitoring and Maintenance
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs solease-backend

# Restart application
pm2 restart solease-backend

# Update application
git pull origin main
npm install --production
pm2 restart solease-backend
```

#### 10. Backup Strategy
- Set up automated MongoDB backups
- Backup application code and configuration
- Consider off-site backup storage

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/solease` |
| `JWT_SECRET` | JWT signing secret | `your-256-bit-secret` |
| `CLIENT_URL` | Frontend URL | `https://yourdomain.com` |
| `EMAIL_USER` | Gmail address for notifications | `noreply@yourdomain.com` |
| `EMAIL_PASSWORD_APP` | Gmail App Password | `abcd-efgh-ijkl-mnop` |

### Security Considerations
- Use strong, unique JWT secrets
- Configure firewall rules (UFW/iptables)
- Keep dependencies updated
- Use HTTPS only
- Implement rate limiting
- Regular security audits

---

## 🤝 Contributing

We welcome contributions to SOLEASE! Please follow these guidelines to ensure smooth collaboration.

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/solease.git
   cd solease
   ```

2. **Set up Development Environment**
   Follow the [Installation & Setup](#-installation--setup) guide above.

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Standards

#### Frontend (React)
- Use functional components with hooks
- Follow React best practices and ESLint rules
- Use TypeScript for type safety (if applicable)
- Component naming: PascalCase
- File naming: kebab-case for files, PascalCase for components

#### Backend (Node.js)
- Follow Express.js conventions
- Use async/await for asynchronous operations
- Proper error handling with try/catch
- Consistent API response format

#### General
- Write clear, concise commit messages
- Use descriptive variable and function names
- Add comments for complex logic
- Follow the existing code style and patterns

### Pull Request Process

1. **Test Your Changes**
   ```bash
   # Run frontend tests
   cd frontend && npm run test

   # Run backend tests (when available)
   cd backend && npm run test
   ```

2. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update API documentation for endpoint changes

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Create Pull Request**
   - Push your branch to GitHub
   - Create a PR with a clear description
   - Reference any related issues

### Commit Message Convention

We follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Code Review Process

- All PRs require review from at least one maintainer
- Address review comments promptly
- Ensure CI/CD checks pass
- Squash commits if requested

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Provide detailed steps to reproduce bugs
- Include browser/console logs when applicable
- Suggest solutions if possible

### Development Workflow

1. Choose an issue or create one
2. Create a feature branch
3. Implement changes with tests
4. Ensure linting and type checking pass
5. Submit PR for review
6. Address feedback and merge

### Getting Help

- Check existing issues and documentation first
- Join our community discussions
- Contact maintainers for guidance

Thank you for contributing to SOLEASE! 🚀

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Authentication Issues
-   **CORS/401 Errors**: Ensure the `CLIENT_URL` in the backend `.env` matches the frontend's origin exactly (`http://localhost:5173` for development). Check browser console for detailed error messages.
-   **Login Fails**: Verify username/password combination. Check if account is approved by Manager. Ensure email is verified.
-   **Session Expires Unexpectedly**: Check JWT token expiration settings. Clear browser cookies and try logging in again.

#### Database Issues
-   **MongoDB Connection Issues**: Verify your `MONGO_URI` is correct and accessible. Ensure your IP address is whitelisted in MongoDB Atlas network access settings.
-   **Database Seeding Fails**: Check MongoDB user permissions. Ensure the database exists and is accessible.
-   **Data Not Persisting**: Verify MongoDB connection is stable. Check for connection timeouts in logs.

#### Email Issues
-   **Email Verification Not Received**: Check spam/junk folders. Verify Gmail App Password is correctly configured. Check email service logs.
-   **Email Sending Fails**: Double-check `EMAIL_USER` and `EMAIL_PASSWORD_APP` in `.env`. Ensure Gmail account allows SMTP access. Consider firewall restrictions.
-   **Bulk Email Issues**: For production, consider using dedicated email services like SendGrid instead of Gmail.

#### Application Startup Issues
-   **Port Already in Use**: Kill processes using the required ports (5001 for backend, 5173 for frontend) or change port configurations.
-   **Dependencies Installation Fails**: Clear npm cache (`npm cache clean --force`) and delete `node_modules`. Reinstall with `npm install`.
-   **Build Fails**: Ensure all required environment variables are set. Check for TypeScript/JavaScript syntax errors.

#### Frontend Issues
-   **Page Not Loading**: Check if backend server is running. Verify API endpoints are accessible. Check browser network tab for failed requests.
-   **Styling Issues**: Clear browser cache. Ensure TailwindCSS is properly configured and DaisyUI is installed.
-   **State Management Problems**: Check Zustand store configurations. Verify user authentication state is properly maintained.

#### Performance Issues
-   **Slow Loading**: Check network connectivity. Optimize images and assets. Consider implementing caching strategies.
-   **Memory Usage High**: Monitor for memory leaks. Check for infinite loops in components or API calls.
-   **Database Query Slow**: Add proper indexes to MongoDB collections. Optimize query patterns.

#### Development Environment
-   **Hot Reload Not Working**: Restart development servers. Check file watching configurations in Vite.
-   **Linting Errors**: Run `npm run lint` to identify issues. Fix ESLint configuration or code style problems.
-   **Type Errors**: Run `npm run typecheck` (if available) to identify TypeScript issues.

### Getting Help
If you encounter issues not covered here:
1. Check the [FAQ](#-faq) section
2. Review GitHub Issues for similar problems
3. Create a new issue with detailed information:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser/OS information
   - Console logs and error messages
   - Configuration details (without sensitive information)

### Logs and Debugging
- **Backend Logs**: Check console output when running `npm run dev`
- **Frontend Logs**: Use browser developer tools (F12) to view console logs
- **Database Logs**: Check MongoDB logs for connection/query issues
- **Network Logs**: Use browser network tab to inspect API calls

### Preventive Measures
- Keep dependencies updated regularly
- Test configuration changes in staging environment first
- Monitor application logs for early issue detection
- Maintain regular backups of database and configuration

---

## ❓ FAQ

### General Questions

**Q: What is SOLEASE?**  
A: SOLEASE is a comprehensive IT service management platform designed for organizations to streamline their support workflows through role-based dashboards and automated ticket management.

**Q: Who can use SOLEASE?**  
A: Any organization requiring structured support operations, including private enterprises, public institutions, educational facilities, healthcare organizations, and non-profits.

**Q: What are the main user roles?**  
A: Currently, there are two main roles: Managers (full administrative access) and Clients (end-users who create and track tickets). IT Support and Service Desk roles are planned for removal in future updates.

### Technical Questions

**Q: What technologies does SOLEASE use?**  
A: Frontend: React 19, Vite, TailwindCSS, DaisyUI, Zustand, Axios. Backend: Node.js, Express 5, MongoDB, JWT, Nodemailer.

**Q: Is SOLEASE open source?**  
A: Yes, SOLEASE is open source and licensed under the MIT License.

**Q: Can I deploy SOLEASE on-premises?**  
A: Yes, you can deploy it on your own infrastructure. See the [Deployment](#-deployment) section for detailed instructions.

### Account & Authentication

**Q: How do I reset my password?**  
A: Password reset functionality is not yet implemented. Contact your Manager or system administrator to reset your password manually.

**Q: Why is my account status "Pending"?**  
A: New accounts require approval from a Manager before they become active. You'll receive an email notification once approved.

**Q: I didn't receive the verification email. What should I do?**  
A: Check your spam/junk folder. If still not received, contact support or try registering again with the same email address.

### Ticket Management

**Q: How do I create a support ticket?**  
A: Log in as a Client, navigate to the ticket creation page, and fill in the required details including title, description, priority, and category.

**Q: Can I edit my ticket after submission?**  
A: Currently, only Managers can update ticket details. Clients can view their tickets but cannot modify them after creation.

**Q: How do I track my ticket progress?**  
A: Log in to your dashboard and view your tickets. You'll see the current status and any updates from Managers.

### Administration

**Q: How do I approve new user accounts?**  
A: As a Manager, go to the Admin panel, view pending users, and approve their accounts.

**Q: Can I export ticket data?**  
A: Yes, Managers can export ticket data to CSV format from the analytics dashboard.

**Q: How do I manage user roles and permissions?**  
A: Managers have full access to user management through the Admin panel, where you can update roles, statuses, and delete users.

### Troubleshooting

**Q: I'm getting a CORS error. What should I do?**  
A: Ensure the `CLIENT_URL` in your backend `.env` file matches your frontend URL exactly, including protocol and port.

**Q: The application won't start. What could be wrong?**  
A: Check that all dependencies are installed, environment variables are set correctly, and MongoDB is running and accessible.

**Q: Email notifications aren't working. How can I fix this?**  
A: Verify your Gmail credentials, ensure "Less secure app access" is configured, and check that your email account allows SMTP access.

### Development & Contributing

**Q: How can I contribute to SOLEASE?**  
A: See our [Contributing](#-contributing) guidelines. We welcome bug reports, feature requests, and code contributions.

**Q: Are there any development guidelines?**  
A: Yes, follow our code standards for consistent development. Use the established patterns and run tests before submitting changes.

**Q: Can I request new features?**  
A: Absolutely! Create a GitHub issue with your feature request, including detailed description and use case.

### Future Plans

**Q: When will AI automation be available?**  
A: AI-powered ticket automation is currently in development. Stay tuned for updates in future releases.

**Q: Will there be mobile apps?**  
A: Mobile app development is planned for future updates. The current web application is responsive and works on mobile devices.

**Q: How often are updates released?**  
A: Updates are released as features are completed. Major releases include significant new functionality, while minor updates include bug fixes and improvements.

If you have questions not covered here, please check our GitHub issues or create a new issue for community discussion.

---

## 💡 Suggested Enhancements

-   Add unit and integration tests using a framework like Jest or Vitest.
-   Develop an audit log to track all significant actions (e.g., ticket changes, user approvals), etc.

---

## 🔮 Future Updates

This project is actively under development. Stay tuned for more features and enhancements, including:

-   **Advanced AI Integration**: Full implementation of natural language processing for automated ticket categorization, intelligent routing, and solution suggestions.
-   **Real-time Notifications**: SMS and push notifications for ticket assignments and status changes.
-   **Enhanced Analytics**: Advanced reporting dashboards with predictive analytics and trend analysis.
-   **AI Chatbot**: Intelligent support bot for automated ticket triaging and initial assistance.
-   **Mobile Applications**: Native iOS and Android apps for on-the-go ticket management.
-   **Integration Platform**: APIs and webhooks for integration with third-party tools like Slack, Microsoft Teams, and JIRA.
-   **Advanced Automation**: Workflow automation with custom rules and triggers.
-   **Knowledge Base**: Integrated help center and self-service portal.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License allows for free use, modification, and distribution of the software, provided that the original copyright notice and disclaimer are included in all copies or substantial portions of the software.

---

## 📝 Changelog

### [v1.2.0] - 2025-02-02 (Current)
- Enhanced UI with Radix UI components and shadcn integration
- Improved theme support with consistent dark/light mode
- Advanced breadcrumb navigation system
- Privacy Policy and Terms of Service pages added
- Sidebar background and visual improvements
- Enhanced admin dashboard with better analytics
- Improved Reviewer navigation and workflow
- Production-ready deployment configuration

### [v1.1.0] - 2025-01-15
- AI-ready architecture with `triggerAIResponse` functionality
- Comprehensive automation history tracking
- AI-generated comment/reply system
- Enhanced ticket categorization with auto-detection
- File attachment support for tickets
- Feedback system for client satisfaction
- Real-time activity monitoring
- Advanced search and filtering capabilities

### [v1.0.0] - 2025-10-24
- Initial release of SOLEASE platform
- Role-based access control (Client, Reviewer, Manager)
- Full ticket lifecycle management
- JWT authentication with email verification
- Responsive React frontend with TailwindCSS
- RESTful API with Express.js backend
- MongoDB database integration
- Email notifications via Mailtrap
- CSV data export functionality
- User approval workflow system

---

Thank you for your interest in SolEase. We welcome contributions and feedback as we continue to improve the platform.