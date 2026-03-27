import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  Mail, 
  Eye, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Headphones,
  Ticket,
  ArrowLeft,
  Fingerprint,
  Building,
  Database,
  Server,
  UserCheck,
  Activity,
  ArrowRight,
  ArrowDown,
  Wifi,
  Bell,
  RefreshCw,
  StopCircle,
  Play,
  ShieldCheck,
  AlertOctagon,
  MessageSquare,
  ExternalLink,
  Bug,
  TrendingUp,
  LogIn
} from "lucide-react";

const AccountSecurityPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("architecture");

  const sections = [
    { id: "architecture", title: "Architecture" },
    { id: "two-factor", title: "2FA" },
    { id: "password", title: "Password" },
    { id: "sessions", title: "Sessions" },
    { id: "team", title: "Team" },
    { id: "breach", title: "Breach Response" },
  ];

  const securityLayers = [
    {
      layer: "Layer 1",
      name: "Perimeter Security",
      components: ["Firewall", "DDoS Protection", "SSL/TLS Encryption"],
      icon: Shield,
      color: "blue",
      description: "The outermost protection layer blocking external threats"
    },
    {
      layer: "Layer 2",
      name: "Authentication",
      components: ["Password Hashing", "2FA/MFA", "Session Tokens"],
      icon: Lock,
      color: "green",
      description: "Verifies user identity before granting access"
    },
    {
      layer: "Layer 3",
      name: "Authorization",
      components: ["Role-Based Access", "Permission Matrix", "API Keys"],
      icon: UserCheck,
      color: "purple",
      description: "Controls what users can do after authentication"
    },
    {
      layer: "Layer 4",
      name: "Data Protection",
      components: ["Encryption at Rest", "Backup Systems", "Audit Logs"],
      icon: Database,
      color: "amber",
      description: "Secures stored data and maintains integrity"
    },
    {
      layer: "Layer 5",
      name: "Monitoring",
      components: ["Real-time Alerts", "Anomaly Detection", "Activity Logs"],
      icon: Activity,
      color: "red",
      description: "Continuous surveillance for suspicious activities"
    }
  ];

  const securityBenefits = [
    { icon: Shield, title: "Data Protection", description: "Your sensitive information is encrypted and protected from unauthorized access", color: "blue" },
    { icon: UserCheck, title: "Identity Verification", description: "2FA ensures only you can access your account, even if passwords are compromised", color: "green" },
    { icon: Clock, title: "Session Control", description: "Monitor and manage all active sessions from anywhere in the world", color: "purple" },
    { icon: TrendingUp, title: "Compliance", description: "Meet industry security standards and regulatory requirements", color: "amber" },
    { icon: Activity, title: "Real-time Monitoring", description: "Get instant alerts on suspicious activities and login attempts", color: "red" },
    { icon: Lock, title: "Access Control", description: "Granular permissions ensure users only access what they need", color: "primary" }
  ];

  const breachResponseSteps = [
    {
      step: 1,
      title: "Stay Calm & Act Quickly",
      icon: AlertOctagon,
      color: "red",
      actions: [
        "Don't panic - having a plan helps minimize damage",
        "Document everything you notice - times, unusual activities, messages",
        "Don't delete any evidence or change passwords yet (may destroy evidence)",
        "Take screenshots of any suspicious activities"
      ],
      timeframe: "Immediately"
    },
    {
      step: 2,
      title: "Secure Your Account",
      icon: Lock,
      color: "amber",
      actions: [
        "Go to Settings > Security > Sign Out Everywhere",
        "Change your SOLEASE password immediately",
        "If 2FA was disabled, re-enable it with new codes",
        "Check and revoke any unauthorized API keys or integrations",
        "Update passwords on other sites if you reused passwords"
      ],
      timeframe: "Within 15 minutes"
    },
    {
      step: 3,
      title: "Report to SOLEASE",
      icon: MessageSquare,
      color: "blue",
      actions: [
        "Submit a high-priority security ticket",
        "Include all documented evidence and timestamps",
        "Mention if you suspect data was accessed or stolen",
        "Request account temporarily disabled if severe"
      ],
      timeframe: "Immediately"
    },
    {
      step: 4,
      title: "External Account Audit",
      icon: UserCheck,
      color: "green",
      actions: [
        "Check your connected email for unauthorized changes",
        "Review other services using the same password",
        "Enable 2FA on all critical accounts",
        "Monitor bank accounts and credit reports if relevant",
        "Run antivirus/malware scans on your devices"
      ],
      timeframe: "Within 24 hours"
    },
    {
      step: 5,
      title: "Recovery & Prevention",
      icon: Shield,
      color: "purple",
      actions: [
        "Work with SOLEASE support to restore account access",
        "Review and update all security settings",
        "Set up new backup codes and recovery options",
        "Consider using a password manager going forward",
        "Enable login notifications for future alerts"
      ],
      timeframe: "Within 72 hours"
    }
  ];

  const guides = [
    {
      id: "two-factor",
      title: "Two-Factor Authentication (2FA)",
      description: "Add an extra layer of security to your account",
      icon: Fingerprint,
      color: "blue",
      steps: [
        { title: "What is 2FA?", desc: "Two-Factor Authentication adds an extra security layer by requiring not just your password, but also a second verification method (a code sent to your phone or generated by an app) to access your account." },
        { title: "Enable 2FA", desc: "Go to Settings > Security > Two-Factor Authentication. Click 'Enable' to start the setup process. You'll need either a mobile authenticator app (Google Authenticator, Authy) or SMS verification." },
        { title: "Authenticator App Setup", desc: "Download Google Authenticator or Authy from your app store. Scan the QR code displayed on your screen with the app. Enter the 6-digit code shown in the app to verify setup." },
        { title: "SMS Verification Setup", desc: "If you prefer SMS, enter your phone number. We'll send a verification code each time you log in. This is less secure than authenticator apps but more convenient." },
        { title: "Backup Codes", desc: "After enabling 2FA, you'll receive 10 backup codes. Save these in a secure location - they're your fallback if you lose access to your authenticator app or phone." },
        { title: "Recovery Options", desc: "If you're locked out, use a backup code or contact our support team with identity verification to regain access. We can help you reset 2FA after proper verification." }
      ]
    },
    {
      id: "password",
      title: "Password Management",
      description: "Create and maintain strong passwords",
      icon: Lock,
      color: "green",
      steps: [
        { title: "Creating Strong Passwords", desc: "Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols. Avoid personal information like birthdays or names. Use a password manager for generating and storing unique passwords." },
        { title: "Password Requirements", desc: "Your SOLEASE password must be at least 8 characters. We recommend 16+ characters for optimal security. It cannot match your previous 5 passwords or contain common words." },
        { title: "Change Your Password", desc: "Navigate to Settings > Security > Change Password. Enter your current password, then create and confirm your new password. All active sessions will be logged out for security." },
        { title: "Password Expiration", desc: "For business accounts, administrators can set password expiration policies (e.g., require changes every 90 days). Individual users can change passwords anytime from their security settings." },
        { title: "Forgot Your Password?", desc: "Click 'Forgot Password' on the login page. Enter your email and follow the reset link sent to your inbox. The link expires in 1 hour for security. Create a new password after verification." },
        { title: "Password Strength Indicator", desc: "Our registration form shows real-time password strength feedback. Aim for 'Strong' or 'Excellent' before submitting. Use our password generator for instant strong passwords." }
      ]
    },
    {
      id: "sessions",
      title: "Active Sessions & Devices",
      description: "Monitor and control your account access",
      icon: Clock,
      color: "purple",
      steps: [
        { title: "View Active Sessions", desc: "Go to Settings > Security > Active Sessions to see all devices currently logged into your account. Each session shows device type, location, last activity, and login time." },
        { title: "Terminate a Session", desc: "Found an unfamiliar device? Click the three-dot menu next to any session and select 'Sign Out'. This immediately logs out that device. Do this for any sessions you don't recognize." },
        { title: "Sign Out Everywhere", desc: "In case of suspected compromise, use 'Sign Out Everywhere' in Security Settings. This logs out all devices except the current one. You'll need to log in again on each device." },
        { title: "Session Timeout", desc: "Sessions automatically expire after 30 days of inactivity or 8 hours of continuous activity. For sensitive actions, enable 'Require re-authentication' in your security settings." },
        { title: "IP Address Monitoring", desc: "Each session shows the IP address. If you see unfamiliar IPs, your account may be compromised. Contact support immediately and change your password." },
        { title: "Device Recognition", desc: "We remember trusted devices for 30 days. Unrecognized devices will require extra verification. You can mark devices as 'Trusted' to skip additional checks." }
      ]
    },
    {
      id: "team",
      title: "Team Permissions & Roles",
      description: "Manage user access and permissions",
      icon: Users,
      color: "amber",
      steps: [
        { title: "User Roles Explained", desc: "SOLEASE offers three main roles: Client (submit tickets), Reviewer (manage tickets), and Manager (full access). Each role has specific permissions for security." },
        { title: "Manager Role", desc: "Managers can view all tickets, assign reviewers, access reports, manage team members, and configure system settings. They have complete dashboard access." },
        { title: "Reviewer Role", desc: "Reviewers can view assigned tickets, update ticket status, communicate with clients, and add internal notes. They cannot access user management or billing." },
        { title: "Client Role", desc: "Clients can submit tickets, view their own tickets, provide feedback, and update their profile. They have the most limited access for security." },
        { title: "Invite Team Members", desc: "Managers can invite users from Settings > Team > Invite Member. Enter their email and select a role. They'll receive an invitation email to join." },
        { title: "Revoke Access", desc: "To remove a user, go to Settings > Team > select the user > click 'Remove'. Their access is immediately revoked. All their tickets remain but are reassigned." }
      ]
    },
    {
      id: "email",
      title: "Email Security",
      description: "Secure your connected email account",
      icon: Mail,
      color: "primary",
      steps: [
        { title: "Primary Email Security", desc: "Your SOLEASE account is linked to your email. Ensure this email has strong security: unique password, 2FA enabled, and regular monitoring for suspicious activity." },
        { title: "Change Your Email", desc: "Go to Settings > Profile > Email Address. You'll need to verify the new email before it becomes active. All notifications will then be sent to the new address." },
        { title: "Email Notifications", desc: "Configure which notifications you receive: ticket updates, assignment changes, system alerts. Adjust these in Settings > Notifications > Email Preferences." },
        { title: "Spam & Phishing", desc: "SOLEASE emails come from noreply@solease.com. Never click suspicious links in emails. Always verify sender addresses and report phishing attempts to security@solease.com." },
        { title: "Email Verification", desc: "New accounts require email verification. If you didn't receive the email, check spam/junk folders. Use 'Resend Verification' or contact support if issues persist." }
      ]
    }
  ];

  const currentGuide = guides.find(g => g.id === activeSection) || guides[0];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(sectionId);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/help-support")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Help</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>

        {/* Introduction */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Account & Security</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Complete guide to securing your SOLEASE account</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Learn how to protect your account with two-factor authentication, manage passwords, monitor active sessions, and control team access. 
              Follow these best practices to keep your SOLEASE account and data secure.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Architecture</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">2FA</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Sessions</span>
              <span className="px-2.5 sm:px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold rounded-full">Team Access</span>
              <span className="px-2.5 sm:px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold rounded-full">Breach Response</span>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeSection === section.id
                  ? section.id === "architecture" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" :
                    section.id === "two-factor" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" :
                    section.id === "password" ? "bg-green-500 text-white shadow-lg shadow-green-500/25" :
                    section.id === "sessions" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" :
                    section.id === "team" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" :
                    "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="hidden md:inline">{section.title}</span>
              <span className="md:hidden">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Security Architecture Section */}
        <div id="architecture" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-blue-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Security Architecture</h4>
          </div>

          {/* Desktop Architecture View */}
          <div className="hidden lg:block border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg mb-4">
            <div className="p-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">SOLEASE implements a multi-layered security approach to protect your data</p>
              <div className="flex items-center justify-center gap-0">
                {/* User */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center shadow-lg">
                    <UserCheck className="w-6 h-6 text-white mb-1" />
                    <span className="text-white text-[10px] font-semibold">USER</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Authentication</span>
                </div>
                
                <div className="flex flex-col items-center mx-1">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Layer 1: Perimeter */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-16 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold">PERIMETER</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Firewall, SSL</span>
                </div>
                
                <div className="flex flex-col items-center mx-1">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Layer 2: Auth */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-16 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center">
                    <Lock className="w-5 h-5 text-green-500 mb-1" />
                    <span className="text-green-600 dark:text-green-400 text-[10px] font-semibold">AUTHENTICATION</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">2FA, Password</span>
                </div>
                
                <div className="flex flex-col items-center mx-1">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Layer 3: Authorization */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-16 rounded-lg border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 flex flex-col items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-500 mb-1" />
                    <span className="text-purple-600 dark:text-purple-400 text-[10px] font-semibold">AUTHORIZATION</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Roles, Permissions</span>
                </div>
                
                <div className="flex flex-col items-center mx-1">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Layer 4: Data */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-16 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center">
                    <Database className="w-5 h-5 text-amber-500 mb-1" />
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold">DATA</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Encryption, Backup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Architecture View */}
          <div className="lg:hidden border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg mb-4">
            <div className="p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Multi-Layer Security Protection</p>
              <div className="space-y-3">
                {securityLayers.map((layer, index) => (
                  <div key={layer.layer} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      layer.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      layer.color === "green" ? "bg-green-500/10 text-green-500" :
                      layer.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                      layer.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      <layer.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          layer.color === "blue" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                          layer.color === "green" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                          layer.color === "purple" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                          layer.color === "amber" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                          "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}>{layer.layer}</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{layer.name}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Benefits */}
          <div className="border-0 rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">Why Security Matters</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {securityBenefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      benefit.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      benefit.color === "green" ? "bg-green-500/10 text-green-500" :
                      benefit.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                      benefit.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                      benefit.color === "red" ? "bg-red-500/10 text-red-500" :
                      "bg-primary/10 text-primary"
                    }`}>
                      <benefit.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{benefit.title}</h6>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-6 sm:space-y-8">
          {guides.map((guide, guideIndex) => (
            <div 
              id={guide.id}
              key={guide.id}
              className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50"
            >
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                    guide.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25" :
                    guide.color === "green" ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25" :
                    guide.color === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/25" :
                    guide.color === "amber" ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/25" :
                    "bg-gradient-to-br from-primary to-primary/80 text-white shadow-primary/25"
                  }`}>
                    <guide.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Section {guideIndex + 1}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{guide.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">{guide.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-800">
                <div className="space-y-4 sm:space-y-6">
                  {guide.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                          index === 0 
                            ? guide.color === "blue" ? "bg-blue-500 text-white" :
                              guide.color === "green" ? "bg-green-500 text-white" :
                              guide.color === "purple" ? "bg-purple-500 text-white" :
                              guide.color === "amber" ? "bg-amber-500 text-white" :
                              "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          {index + 1}
                        </div>
                        {index < guide.steps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 mt-1.5 sm:mt-2" style={{ minHeight: '16px' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-3 sm:pb-4">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breach Response Section */}
        <div id="breach" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">What To Do If Your Account Is Compromised</h4>
          </div>

          <div className="border-0 rounded-xl overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 shadow-lg mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h5 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">Account Compromised? Act Fast.</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you suspect your SOLEASE account has been hacked or compromised, follow this step-by-step response guide to minimize damage and recover your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Steps */}
          <div className="space-y-4">
            {breachResponseSteps.map((response) => (
              <div key={response.step} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                      response.color === "red" ? "bg-red-500 text-white" :
                      response.color === "amber" ? "bg-amber-500 text-white" :
                      response.color === "blue" ? "bg-blue-500 text-white" :
                      response.color === "green" ? "bg-green-500 text-white" :
                      "bg-purple-500 text-white"
                    }`}>
                      <response.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Step {response.step}:</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{response.title}</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs rounded-full self-start">
                          {response.timeframe}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {response.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contacts */}
          <div className="border-0 rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-lg mt-4 sm:mt-6">
            <div className="p-4 sm:p-5 lg:p-6">
              <h5 className="text-sm sm:text-base font-bold text-white mb-4">Emergency Contacts</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Submit Emergency Ticket</p>
                    <p className="text-sm font-semibold text-white">Use High Priority</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Security Team Email</p>
                    <p className="text-sm font-semibold text-white">security@solease.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg mt-6 sm:mt-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Security Checklist</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Enable two-factor authentication</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Use a strong, unique password</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Review active sessions regularly</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Secure your connected email</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Store backup codes securely</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Log out on shared devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl mt-6 sm:mt-8 mb-6 sm:mb-8">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Security Concerns?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              If you suspect unauthorized access or have security questions, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => navigate("/client-dashboard/new-ticket")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit a Ticket
              </button>
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSecurityPage;