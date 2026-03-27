import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail,
  FileText, 
  BookOpen, 
  ChevronDown, 
  ChevronRight,
  MessageSquare,
  Shield,
  Search,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  Download,
  Plus,
  Ticket,
  Tickets,
  Headphones,
  Zap,
  Settings,
  BarChart3,
  Users,
  Code,
  Rocket,
  UserPlus,
  Lock,
  LayoutDashboard
} from "lucide-react";

const faqs = {
  client: [
    {
      question: "How do I submit a support ticket?",
      answer: "Click on the 'Submit Ticket' button in your dashboard or navigate to 'New Ticket' from the quick actions menu. Fill in the required details including subject, description, and urgency level."
    },
    {
      question: "How do I track my ticket status?",
      answer: "You can view all your tickets in the 'My Tickets' section. Each ticket shows its current status (Open, In Progress, Resolved, or Closed) along with any recent updates."
    },
    {
      question: "Can I add attachments to my ticket?",
      answer: "Yes! When submitting a ticket or adding feedback, you can attach files by clicking the paperclip icon in the message input area. Supported formats include images, PDFs, and documents."
    },
    {
      question: "How do I communicate with the support team?",
      answer: "Use the 'Conversation' section in your ticket detail view to send messages directly to the support team. You'll receive notifications when they respond."
    },
    {
      question: "What do the ticket statuses mean?",
      answer: "Open: Your ticket has been received. In Progress: Support team is working on it. Resolved: Issue has been addressed. Closed: Ticket is complete."
    }
  ],
  reviewer: [
    {
      question: "How do I assign tickets to myself?",
      answer: "Navigate to the ticket detail page and click the 'Assign to Me' button, or use the status dropdown to claim ownership of unassigned tickets."
    },
    {
      question: "How do I hide inappropriate comments?",
      answer: "On any comment in the conversation, click the eye icon to hide it from the client view. You'll need to provide a hide code for security purposes."
    },
    {
      question: "Can I create internal notes for tickets?",
      answer: "Yes, as a reviewer you can add internal notes using the Personal Notes section. These are only visible to you and other managers."
    },
    {
      question: "How do I escalate a ticket to a Manager?",
      answer: "Use the 'Manager Intervention' feature in the ticket detail view to request managerial review for complex issues."
    },
    {
      question: "What's the difference between statuses?",
      answer: "Open: Newly submitted tickets. In Progress: Actively being worked on. Resolved: Solution provided, awaiting confirmation. Closed: Fully resolved and archived."
    }
  ],
  manager: [
    {
      question: "How do I view all team activity?",
      answer: "Use the Reports section to view comprehensive analytics on ticket volumes, response times, and team performance metrics."
    },
    {
      question: "Can I reassign tickets between reviewers?",
      answer: "Yes, you can reassign any ticket to a different reviewer from the ticket detail page using the assignment dropdown."
    },
    {
      question: "How do I create internal notes visible to all reviewers?",
      answer: "Use the 'Save Internal' button in the Personal Notes section to create notes visible to other support team members."
    },
    {
      question: "How do I access admin settings?",
      answer: "Navigate to 'Admin Settings' from the sidebar or use the settings icon in your profile menu to access system configuration."
    },
    {
      question: "Can I export ticket data?",
      answer: "Yes, use the Reports section to generate and export ticket data in various formats for analysis."
    }
  ]
};

const categoryCards = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Essential guides to help you set up and configure your account quickly.",
    icon: Rocket,
    color: "primary",
    href: "#general"
  },
  {
    id: "account-security",
    title: "Account & Security",
    description: "Manage team permissions, 2FA, SSO, and secure your environment.",
    icon: Shield,
    color: "blue",
    href: "#account"
  },
  {
    id: "billing",
    title: "Billing & Payments",
    description: "Questions about invoices, usage quotas, and updating payment methods.",
    icon: CreditCard,
    color: "green",
    href: "#account"
  },
  {
    id: "tickets",
    title: "Ticket Management",
    description: "Learn how to submit, track, and manage your support tickets.",
    icon: Ticket,
    color: "purple",
    href: "#tickets"
  },
  {
    id: "workflow",
    title: "Workflow Tools",
    description: "Optimize your workflow with our tools and integrations.",
    icon: Zap,
    color: "amber",
    href: "#workflow"
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with third-party tools and extend functionality.",
    icon: Code,
    color: "slate",
    href: "#general"
  }
];

const popularTopics = [
  { label: "Getting Started", color: "primary" },
  { label: "Account Setup", color: "gray" },
  { label: "Billing Query", color: "gray" },
  { label: "Ticket Status", color: "gray" }
];

const HelpSupportPage = () => {
  const { user } = useAuthenticationStore();
  const userRole = user?.role?.toLowerCase() || "client";
  const { tickets, fetchTickets } = useTicketStore();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingForm, setBillingForm] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
    address: ""
  });
  const [activeSection, setActiveSection] = useState("getting-started");

  useEffect(() => {
    if (userRole === "client") {
      fetchTickets();
    }
  }, [userRole, fetchTickets]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open": return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "in progress": return <Clock className="w-4 h-4 text-amber-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed": return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "in progress": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "resolved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "closed": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const roleContent = {
    client: {
      title: "How can we help you today?",
      subtitle: "Find answers to common questions or get in touch with our support team."
    },
    reviewer: {
      title: "Reviewer Help Center",
      subtitle: "Manage tickets, handle escalations, and access reviewer tools."
    },
    manager: {
      title: "Manager Dashboard Help",
      subtitle: "Oversee team performance, manage tickets, and access reports."
    }
  };

  const recentTickets = tickets.slice(0, 3);
  const roleFaqs = faqs[userRole] || faqs.client;
  
  const filteredFaqs = roleFaqs.filter(faq => 
    !searchQuery || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryContent = () => {
    if (selectedCategory === "tickets" && userRole === "client") {
      return renderClientTickets();
    }
    if (selectedCategory === "account") {
      return renderAccountBilling();
    }
    if (selectedCategory === "getting-started") {
      return renderGettingStarted();
    }
    return renderFaqs();
  };

  const renderAccountBilling = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Current Plan Card */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Current Plan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your subscription details</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Pro Plan</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">$29.99/month</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next billing date</p>
              <p className="font-semibold text-gray-900 dark:text-white">Apr 15, 2026</p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/27</p>
              </div>
            </div>
            <button
              onClick={() => setShowBillingModal(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-white">Payment History</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            { date: "Mar 15, 2026", amount: "$29.99", status: "Paid" },
            { date: "Feb 15, 2026", amount: "$29.99", status: "Paid" },
            { date: "Jan 15, 2026", amount: "$29.99", status: "Paid" }
          ].map((payment, idx) => (
            <div key={idx} className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.date}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payment.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{payment.amount}</span>
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Button */}
      <button
        onClick={() => setShowBillingModal(true)}
        className="w-full py-3 sm:py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Payment Method
      </button>
    </motion.div>
  );

  const renderGettingStarted = () => {
    const guides = [
      {
        id: "signup",
        title: "Create Your Account",
        description: "Sign up and get started with SOLEASE in minutes",
        icon: UserPlus,
        color: "primary",
        steps: [
          { title: "Visit the Registration Page", desc: "Navigate to our signup page by clicking the 'Sign Up' button on the login page. You'll find this button prominently displayed on the landing page." },
          { title: "Enter Your Information", desc: "Fill in your full name, a valid email address, and create a secure password. For optimal security, use a combination of uppercase letters, lowercase letters, numbers, and special characters (e.g., MyS3cur3P@ss!)." },
          { title: "Verify Your Email", desc: "Check your inbox (and spam folder, just in case) for a verification email from SOLEASE. Click the verification link to activate your account. The link expires after 24 hours." },
          { title: "Complete Your Profile", desc: "Add your company information, upload a profile picture, and set your notification preferences. A complete profile helps our team provide better support." }
        ]
      },
      {
        id: "dashboard",
        title: "Navigating the Dashboard",
        description: "Learn how to use the main dashboard features",
        icon: LayoutDashboard,
        color: "blue",
        steps: [
          { title: "Access the Dashboard", desc: "After logging in, you'll be automatically redirected to your personalized dashboard. The dashboard is your central hub for managing all support activities." },
          { title: "Understand the Layout", desc: "The dashboard consists of three main areas: the left sidebar for navigation, the main content area for tickets and information, and the right sidebar for quick actions and stats." },
          { title: "View Quick Stats", desc: "The top section displays key metrics including open tickets, resolved cases, average response times, and customer satisfaction scores. These update in real-time." },
          { title: "Use Quick Actions", desc: "The sidebar provides instant access to common tasks like creating new tickets, viewing your ticket history, accessing reports, and updating your profile settings." },
          { title: "Customize Your View", desc: "Click the settings icon on any widget to rearrange, resize, or hide specific metrics. Your preferences are automatically saved for future sessions." }
        ]
      },
      {
        id: "tickets",
        title: "Creating & Managing Tickets",
        description: "Step-by-step guide to ticket management",
        icon: Ticket,
        color: "purple",
        steps: [
          { title: "Create a New Ticket", desc: "Click the 'New Ticket' button (found in the sidebar or dashboard quick actions). Fill in the subject (be specific), description (include all relevant details), and select the appropriate priority level (Low, Medium, High, or Urgent)." },
          { title: "Categorize Your Ticket", desc: "Select a relevant category from the dropdown menu (e.g., Technical Issue, Billing Inquiry, Feature Request, General Question). This helps route your ticket to the right specialist faster." },
          { title: "Attach Files", desc: "Use the paperclip icon to attach screenshots, documents, or log files that help illustrate your issue. Maximum file size is 10MB. Supported formats: JPG, PNG, PDF, DOCX, TXT." },
          { title: "Submit and Track", desc: "Click 'Submit Ticket' to send your request. You'll receive a confirmation email with your ticket ID. Use this ID to track progress in the 'My Tickets' section." },
          { title: "Monitor Status Changes", desc: "Ticket statuses include: Open (submitted, awaiting review), In Progress (being worked on), Resolved (solution provided), and Closed (confirmed resolved). You'll receive email notifications for status changes." },
          { title: "Provide Feedback", desc: "Once your ticket is marked as resolved, you'll receive a feedback request. Rate your experience and provide comments to help us improve our service." }
        ]
      },
      {
        id: "security",
        title: "Account Security",
        description: "Keep your account safe and secure",
        icon: Lock,
        color: "green",
        steps: [
          { title: "Enable Two-Factor Authentication (2FA)", desc: "Go to Settings > Security and enable 2FA. We support authenticator apps (Google Authenticator, Authy) and SMS verification. This adds an essential layer of protection to your account." },
          { title: "Use Strong, Unique Passwords", desc: "Create a strong password that's at least 12 characters long with a mix of letters, numbers, and symbols. Never reuse passwords across different services. Consider using a password manager." },
          { title: "Review Active Sessions", desc: "Regularly check Settings > Security > Active Sessions to see all devices currently logged into your account. If you notice any unfamiliar devices, click 'Sign Out' to terminate that session." },
          { title: "Keep Email Secure", desc: "Ensure the email associated with your SOLEASE account has proper security settings. Enable 2FA on your email provider and regularly monitor for suspicious activity." },
          { title: "Log Out on Shared Devices", desc: "Always click your profile icon and select 'Sign Out' when using shared or public computers. Never leave your account logged in on unattended devices." }
        ]
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Introduction */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Welcome to SOLEASE</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Your complete guide to getting started</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              This comprehensive guide will walk you through everything you need to know about using SOLEASE effectively. 
              From creating your account to managing tickets and securing your profile, we've covered every step to ensure you get the most out of our platform.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full">Account Setup</span>
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Dashboard</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Tickets</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">Security</span>
            </div>
          </div>
        </div>

        {/* All Guides Expanded */}
        <div className="space-y-4 sm:space-y-6">
          {guides.map((guide, guideIndex) => (
            <div 
              key={guide.id} 
              className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50"
            >
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                    guide.color === "primary" ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-primary/25" :
                    guide.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25" :
                    guide.color === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/25" :
                    "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25"
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
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {guide.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                          index === 0 
                            ? guide.color === "primary" ? "bg-primary text-white" :
                              guide.color === "blue" ? "bg-blue-500 text-white" :
                              guide.color === "purple" ? "bg-purple-500 text-white" :
                              "bg-green-500 text-white"
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

        {/* Pro Tips Section */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Pro Tips for Success</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Use specific ticket subjects for faster resolution</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Attach screenshots when reporting issues</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Enable 2FA for enhanced account security</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Check the FAQ section before submitting tickets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Still Need Help?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              If you can't find what you're looking for in this guide, our support team is here to assist you 24/7.
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
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderClientTickets = () => {
    const filteredTickets = tickets.filter(ticket =>
      !searchQuery || 
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2.5 sm:space-y-3 lg:space-y-4"
      >
        {filteredTickets.length === 0 ? (
          <div className="text-center py-6 sm:py-8 lg:py-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            <Ticket size={28} className="mx-auto mb-2 sm:mb-3 text-gray-400 sm:size-10" />
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
              {tickets.length === 0 ? "You haven't submitted any tickets yet." : "No tickets match your search."}
            </p>
            {tickets.length === 0 && (
              <a href="/client-dashboard/new-ticket" className="text-primary hover:underline font-medium text-xs sm:text-sm">
                Submit your first ticket
              </a>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
            >
              <div className="p-2.5 sm:p-3 lg:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                      <span className={`text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="hidden xs:inline">{ticket.status}</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-primary uppercase">
                        #{ticket.ticketId || ticket._id?.slice(-6)}
                      </span>
                    </div>
                    <h3 className="font-medium text-xs sm:text-sm lg:text-base text-gray-800 dark:text-gray-200 truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 hidden sm:block">
                      {ticket.description}
                    </p>
                    {ticket.updatedAt && (
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 mt-1">
                        Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/client-dashboard/ticket/${ticket._id}/feedback`)}
                    className="text-primary hover:underline text-[10px] sm:text-xs lg:text-sm flex items-center gap-1 flex-shrink-0"
                  >
                    View <ChevronRight size={10} className="sm:size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    );
  };

  const renderFaqs = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2.5 sm:space-y-3 lg:space-y-4"
    >
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-6 sm:py-8 lg:py-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
          <HelpCircle size={28} className="mx-auto mb-2 sm:mb-3 text-gray-400 sm:size-10" />
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">No matching FAQs found.</p>
        </div>
      ) : (
        filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
          >
            <button
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 lg:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="font-medium text-xs sm:text-sm lg:text-base text-gray-800 dark:text-gray-200 pr-2 sm:pr-3">
                {faq.question}
              </span>
              {expandedFaq === index ? (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {expandedFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-2.5 sm:px-3 lg:px-4 pb-2.5 sm:pb-3 lg:pb-4"
              >
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </div>
        ))
      )}
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:p-6 xl:p-8">
        {/* Hero Search Section */}
        <section className="mb-6 sm:mb-8 md:mb-10">
          {/* Header Banner */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
              {roleContent[userRole]?.title || roleContent.client.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {roleContent[userRole]?.subtitle || roleContent.client.subtitle}
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative group mb-4 sm:mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors z-10">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              placeholder="Search articles, guides, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm text-sm sm:text-base md:text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XCircle size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Quick Categories & Popular Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Quick Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">Quick Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryCards.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (category.id === "getting-started") {
                        navigate("/help-support/getting-started");
                      } else if (category.id === "account-security") {
                        navigate("/help-support/account-security");
                      } else if (category.id === "billing") {
                        navigate("/help-support/billing");
                      } else if (category.id === "tickets") {
                        navigate("/help-support/ticket-management");
                      } else if (category.id === "workflow") {
                        navigate("/help-support/workflow-tools");
                      } else if (category.id === "integrations") {
                        navigate("/help-support/integrations");
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-lg border transition-all ${
                      category.color === "primary" ? "border-primary/20 hover:border-primary/50 hover:bg-primary/5" :
                      category.color === "blue" ? "border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5" :
                      category.color === "green" ? "border-green-500/20 hover:border-green-500/50 hover:bg-green-500/5" :
                      category.color === "purple" ? "border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5" :
                      category.color === "amber" ? "border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5" :
                      "border-gray-500/20 hover:border-gray-500/50 hover:bg-gray-500/5"
                    }`}
                  >
                    <category.icon size={16} className={`${
                      category.color === "primary" ? "text-primary" :
                      category.color === "blue" ? "text-blue-500" :
                      category.color === "green" ? "text-green-500" :
                      category.color === "purple" ? "text-purple-500" :
                      category.color === "amber" ? "text-amber-500" :
                      "text-gray-500"
                    }`} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(topic.label)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${
                      topic.color === "primary"
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2">Can't find what you need?</p>
                <button 
                  onClick={() => navigate("/client-dashboard/new-ticket")}
                  className="w-full py-2 px-3 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Ticket size={14} className="sm:size-4" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Browse by Topic
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{categoryCards.length} categories</span>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {categoryCards.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => {
                    if (category.id === "getting-started") {
                      navigate("/help-support/getting-started");
                    } else if (category.id === "account-security") {
                      navigate("/help-support/account-security");
                    } else if (category.id === "billing") {
                      navigate("/help-support/billing");
                    } else if (category.id === "tickets") {
                      navigate("/help-support/ticket-management");
                    } else if (category.id === "workflow") {
                      navigate("/help-support/workflow-tools");
                    } else if (category.id === "integrations") {
                      navigate("/help-support/integrations");
                    } else {
                      setActiveSection(category.id);
                      setSelectedCategory("general");
                    }
                  }}
                  className={`p-3 sm:p-4 lg:p-6 rounded-xl border cursor-pointer transition-all group hover:shadow-md ${
                    activeSection === category.id
                      ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary/30"
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-2.5 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform ${
                    category.color === "primary" ? "bg-primary/10 text-primary" :
                    category.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                    category.color === "green" ? "bg-green-500/10 text-green-500" :
                    category.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                    category.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                    "bg-gray-500/10 text-gray-500"
                  }`}>
                    <category.icon size={18} className="sm:size-5 lg:size-6" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium mb-1 text-gray-900 dark:text-white">{category.title}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{category.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Selected Category Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h2 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {activeSection === "tickets" ? "Your Tickets" : 
                   activeSection === "getting-started" ? "Getting Started Guide" : 
                   activeSection === "account-security" ? "Account & Security" :
                   activeSection === "billing" ? "Billing & Payments" :
                   activeSection === "ticket-management" ? "Ticket Management" :
                   activeSection === "workflow" ? "Workflow Tools" :
                   activeSection === "integrations" ? "Integrations" :
                   "Frequently Asked Questions"}
                </h2>
              </div>
              {renderCategoryContent()}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Help Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 sm:p-5 lg:p-6 rounded-xl bg-gray-900 dark:bg-gray-800 text-white shadow-xl"
            >
              <h3 className="text-sm font-medium mb-2 sm:mb-3 lg:mb-4">Need more help?</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 lg:mb-6">
                Our dedicated support team is available 24/7.
              </p>
              <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                <button
                  onClick={() => navigate("/client-dashboard/new-ticket")}
                  className="w-full py-2 sm:py-2.5 lg:py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                >
                  <Tickets size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Open a Support Ticket
                </button>
                <button className="w-full py-2 sm:py-2.5 lg:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm">
                  <Headphones size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Start Live Chat
                </button>
              </div>
            </motion.div>

            {/* Recent Tickets Widget */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
              <h3 className="text-sm font-medium mb-3 sm:mb-4 text-gray-900 dark:text-white">My Recent Tickets</h3>
              <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
                {recentTickets.length === 0 ? (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center py-3 sm:py-4">
                    No tickets submitted yet
                  </p>
                ) : (
                  recentTickets.map((ticket) => (
                    <div key={ticket._id} className="pb-2.5 sm:pb-3 lg:pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase">
                          #{ticket.ticketId || ticket._id?.slice(-6)}
                        </span>
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase ${
                          ticket.status === "Open" ? "bg-blue-500/10 text-blue-500" :
                          ticket.status === "In Progress" ? "bg-amber-500/10 text-amber-500" :
                          ticket.status === "Resolved" ? "bg-green-500/10 text-green-500" :
                          "bg-gray-500/10 text-gray-500"
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
                        {ticket.subject}
                      </h4>
                      {ticket.updatedAt && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                          Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
                <button
                  onClick={() => setSelectedCategory("tickets")}
                  className="w-full text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-primary hover:underline transition-all"
                >
                  View all tickets
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
              <h3 className="text-sm font-medium mb-3 sm:mb-4 text-gray-900 dark:text-white">Quick Stats</h3>
              <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400">Open Tickets</span>
                  <span className="font-bold text-blue-500 text-xs sm:text-sm">{tickets.filter(t => t.status === "Open").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                  <span className="font-bold text-amber-500 text-xs sm:text-sm">{tickets.filter(t => t.status === "In Progress").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400">Resolved</span>
                  <span className="font-bold text-green-500 text-xs sm:text-sm">{tickets.filter(t => t.status === "Resolved").length}</span>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Billing Modal */}
      <AnimatePresence>
        {showBillingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
            onClick={() => setShowBillingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 100 }}
              className="w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Add Payment Method</h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Securely add your card details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBillingModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={billingForm.name}
                    onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={billingForm.cardNumber}
                    onChange={(e) => setBillingForm({ ...billingForm, cardNumber: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={billingForm.expiry}
                      onChange={(e) => setBillingForm({ ...billingForm, expiry: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={billingForm.cvc}
                      onChange={(e) => setBillingForm({ ...billingForm, cvc: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBillingModal(false)}
                    className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowBillingModal(false);
                      alert("Demo: Payment method added successfully!");
                    }}
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default HelpSupportPage;
