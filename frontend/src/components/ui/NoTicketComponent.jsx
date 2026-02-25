import React from "react";
import { Link } from "react-router";
import { 
  Plus, 
  MessageCircle,
  ArrowRight,
  Inbox,
  Sparkles,
  ClipboardList,
  UserCheck,
  Clock,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const NoTicketComponent = ({ noTicket, type = "client" }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isReviewer = type === "reviewer";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            {isReviewer ? <ClipboardList size={48} className="text-white" /> : <Inbox size={48} className="text-white" />}
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {isReviewer 
            ? `No assigned tickets yet${noTicket ? `, ${noTicket}` : ""} 👋`
            : `No tickets yet${noTicket ? `, ${noTicket}` : ""} 👋`
          }
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          {isReviewer
            ? "You don't have any tickets assigned to you right now. New tickets will appear here when assigned by the manager."
            : "Your support inbox is empty. Create your first ticket and our IT team will help resolve any technical issues."
          }
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 mb-8">
        {!isReviewer ? (
          <>
            <Link
              to="/client-dashboard/new-ticket"
              className="group p-5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <Plus size={24} className="text-white/90" />
                <span className="text-lg font-semibold text-white">Create New Ticket</span>
              </div>
              <p className="text-sm text-blue-100">
                Submit a support request for any IT issue
              </p>
            </Link>

            <Link
              to="/client-dashboard/knowledge"
              className="group p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Knowledge Base</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Browse helpful articles and FAQs
              </p>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/reviewer-dashboard"
              className="group p-5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <UserCheck size={24} className="text-white/90" />
                <span className="text-lg font-semibold text-white">Go to Dashboard</span>
              </div>
              <p className="text-sm text-blue-100">
                View your reviewer dashboard
              </p>
            </Link>

            <Link
              to="/reviewer-dashboard/all-tickets"
              className="group p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList size={24} className="text-green-600 dark:text-green-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">View All Tickets</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Browse all available tickets
              </p>
            </Link>
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            What happens next?
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Submit Ticket</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create a support request</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">We Review</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Team assesses priority</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Get Help</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Resolution within 24h</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>Fast Response</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={12} />
          <span>Expert Team</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NoTicketComponent;
