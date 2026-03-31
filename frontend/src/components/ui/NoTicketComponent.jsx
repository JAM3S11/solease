import React from "react";
import { Link } from "react-router";
import { 
  Plus, 
  MessageCircle,
  Inbox,
  ClipboardList,
  UserCheck,
  Clock,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  BookOpen,
  BarChart,
  Shield,
  Zap,
  Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

const InfoBadge = ({ Icon, label, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      <Icon size={12} />
      {label}
    </div>
  );
};

const FeatureCard = ({ Icon, title, description, link, linkText, accentColor = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-600 to-blue-700",
      hover: "hover:from-blue-500 hover:to-blue-600",
      shadow: "shadow-blue-500/20",
      icon: "text-white/90",
      text: "text-blue-100"
    },
    purple: {
      bg: "bg-white dark:bg-gray-800",
      hover: "hover:border-purple-300 dark:hover:border-purple-600",
      shadow: "shadow-gray-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      text: "text-gray-500 dark:text-gray-400"
    },
    green: {
      bg: "bg-white dark:bg-gray-800",
      hover: "hover:border-green-300 dark:hover:border-green-600",
      shadow: "shadow-gray-500/10",
      icon: "text-green-600 dark:text-green-400",
      text: "text-gray-500 dark:text-gray-400"
    },
    indigo: {
      bg: "bg-white dark:bg-gray-800",
      hover: "hover:border-indigo-300 dark:hover:border-indigo-600",
      shadow: "shadow-gray-500/10",
      icon: "text-indigo-600 dark:text-indigo-400",
      text: "text-gray-500 dark:text-gray-400"
    }
  };
  
  const colors = colorClasses[accentColor] || colorClasses.blue;
  
  return (
    <Link
      to={link}
      className={`group p-5 ${colors.bg} border-2 border-gray-200 dark:border-gray-700 ${colors.hover} rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon size={24} className={colors.icon} />
        <span className="text-lg font-semibold text-gray-900 dark:text-white">{title}</span>
      </div>
      <p className={`text-sm ${colors.text}`}>
        {description}
      </p>
      {linkText && (
        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {linkText} <ArrowRight size={14} />
        </div>
      )}
    </Link>
  );
};

const StatBadge = ({ Icon, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    <Icon size={14} className="text-gray-400" />
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

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

  const clientSteps = [
    { number: "1", icon: Plus, title: "Create Ticket", description: "Submit a new support request detailing your IT issue, including error messages and when the problem started." },
    { number: "2", icon: Clock, title: "Await Assignment", description: "Our support team will review your ticket and assign it to a qualified technician based on priority." },
    { number: "3", icon: CheckCircle, title: "Get Resolution", description: "A technician will contact you to diagnose and resolve your issue. Most tickets are resolved within 24 hours.", isHighlight: true }
  ];

  const reviewerSteps = [
    { number: "1", icon: ClipboardList, title: "View Assigned Tickets", description: "Access your dashboard to see all tickets specifically assigned to you by the manager." },
    { number: "2", icon: Zap, title: "Review & Prioritize", description: "Assess ticket details, prioritize based on urgency, and begin troubleshooting the reported issue." },
    { number: "3", icon: CheckCircle, title: "Resolve & Close", description: "Work with the client to resolve their issue, then update the ticket status and add resolution notes.", isHighlight: true }
  ];

  const steps = isReviewer ? reviewerSteps : clientSteps;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            {isReviewer ? <ClipboardList size={44} className="text-white" /> : <Inbox size={44} className="text-white" />}
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <CheckCircle size={18} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isReviewer 
            ? `No Assigned Tickets${noTicket ? `, ${noTicket}` : ""}`
            : `No Tickets Yet${noTicket ? `, ${noTicket}` : ""}`
          }
        </h2>

        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          {isReviewer
            ? "You don't have any tickets assigned to you right now. New tickets will appear here when assigned by the manager for your review and resolution."
            : "Your support inbox is empty. Create your first ticket and our IT team will help resolve any technical issues you're experiencing."
          }
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {!isReviewer && (
            <>
              <InfoBadge Icon={Shield} label="Secure Support" color="blue" />
              <InfoBadge Icon={Clock} label="24h Response" color="green" />
              <InfoBadge Icon={Zap} label="Fast Resolution" color="amber" />
            </>
          )}
          {isReviewer && (
            <>
              <InfoBadge Icon={UserCheck} label="Assigned Tasks" color="indigo" />
              <InfoBadge Icon={BarChart} label="Performance Track" color="purple" />
              <InfoBadge Icon={Clock} label="Priority Queue" color="amber" />
            </>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" />
            How {isReviewer ? "Ticket Resolution" : "IT Support"} Works
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isReviewer 
              ? "Follow this workflow to efficiently handle and resolve assigned tickets."
              : "Follow these simple steps to get your IT issue resolved quickly."
            }
          </p>
          
          <div className="grid gap-2 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step.isHighlight ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                    {step.number}
                  </div>
                  <step.icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        {!isReviewer ? (
          <>
            <FeatureCard
              Icon={Plus}
              title="Create New Ticket"
              description="Submit a support request for any IT issue you're experiencing."
              link="/client-dashboard/new-ticket"
              linkText="Get Started"
              accentColor="blue"
            />

            <FeatureCard
              Icon={BookOpen}
              title="Knowledge Base"
              description="Browse helpful articles, FAQs, and troubleshooting guides."
              link="/client-dashboard/knowledge"
              linkText="Explore"
              accentColor="purple"
            />

            <FeatureCard
              Icon={BarChart}
              title="View All Tickets"
              description="Track status of your submitted tickets and history."
              link="/client-dashboard/all-tickets"
              linkText="View Tickets"
              accentColor="green"
            />

            <FeatureCard
              Icon={HelpCircle}
              title="Contact Support"
              description="Need immediate help? Reach out to our support team."
              link="/client-dashboard/contact"
              linkText="Get Help"
              accentColor="indigo"
            />
          </>
        ) : (
          <>
            <FeatureCard
              Icon={UserCheck}
              title="Go to Dashboard"
              description="View your reviewer dashboard and assigned tickets."
              link="/reviewer-dashboard"
              linkText="Open Dashboard"
              accentColor="blue"
            />

            <FeatureCard
              Icon={ClipboardList}
              title="View All Tickets"
              description="Browse all available tickets in the system."
              link="/reviewer-dashboard/all-tickets"
              linkText="Browse Tickets"
              accentColor="purple"
            />

            <FeatureCard
              Icon={BarChart}
              title="Performance Stats"
              description="Track your resolution rate and performance metrics."
              link="/reviewer-dashboard/stats"
              linkText="View Stats"
              accentColor="green"
            />

            <FeatureCard
              Icon={HelpCircle}
              title="Contact Support"
              description="Need immediate help? Reach out to our support team."
              link="/reviewer-dashboard/help"
              linkText="Browse Guides"
              accentColor="indigo"
            />
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
        <StatBadge Icon={Clock} label="24/7 Support" />
        <StatBadge Icon={Zap} label="Fast Response" />
        <StatBadge Icon={Shield} label="Expert Team" />
        <StatBadge Icon={CheckCircle} label="Quality Assurance" />
      </motion.div>
    </motion.div>
  );
};

export default NoTicketComponent;
