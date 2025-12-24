import { useEffect } from "react";
import { delay, motion } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Aboutpage from "./pages/Aboutpage";
import ServicePage from "./pages/ServicePage";
import ContactPage from "./pages/ContactPage";
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

// SERVICE DESK DASHBOARD
import ServiceDeskDashboard from "./components/service/ServiceDeskDashboard";
import ServiceDeskAllTicketPage from "./components/service/ServiceDeskAllTicketPage";
import ServiceDeskNewTicket from "./components/service/ServiceDeskNewTicket";
import ServiceDeskReportPage from "./components/service/ServiceDeskReportPage";
import ServiceDeskProfile from "./components/service/ServiceDeskProfile";

// IT SUPPORT DASHBOARD
import ItSupportDashboard from "./components/it/ItSupportDashboard";
import ItSupportNewTicket from "./components/it/ItSupportNewTicket";
import ItSupportAssignedTicket from "./components/it/ItSupportAssignedTicket";
import ItSupportTicketDetail from "./components/it/ItSupportTicketDetail";
import ItSupportProfile from "./components/it/ItSupportProfile";
import ItSupportReport from "./components/it/ItSupportReport";

// CLIENT DASHBOARD
import ClientDashboard from "./components/client/ClientDashBoard";
import ClientAllTicketPage from "./components/client/ClientAllTicketPage";
import ClientNewTicketPage from "./components/client/ClientNewTicketPage";
import ClientProfilePage from "./components/client/CLientProfilePage";
import ClientReportPage from "./components/client/ClientReportPage";

// USE AUTHENTICATION STORE
import { useAuthenticationStore } from "./store/authStore";

// protect routes that require authentication + correct role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthenticationStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
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
      case "Service Desk":
        return <Navigate to="/servicedesk-dashboard" replace />;
      case "IT Support":
        return <Navigate to="/itsupport-dashboard" replace />;
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
  "/signup",
  "/login",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/admin-dashboard",
  "/servicedesk-dashboard",
  "/itsupport-dashboard",
  "/client-dashboard",
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
        {/* Main Page */}
        <Route
          path="/"
          element={
            <>
              <motion.section 
                id="home" 
                className="min-h-screen"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                // viewport={{ once: false, amount: 0.3 }}
              >
                <Homepage />
              </motion.section>
              <motion.section 
                id="about" 
                className="min-h-screen"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                // viewport={{ once: false, amount: 0.3 }}
              >
                <Aboutpage />
              </motion.section>
              <motion.section 
                id="services" 
                className="min-h-screen"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                // viewport={{ once: false, amount: 0.3 }}
              >
                <ServicePage />
              </motion.section>
              <motion.section 
                id="contact" 
                className="min-h-screen"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
                // viewport={{ once: false, amount: 0.3 }}
              >
                <ContactPage />
              </motion.section>
            </>
          }
        />

        {/** Navigations of getting started process */}
        <Route path="/signup" 
          element={
            <RedirectAuthenticatedUser>
              <SignUpForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/login" 
          element={
            <RedirectAuthenticatedUser>
              <LoginForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/verify-email" 
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/forgot-password" 
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassForm />
            </RedirectAuthenticatedUser>
          } />
        <Route path="/reset-password/:token" 
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

        {/* SERVICE DESK ROUTES */}
        <Route path="/servicedesk-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Service Desk"]}>
              <ServiceDeskDashboard />
            </ProtectedRoute>
          } />
        <Route path="/servicedesk-dashboard/service-tickets"
          element={
            <ProtectedRoute allowedRoles={["Service Desk"]}>
              <ServiceDeskAllTicketPage />
            </ProtectedRoute>
          } />
        <Route path="/servicedesk-dashboard/service-new-ticket"
          element={
            <ProtectedRoute allowedRoles={["Service Desk"]}>
              <ServiceDeskNewTicket />
            </ProtectedRoute>
          } />
        <Route path="/servicedesk-dashboard/service-reports" 
          element={
            <ProtectedRoute allowedRoles={["Service Desk"]}>
              <ServiceDeskReportPage />
            </ProtectedRoute>
          } />
        <Route path="/servicedesk-dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={["Service Desk"]}>
              <ServiceDeskProfile />
            </ProtectedRoute>
          } />
        
        {/* IT SUPPORT ROUTES */}
        <Route path="/itsupport-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportDashboard />
            </ProtectedRoute>
          } />
        <Route path="/itsupport-dashboard/new-ticket" 
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportNewTicket />
            </ProtectedRoute>
          } />
        <Route path="/itsupport-dashboard/assigned-ticket"
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportAssignedTicket />
            </ProtectedRoute>
          } />
        <Route path="/itsupport-dashboard/assigned-ticket/:id" 
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportTicketDetail />
            </ProtectedRoute>
          } />
        <Route path="/itsupport-dashboard/report"
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportReport />
            </ProtectedRoute>
          } />
        <Route path="itsupport-dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={["IT Support"]}>
              <ItSupportProfile />
            </ProtectedRoute>
          } />
        
        {/* CLIENT ROUTES */}
        <Route path="/client-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
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
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;