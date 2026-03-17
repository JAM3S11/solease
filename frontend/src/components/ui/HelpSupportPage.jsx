import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  BookOpen, 
  ChevronDown, 
  ChevronRight,
  MessageSquare,
  Shield,
  Clock,
  Search,
  ExternalLink
} from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

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

const contactInfo = {
  email: "support@solease.com",
  phone: "+1 (555) 123-4567",
  hours: "Monday - Friday, 9AM - 6PM EST"
};

const HelpSupportPage = () => {
  const { user } = useAuthenticationStore();
  const userRole = user?.role?.toLowerCase() || "client";
  
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "account", label: "Account & Billing", icon: Shield },
    { id: "tickets", label: "Tickets & Support", icon: MessageCircle },
    { id: "technical", label: "Technical Help", icon: BookOpen },
  ];

  const roleFaqs = faqs[userRole] || faqs.client;
  
  const filteredFaqs = roleFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Help & Support
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Find answers to common questions or get in touch with our support team.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <a
            href="mailto:support@solease.com"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Email Support</p>
              <p className="text-sm text-gray-500">support@solease.com</p>
            </div>
          </a>
          <a
            href="tel:+15551234567"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Call Us</p>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            </div>
          </a>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Business Hours</p>
              <p className="text-sm text-gray-500">Mon-Fri, 9AM - 6PM EST</p>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </motion.div>

        {/* Role-specific FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {userRole === "client" ? "Client" : userRole === "reviewer" ? "Reviewer" : "Manager"} View
            </span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HelpCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p>No matching FAQs found.</p>
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
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Knowledge Base</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Browse our comprehensive knowledge base for detailed guides and tutorials.
            </p>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              Browse Articles <ExternalLink size={14} />
            </button>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">System Status</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Check the current status of our services and any ongoing incidents.
            </p>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View Status <ExternalLink size={14} />
            </button>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 dark:border-primary/30"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Still need help?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our support team is available to assist you with any questions.
              </p>
            </div>
            <a
              href="mailto:support@solease.com"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle size={18} />
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupportPage;
