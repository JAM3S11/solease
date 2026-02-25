import React from "react";
import { Link } from "react-router";
import { 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Ticket,
  Clock,
  CheckCircle,
  MessageSquare,
  Zap,
  Target,
  Lightbulb,
  Users,
  Shield,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

const NoReport = ({ userName, type = "client" }) => {
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

  const isClient = type === "client";
  const isReviewer = type === "reviewer";
  const isAdmin = type === "admin";

  const getLinks = () => {
    if (isClient) {
      return [
        { to: "/client-dashboard/new-ticket", icon: Ticket, title: "Create Ticket", desc: "Submit your first support request", color: "blue" },
        { to: "/client-dashboard/all-tickets", icon: Clock, title: "View Tickets", desc: "Check your existing tickets", color: "purple" }
      ];
    } else if (isReviewer) {
      return [
        { to: "/reviewer-dashboard/assigned-tickets", icon: Ticket, title: "Assigned Tickets", desc: "View tickets assigned to you", color: "blue" },
        { to: "/reviewer-dashboard/all-tickets", icon: BarChart3, title: "All Tickets", desc: "Browse all system tickets", color: "purple" }
      ];
    } else {
      return [
        { to: "/admin-dashboard/users", icon: Users, title: "User Management", desc: "Manage system users", color: "blue" },
        { to: "/admin-dashboard", icon: Settings, title: "Dashboard", desc: "View admin overview", color: "purple" }
      ];
    }
  };

  const getAnalyticsPreview = () => {
    if (isClient) {
      return [
        { icon: Ticket, title: "Ticket Stats", desc: "Total, open & resolved", color: "blue" },
        { icon: Clock, title: "Resolution Time", desc: "Average time to resolve", color: "green" },
        { icon: TrendingUp, title: "Trends", desc: "Monthly patterns", color: "purple" },
        { icon: MessageSquare, title: "Feedback", desc: "Communication activity", color: "pink" },
        { icon: CheckCircle, title: "Satisfaction", desc: "Success rate tracking", color: "yellow" },
        { icon: Zap, title: "Insights", desc: "AI-powered suggestions", color: "indigo" }
      ];
    } else if (isReviewer) {
      return [
        { icon: Ticket, title: "Assigned Tickets", desc: "Your workload", color: "blue" },
        { icon: CheckCircle, title: "Completion Rate", desc: "Tasks completed", color: "green" },
        { icon: Clock, title: "Response Time", desc: "Average response", color: "purple" },
        { icon: Users, title: "Client Engagement", desc: "User interactions", color: "pink" },
        { icon: TrendingUp, title: "Performance", desc: "Your metrics", color: "yellow" },
        { icon: MessageSquare, title: "Feedback", desc: "Client ratings", color: "indigo" }
      ];
    } else {
      return [
        { icon: Users, title: "User Stats", desc: "Total & active users", color: "blue" },
        { icon: Ticket, title: "Ticket Volume", desc: "System-wide tickets", color: "green" },
        { icon: CheckCircle, title: "Resolution Rate", desc: "Tickets resolved", color: "purple" },
        { icon: Clock, title: "Avg Resolution", desc: "Mean time to close", color: "pink" },
        { icon: TrendingUp, title: "Trends", desc: "Monthly patterns", color: "yellow" },
        { icon: Shield, title: "System Health", desc: "Performance metrics", color: "indigo" }
      ];
    }
  };

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
  };

  const gradientClasses = {
    blue: "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
    purple: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            <BarChart3 size={48} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          No Analytics Yet{userName ? `, ${userName}` : ""}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          {isClient && "Start creating tickets to unlock your personalized analytics dashboard and track your support performance."}
          {isReviewer && "Start reviewing tickets to see your performance metrics and team analytics."}
          {isAdmin && "Start managing tickets and users to see system-wide analytics and performance insights."}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 mb-8">
        {getLinks().map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`group p-5 bg-gradient-to-br ${gradientClasses[link.color]} rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3 mb-2">
              <link.icon size={24} className="text-white/90" />
              <span className="text-lg font-semibold text-white">{link.title}</span>
            </div>
            <p className="text-sm text-white/80">
              {link.desc}
            </p>
          </Link>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target size={16} className="text-purple-500" />
            What You'll See in Analytics
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {getAnalyticsPreview().map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${colorClasses[item.color]} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Real-time Data</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={12} />
          <span>Instant Updates</span>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb size={12} />
          <span>Smart Insights</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Link
          to={isClient ? "/client-dashboard/new-ticket" : isReviewer ? "/reviewer-dashboard/assigned-tickets" : "/admin-dashboard"}
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-600/25 hover:shadow-xl hover:scale-[1.02]"
        >
          {isClient ? "Create Your First Ticket" : isReviewer ? "View Assigned Tickets" : "Go to Admin Dashboard"}
          <ArrowRight size={18} />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NoReport;
