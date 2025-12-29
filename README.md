# SOLEASE - IT Service Management Platform

![SolEase Showcase](file:///C:/Users/ADMIN/Pictures/Screenshots/Screenshot%202025-12-29%20173633.png) <!-- Placeholder image -->

**SolEase** is a comprehensive, role-based IT service management platform designed to help organizations streamline their support operations. It enables teams to log issues, triage requests, collaborate effectively, and monitor performance through dedicated dashboards for Managers, Service Desk agents, IT Support engineers, and Clients.

---

## ✨ Features

-   **Role-Based Dashboards**: Tailored interfaces for Managers, Service Desk, IT Support, and Clients.
-   **Full Ticket Lifecycle**: Create, assign, update, and track tickets from submission to resolution.
-   **Secure Authentication**: JWT-based authentication with email verification and password recovery.
-   **User Management**: Admins can manage user roles, statuses, and permissions.
-   **Real-time Analytics**: Visualize performance metrics with integrated charts (coming soon for all roles).
-   **Email Notifications**: Automated emails for key events like signup, verification, and password resets.
-   **Data Export**: Easily export ticket data to CSV.

---

## 🛠️ Technology Stack

-   **Frontend**: React 19, Vite, TailwindCSS, DaisyUI, Zustand, React Router, Framer Motion, MUI X Charts, Axios.
-   **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT, Nodemailer, bcrypt, crypto.

---

## 📋 System Requirements

-   Node.js 18+ and npm
-   MongoDB Atlas cluster or a local MongoDB server
-   A Gmail account with an "App Password" for sending transactional emails.
-   A modern web browser (e.g., Chrome, Firefox, Edge).

---

## 🚀 Project Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/solease.git
cd solease
```

### 2. Install Dependencies

Install dependencies for both the backend and frontend.

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

-   **Manager**: Full administrative access. Can view analytics, manage all users and tickets, assign tasks, and configure system settings.
-   **Service Desk**: First line of support. Can view all tickets, create new ones, assign tickets to IT Support, and update statuses.
-   **IT Support**: Technical team. Can view and update tickets assigned to them, plus any unassigned tickets.
-   **Client**: End-users. Can create new tickets, view their own tickets, and track their status.

---

## 🎫 Ticket Lifecycle

1.  **Creation**: A user (Client, Service Desk, or Manager) creates a ticket.
2.  **Listing**: Tickets are displayed based on role-specific permissions.
3.  **Assignment**: A Manager or Service Desk agent assigns an unassigned ticket to an IT Support engineer.
4.  **Updates**: The assigned IT engineer works on the ticket and updates its status (e.g., "In Progress").
5.  **Resolution**: The ticket is marked as "Resolved" or "Closed" once the issue is fixed.

---

## 📚 API Reference

| Category      | Endpoint                          | Description                               |
| ------------- | --------------------------------- | ----------------------------------------- |
| **Auth**      | `POST /sol/auth/signup`           | Register a new user                       |
|               | `POST /sol/auth/verify-email`     | Verify email with a 6-digit code        |
|               | `POST /sol/auth/login`            | Authenticate and receive a JWT cookie     |
|               | `POST /sol/auth/logout`           | Clear the session cookie                  |
|               | `GET /sol/auth/check-auth`        | Restore the current user session          |
| **Tickets**   | `POST /sol/ticket/create-ticket`  | Create a new support ticket               |
|               | `GET /sol/ticket/get-ticket`      | Get a list of tickets (role-dependent)    |
|               | `PUT /sol/ticket/update-ticket/:id` | Update a ticket's status or assignment    |
| **Admin**     | `GET /sol/admin/users`            | Get a list of all users                   |
|               | `PUT /sol/admin/users/:username`  | Update a user's role and status         |
|               | `DELETE /sol/admin/users/:id`     | Delete a user                             |
| **Profile**   | `GET /sol/profile/get-profile`    | Fetch the current user's profile          |
|               | `PUT /sol/profile/put-profile`    | Update profile information                |

---

## 🐛 Troubleshooting

-   **CORS/401 Errors**: Ensure the `CLIENT_URL` in the backend `.env` matches the frontend's origin (`http://localhost:5173`).
-   **MongoDB Connection Issues**: Verify your `MONGO_URI` is correct and that your IP address is allowlisted in MongoDB Atlas.
-   **Email Failures**: Double-check that `EMAIL_USER` and `EMAIL_PASSWORD_APP` are correct and that "Less secure app access" is configured if needed for your Gmail account.

---

## 💡 Suggested Enhancements

-   Add unit and integration tests using a framework like Jest or Vitest.
-   Develop an audit log to track all significant actions (e-g., ticket changes, user approvals) etc.

---

## 🔮 Future Updates

This project is actively under development. Stay tuned for more features and enhancements, including:

-   Real-time notifications for ticket assignments and status changes via sms.
-   Comprehensive reporting dashboards for all user roles.
-   AI-powered chatbot for automated support and ticket triaging.
-   And much more!

We appreciate your patience and support as we continue to improve SolEase.