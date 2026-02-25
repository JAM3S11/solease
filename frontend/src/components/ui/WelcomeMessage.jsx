import React from "react";
import { Link } from "react-router";
import { 
  Plus, 
  Clock, 
  ArrowRight, 
  FileText, 
  Zap,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

const StepCard = ({ number, icon: Icon, title, description, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30">
        {number}
      </div>
      {!isLast && (
        <div className="w-0.5 h-12 bg-gradient-to-b from-blue-600 to-transparent opacity-30 mt-2" />
      )}
    </div>
    <div className="flex-1 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, title, description, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    green: "bg-green-50 dark:bg-green-900/20",
    amber: "bg-amber-50 dark:bg-amber-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
  };
  
  const iconColors = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div className={`p-3 rounded-xl ${colors[color]}`}>
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-lg ${iconColors[color]}`}>
          <Icon size={14} />
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-900 dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

const WelcomeMessage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          How IT Support Works
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Submitting a ticket is easy. Follow these steps to get help.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <StepCard
            number="1"
            icon={FileText}
            title="Describe Your Issue"
            description="Fill in details of your IT problem"
          />
          <StepCard
            number="2"
            icon={Zap}
            title="Set Priority Level"
            description="Choose urgency level"
          />
          <StepCard
            number="3"
            icon={Clock}
            title="Submit & Wait"
            description="We'll respond within 24 hours"
            isLast
          />
        </div>

        <div className="space-y-3">
          <Link
            to="/client-dashboard/new-ticket"
            className="block p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3 mb-1">
              <Plus size={20} className="text-white/90" />
              <span className="text-base font-semibold text-white">Create New Ticket</span>
            </div>
            <p className="text-xs text-blue-100">Submit a support request for any IT issue</p>
          </Link>

          <Link
            to="/client-dashboard/knowledge"
            className="block p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-1">
              <MessageSquare size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-base font-semibold text-gray-900 dark:text-white">Knowledge Base</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Browse helpful articles and FAQs</p>
          </Link>

          <Link
            to="/client-dashboard/all-tickets"
            className="block p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-1">
              <Clock size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-base font-semibold text-gray-900 dark:text-white">View Tickets</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track status of your submitted tickets</p>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          What to Include in Your Ticket
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCard
            icon={AlertCircle}
            title="Error Messages"
            description="Copy any error text you see"
            color="amber"
          />
          <InfoCard
            icon={Clock}
            title="When It Started"
            description="Note when the issue first occurred"
            color="blue"
          />
          <InfoCard
            icon={Shield}
            title="Steps to Reproduce"
            description="List exact steps that caused it"
            color="purple"
          />
          <InfoCard
            icon={CheckCircle2}
            title="What You've Tried"
            description="Solutions you've already attempted"
            color="green"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          to="/client-dashboard/new-ticket"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <Plus size={18} />
          Submit Your First Ticket
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeMessage;
