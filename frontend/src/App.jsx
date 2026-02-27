import { useEffect } from "react";
import { delay, motion } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Aboutpage from "./pages/Aboutpage";
import ServicePage from "./pages/ServicePage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Header from "./common/Header";
import Footer from "./common/Footer";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import ForgotPassForm from "./components/ForgotForm";
import EmailVerificationPage from "./components/EmailVerification";
import ResetPassword from "./components/ResetPassword";

//ADMIN DASHBOARD
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import AdminUserDetailPage from "./components/admin/AdminUserDetailPage";
import AdminTicketsView from "./components/admin/AdminTicketsView";
import AdminPendingTickets from "./components/admin/AdminPendingTickets";
import AdminNewTicketPage from "./components/admin/AdminNewTicketPage";
import AdminReportPage from "./components/admin/AdminReportPage";
import AdminSettingPage from "./components/admin/AdminSettingPage";

//REVIEWER DASHBOARD
import ReviewerDashbord from "./components/reviewer/ReviewerDashbord";
import ReviewerNewTicketPage from "./components/reviewer/ReviewerNewTicketPage";
import ReviewerAssignedTickets from "./components/reviewer/ReviewerAssignedTickets";
import ReviewerTicketDetail from "./components/reviewer/ReviewerTicketDetail";
import ReviewerReportPage from "./components/reviewer/ReviewerReportPage";

// // SERVICE DESK DASHBOARD
// import ServiceDeskDashboard from "./components/service/ServiceDeskDashboard";
// import ServiceDeskAllTicketPage from "./components/service/ServiceDeskAllTicketPage";
// import ServiceDeskNewTicket from "./components/service/ServiceDeskNewTicket";
// import ServiceDeskReportPage from "./components/service/ServiceDeskReportPage";
// import ServiceDeskProfile from "./components/service/ServiceDeskProfile";

// // IT SUPPORT DASHBOARD
// import ItSupportDashboard from "./components/it/ItSupportDashboard";
// import ItSupportNewTicket from "./components/it/ItSupportNewTicket";
// import ItSupportAssignedTicket from "./components/it/ItSupportAssignedTicket";
// import ItSupportTicketDetail from "./components/it/ItSupportTicketDetail";
// import ItSupportProfile from "./components/it/ItSupportProfile";
// import ItSupportReport from "./components/it/ItSupportReport";

// CLIENT DASHBOARD
import ClientDashboard from "./components/client/ClientDashBoard";
import ClientAllTicketPage from "./components/client/ClientAllTicketPage";
import ClientNewTicketPage from "./components/client/ClientNewTicketPage";
import ClientProfilePage from "./components/client/CLientProfilePage";
import ClientReportPage from "./components/client/ClientReportPage";
import FeedbackComponent from "./components/ui/FeedbackComponent";

// USE AUTHENTICATION STORE
import { useAuthenticationStore } from "./store/authStore";
import ReviewerProfilePage from "./components/reviewer/ReviewerProfilePage";
import AllNotificationsPage from "./components/ui/AllNotificationsPage";

// protect routes that require authentication + correct role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthenticationStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // check if user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // or a 403 page
  }

  return children;
};

// redirect authenticated users away from login/signup
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthenticationStore();

  if (isAuthenticated && user?.isVerified) {
    if (user.role === "Pending" || user.status === "Pending") {
      // Don’t redirect yet, let them see login or show info
      return children;
    }

    switch (user.role) {
      case "Manager":
        return <Navigate to="/admin-dashboard" replace />;
      case "Reviewer":
        return <Navigate to="/reviewer-dashboard" replace />;
      case "Client":
        return <Navigate to="/client-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

//Hide the headers and footer here
const dashboardRoutes = [
  "/auth/signup",
  "/auth/login",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/admin-dashboard",
  "/reviewer-dashboard",
  "/client-dashboard",
  "/admin-dashboard/notifications",
  "/reviewer-dashboard/notifications",
  "/client-dashboard/notifications",
];

const App = () => {
  // Checks authentications of users
  const { isCheckingAuth, checkAuth } = useAuthenticationStore();

  const location = useLocation();
  // Check if current path starts with a dashboard route
  const hideLayout = dashboardRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    if (!hideLayout) {
      const sections = document.querySelectorAll("section[id]");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              if (id) {
                window.history.replaceState(null, "", `#${id}`);
              }
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.3,
        }
      );

      sections.forEach((section) => observer.observe(section));

      return () => {
        sections.forEach((section) => observer.unobserve(section));
      };
    }
  }, [hideLayout]);

  // Checking authentication
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-blue-600 animate-pulse w-1/2"></div>
      </div>
    );
  }

  return (
    <div>
      {!hideLayout && <Header />}

      <Routes>
        {/* Homepage - Standalone */}
        <Route
          path="/"
          element={
            <motion.section
              id="home"
              className="min-h-screen"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Homepage />
            </motion.section>
          }
        />

        {/* About Page - Standalone */}
        <Route
          path="/about"
          element={
            <motion.section
              className="min-h-screen"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Aboutpage />
            </motion.section>
          }
        />

        {/* Services Page - Standalone */}
        <Route
          path="/services"
          element={
            <motion.section
              className="min-h-screen"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ServicePage />
            </motion.section>
          }
        />

        {/* Contact Page - Standalone */}
        <Route
          path="/contact"
          element={
            <motion.section
              className="min-h-screen"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ContactPage />
            </motion.section>
          }
        />

        {/** Navigations of getting started process */}
        <Route path="/auth/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/auth/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/auth/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/auth/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/auth/reset-password/:token"
          element={
            <ResetPassword />
          } />

        {/* ADMIN DASHBOARD ROUTES */}
        <Route path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/users"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/users/:username"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminUserDetailPage />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/admin-tickets"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminTicketsView />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/admin-pending-tickets"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminPendingTickets />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/admin-new-ticket"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminNewTicketPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-dashboard/admin-reports"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminReportPage />
            </ProtectedRoute>
          } />
        <Route path="/admin-dashboard/admin-settings"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AdminSettingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-dashboard/notifications"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <AllNotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* REVIEWER ROLES */}
        <Route path="/reviewer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerDashbord />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/new-ticket"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerNewTicketPage />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/assigned-ticket"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerAssignedTickets />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/ticket/:id"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerTicketDetail />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/ticket/:id"
          element={
            <ProtectedRoute allowedRoles={["Reviewer", "Manager"]}>
              <ReviewerTicketDetail />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/ticket/:id/feedback"
          element={
            <ProtectedRoute allowedRoles={["Client", "Reviewer", "Manager"]}>
              <FeedbackComponent />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/new-ticket"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerNewTicketPage />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerProfilePage />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/report"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <ReviewerReportPage />
            </ProtectedRoute>
          } />
        <Route path="/reviewer-dashboard/notifications"
          element={
            <ProtectedRoute allowedRoles={["Reviewer"]}>
              <AllNotificationsPage />
            </ProtectedRoute>
          } />

        {/* CLIENT ROUTES */}
        <Route path="/client-dashboard/all-tickets"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientAllTicketPage />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard/new-ticket"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientNewTicketPage />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientProfilePage />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard/report"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientReportPage />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard/ticket/:id/feedback"
          element={
            <ProtectedRoute allowedRoles={["Client", "Reviewer", "Manager"]}>
              <FeedbackComponent />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
        <Route path="/client-dashboard/notifications"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <AllNotificationsPage />
            </ProtectedRoute>
          } />

        {/* Static Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;