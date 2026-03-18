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
  Headphones,
  Zap,
  Settings,
  BarChart3,
  Users,
  Code,
  Rocket
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
    return renderFaqs();
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
        className="space-y-4"
      >
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            <Ticket size={40} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {tickets.length === 0 ? "You haven't submitted any tickets yet." : "No tickets match your search."}
            </p>
            {tickets.length === 0 && (
              <a href="/client/tickets/new" className="text-primary hover:underline font-medium">
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
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                      <span className="text-xs font-semibold text-primary uppercase">
                        #{ticket.ticketId || ticket._id?.slice(-6)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {ticket.description}
                    </p>
                    {ticket.updatedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/client-dashboard/ticket/${ticket._id}/feedback`)}
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                  >
                    View <ChevronRight size={14} />
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
      className="space-y-4"
    >
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
          <HelpCircle size={40} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No matching FAQs found.</p>
        </div>
      ) : (
        filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
          >
            <button
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200 pr-4">
                {faq.question}
              </span>
              {expandedFaq === index ? (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {expandedFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Search Section */}
        <section className="text-center mb-12 py-10 px-6 rounded-xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {roleContent[userRole]?.title || roleContent.client.title}
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for articles, guides, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm text-lg"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-full mb-2">Popular Topics</span>
            {popularTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(topic.label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  topic.color === "primary"
                    ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryCards.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => {
                    setActiveSection(category.id);
                    if (category.id === "tickets") setSelectedCategory("tickets");
                    else if (category.id === "billing" || category.id === "account-security") setSelectedCategory("account");
                    else setSelectedCategory("general");
                  }}
                  className={`p-6 rounded-xl border cursor-pointer transition-all group hover:shadow-md ${
                    activeSection === category.id
                      ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    category.color === "primary" ? "bg-primary/10 text-primary" :
                    category.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                    category.color === "green" ? "bg-green-500/10 text-green-500" :
                    category.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                    category.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                    "bg-gray-500/10 text-gray-500"
                  }`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{category.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{category.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Selected Category Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeSection === "tickets" ? "Your Tickets" : "Frequently Asked Questions"}
                </h2>
              </div>
              {renderCategoryContent()}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Help Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-gray-900 dark:bg-gray-800 text-white shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">Need more help?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Our dedicated support team is available 24/7 to assist with your technical needs.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/client/tickets/new")}
                  className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Ticket size={20} />
                  Open a Support Ticket
                </button>
                <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                  <Headphones size={20} />
                  Start Live Chat
                </button>
              </div>
            </motion.div>

            {/* Recent Tickets Widget */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">My Recent Tickets</h3>
              <div className="space-y-4">
                {recentTickets.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No tickets submitted yet
                  </p>
                ) : (
                  recentTickets.map((ticket) => (
                    <div key={ticket._id} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-primary uppercase">
                          #{ticket.ticketId || ticket._id?.slice(-6)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.status === "Open" ? "bg-blue-500/10 text-blue-500" :
                          ticket.status === "In Progress" ? "bg-amber-500/10 text-amber-500" :
                          ticket.status === "Resolved" ? "bg-green-500/10 text-green-500" :
                          "bg-gray-500/10 text-gray-500"
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
                        {ticket.subject}
                      </h4>
                      {ticket.updatedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
                <button
                  onClick={() => setSelectedCategory("tickets")}
                  className="w-full text-center py-2 text-sm font-bold text-primary hover:underline transition-all"
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
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Open Tickets</span>
                  <span className="font-bold text-blue-500">{tickets.filter(t => t.status === "Open").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                  <span className="font-bold text-amber-500">{tickets.filter(t => t.status === "In Progress").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Resolved</span>
                  <span className="font-bold text-green-500">{tickets.filter(t => t.status === "Resolved").length}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowBillingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Payment Method</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Securely add your card details</p>
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

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={billingForm.name}
                    onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={billingForm.cardNumber}
                    onChange={(e) => setBillingForm({ ...billingForm, cardNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={billingForm.expiry}
                      onChange={(e) => setBillingForm({ ...billingForm, expiry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={billingForm.cvc}
                      onChange={(e) => setBillingForm({ ...billingForm, cvc: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBillingModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowBillingModal(false);
                      alert("Demo: Payment method added successfully!");
                    }}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
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
