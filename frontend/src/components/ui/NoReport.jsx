import React from "react";
import { Link } from "react-router";
import { 
  TrendingUp, 
  ArrowRight,
  BarChart3,
  Ticket,
  Clock,
  CheckCircle,
  MessageSquare,
  Zap,
  Lightbulb,
  Users,
  Shield,
  Settings,
  FileText,
  Activity,
  BarChart,
  PieChart,
  Sparkles
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

const ActionCard = ({ Icon, title, description, link, linkText, accentColor = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
      hover: "hover:shadow-xl hover:scale-[1.02]",
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
      className={`group block p-5 ${colors.bg} border-2 border-gray-200 dark:border-gray-700 ${colors.hover} rounded-2xl shadow-lg ${colors.shadow} transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon size={24} className={colors.icon} />
        <span className={`text-lg font-semibold ${accentColor === 'blue' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{title}</span>
      </div>
      <p className={`text-sm ${colors.text}`}>
        {description}
      </p>
      {linkText && (
        <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${accentColor === 'blue' ? 'text-white' : 'text-blue-600 dark:text-blue-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          {linkText} <ArrowRight size={14} />
        </div>
      )}
    </Link>
  );
};

const StatCard = ({ Icon, title, description, color = "blue" }) => {
  const cardColors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
  };
  
  const iconColors = {
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
  };
  
  const cardColor = cardColors[color] || cardColors.blue;
  const iColor = iconColors[color] || iconColors.blue;
  
  return (
    <div className={`rounded-xl p-4 transition-all duration-200 hover:shadow-md border ${cardColor}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed ml-13">{description}</p>
    </div>
  );
};

const StatBadge = ({ Icon, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    <Icon size={14} className="text-gray-400" />
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

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

  const getDescription = () => {
    if (isClient) {
      return "Start creating tickets to unlock your personalized analytics dashboard. Track your support history, monitor resolution times, and view performance trends to better understand your IT support experience.";
    } else if (isReviewer) {
      return "Start reviewing and resolving tickets to see your performance metrics. Monitor your workload, response times, completion rates, and client satisfaction scores to track your effectiveness.";
    } else {
      return "Start managing tickets and users to access system-wide analytics. Monitor overall performance, user engagement, ticket volume, and team productivity across the entire support system.";
    }
  };

  const getCtaText = () => {
    if (isClient) return "Create Your First Ticket";
    if (isReviewer) return "View Assigned Tickets";
    return "Go to Admin Dashboard";
  };

  const getLinks = () => {
    if (isClient) {
      return [
        { to: "/client-dashboard/new-ticket", Icon: Ticket, title: "Create Ticket", desc: "Submit your first support request to start tracking", linkText: "Get Started", accentColor: "blue" },
        { to: "/client-dashboard/all-tickets", Icon: FileText, title: "View Tickets", desc: "Check your existing tickets and their status", linkText: "View All", accentColor: "purple" }
      ];
    } else if (isReviewer) {
      return [
        { to: "/reviewer-dashboard/assigned-tickets", Icon: Ticket, title: "Assigned Tickets", desc: "View tickets assigned to you for review", linkText: "Open Dashboard", accentColor: "blue" },
        { to: "/reviewer-dashboard/report", Icon: BarChart, title: "Reports", desc: "View detailed performance analytics", linkText: "View Reports", accentColor: "purple" }
      ];
    } else {
      return [
        { to: "/admin-dashboard/users", Icon: Users, title: "User Management", desc: "Manage system users and permissions", linkText: "Manage Users", accentColor: "blue" },
        { to: "/admin-dashboard", Icon: Settings, title: "Dashboard", desc: "View admin overview and settings", linkText: "View Dashboard", accentColor: "purple" }
      ];
    }
  };

  const getAnalyticsPreview = () => {
    if (isClient) {
      return [
        { Icon: Ticket, title: "Ticket Statistics", description: "View total, open, and resolved tickets with detailed breakdowns", color: "blue" },
        { Icon: Clock, title: "Resolution Time", description: "Track average time to resolve issues and identify patterns", color: "green" },
        { Icon: TrendingUp, title: "Trend Analysis", description: "Visualize monthly patterns and track issue frequency over time", color: "purple" },
        { Icon: CheckCircle, title: "Satisfaction Score", description: "Monitor your satisfaction rating based on resolved tickets", color: "indigo" }
      ];
    } else if (isReviewer) {
      return [
        { Icon: Ticket, title: "Assigned Workload", description: "View all tickets currently assigned to you with priorities", color: "blue" },
        { Icon: CheckCircle, title: "Completion Rate", description: "Track your task completion percentage and success metrics", color: "green" },
        { Icon: Clock, title: "Response Time", description: "Monitor your average response and resolution times", color: "purple" },
        { Icon: Users, title: "Client Engagement", description: "View client interactions and communication history", color: "indigo" }
      ];
    } else {
      return [
        { Icon: Users, title: "User Statistics", description: "Total users, active users, and user growth trends", color: "blue" },
        { Icon: Ticket, title: "Ticket Volume", description: "System-wide ticket counts across all categories and statuses", color: "green" },
        { Icon: CheckCircle, title: "Resolution Rate", description: "Overall ticket resolution rate and team performance", color: "purple" },
        { Icon: Activity, title: "System Health", description: "Monitor system performance metrics and uptime", color: "indigo" }
      ];
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            <BarChart3 size={44} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Analytics Yet{userName ? `, ${userName}` : ""}
        </h2>

        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          {getDescription()}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <InfoBadge Icon={Activity} label="Real-time Data" color="blue" />
          <InfoBadge Icon={Zap} label="Instant Updates" color="green" />
          <InfoBadge Icon={PieChart} label="Visual Reports" color="amber" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        {getLinks().map((link) => (
          <ActionCard
            key={link.to}
            Icon={link.Icon}
            title={link.title}
            description={link.desc}
            link={link.to}
            linkText={link.linkText}
            accentColor={link.accentColor}
          />
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <BarChart size={20} className="text-blue-600 dark:text-blue-400" />
            What You'll See in Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Once you start using the system, these metrics will become available in your dashboard.
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {getAnalyticsPreview().map((item, idx) => (
              <StatCard
                key={idx}
                Icon={item.Icon}
                title={item.title}
                description={item.description}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          to={isClient ? "/client-dashboard/new-ticket" : isReviewer ? "/reviewer-dashboard/assigned-tickets" : "/admin-dashboard"}
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
        >
          {isClient ? <Ticket size={20} /> : isReviewer ? <Ticket size={20} /> : <Settings size={20} />}
          {getCtaText()}
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
        <StatBadge Icon={Activity} label="Real-time Data" />
        <StatBadge Icon={Zap} label="Fast Updates" />
        <StatBadge Icon={Lightbulb} label="Smart Insights" />
        <StatBadge Icon={Shield} label="Secure & Private" />
      </motion.div>
    </motion.div>
  );
};

export default NoReport;
