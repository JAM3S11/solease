import React from "react";
import { Link } from "react-router";
import { 
  Plus, 
  Clock, 
  ArrowRight, 
  FileText, 
  Zap,
  MessageSquare,
  CheckCircle2,
  Shield,
  AlertCircle,
  Lightbulb,
  BookOpen,
  BarChart,
  Headphones
} from "lucide-react";
import { motion } from "framer-motion";

const InfoBadge = ({ Icon, label, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    red: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      <Icon size={12} />
      {label}
    </div>
  );
};

const StepCard = ({ number, Icon, title, description, isHighlight }) => {
  return (
    <div className="relative bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${isHighlight ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h4>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-13">{description}</p>
    </div>
  );
};

const InfoCard = ({ Icon, title, description, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };
  
  const iconColors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50",
    green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50",
    red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
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
      title: "text-white",
      desc: "text-blue-100"
    },
    purple: {
      bg: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600",
      hover: "hover:shadow-lg",
      shadow: "shadow-gray-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      title: "text-gray-900 dark:text-white",
      desc: "text-gray-500 dark:text-gray-400"
    },
    green: {
      bg: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600",
      hover: "hover:shadow-lg",
      shadow: "shadow-gray-500/10",
      icon: "text-green-600 dark:text-green-400",
      title: "text-gray-900 dark:text-white",
      desc: "text-gray-500 dark:text-gray-400"
    },
    indigo: {
      bg: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600",
      hover: "hover:shadow-lg",
      shadow: "shadow-gray-500/10",
      icon: "text-indigo-600 dark:text-indigo-400",
      title: "text-gray-900 dark:text-white",
      desc: "text-gray-500 dark:text-gray-400"
    }
  };
  
  const colors = colorClasses[accentColor] || colorClasses.blue;
  
  return (
    <Link
      to={link}
      className={`group block p-5 ${colors.bg} ${colors.hover} rounded-2xl shadow-lg ${colors.shadow} transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon size={24} className={colors.icon} />
        <span className={`text-lg font-semibold ${colors.title}`}>{title}</span>
      </div>
      <p className={`text-sm ${colors.desc}`}>
        {description}
      </p>
      {linkText && (
        <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${colors.title} opacity-0 group-hover:opacity-100 transition-opacity`}>
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

  const steps = [
    { number: "1", icon: FileText, title: "Describe Your Issue", description: "Fill in the details of your IT problem, including error messages, when it started, and any relevant context that helps us understand the issue." },
    { number: "2", icon: Zap, title: "Set Priority Level", description: "Choose the appropriate urgency level based on how the issue impacts your work. Our team will prioritize accordingly." },
    { number: "3", icon: Clock, title: "Submit & Wait", description: "Submit your ticket and we'll respond within 24 hours. You can track the status of your ticket at any time.", isHighlight: true }
  ];

  const ticketTips = [
    { icon: AlertCircle, title: "Error Messages", description: "Copy any error text or codes you see", color: "red" },
    { icon: Clock, title: "When It Started", description: "Note the exact time the issue first occurred", color: "blue" },
    { icon: Shield, title: "Steps to Reproduce", description: "List the exact steps that caused the issue", color: "purple" },
    { icon: CheckCircle2, title: "What You've Tried", description: "Solutions you've already attempted", color: "green" }
  ];

  return (
    <motion.div
      className="space-y-6 max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            <Lightbulb size={36} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How IT Support Works
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Submitting a ticket is easy. Follow these steps to get your IT issue resolved quickly and efficiently.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <InfoBadge Icon={Shield} label="Secure Support" color="blue" />
          <InfoBadge Icon={Clock} label="24h Response" color="green" />
          <InfoBadge Icon={Zap} label="Fast Resolution" color="amber" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            Submission Process
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Follow these simple steps to submit and track your support request.
          </p>
          
          <div className="grid gap-3">
            {steps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                Icon={step.icon}
                title={step.title}
                description={step.description}
                isHighlight={step.isHighlight}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          Icon={Plus}
          title="Create New Ticket"
          description="Submit a support request for any IT issue you're experiencing."
          link="/client-dashboard/new-ticket"
          linkText="Get Started"
          accentColor="blue"
        />

        <ActionCard
          Icon={BookOpen}
          title="Knowledge Base"
          description="Browse helpful articles, FAQs, and troubleshooting guides."
          link="/client-dashboard/knowledge"
          linkText="Explore Now"
          accentColor="purple"
        />

        <ActionCard
          Icon={BarChart}
          title="View Tickets"
          description="Track status of your submitted tickets and view history."
          link="/client-dashboard/all-tickets"
          linkText="View All"
          accentColor="green"
        />

        <ActionCard
          Icon={Headphones}
          title="Contact Support"
          description="Need immediate help? Reach out to our support team."
          link="/client-dashboard/new-ticket"
          linkText="Get in Touch"
          accentColor="indigo"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-500" />
          What to Include in Your Ticket
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Adding these details helps us resolve your issue faster.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ticketTips.map((tip, idx) => (
<InfoCard
              Icon={tip.icon}
              title={tip.title}
              description={tip.description}
              color={tip.color}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          to="/client-dashboard/new-ticket"
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
        >
          <Plus size={20} />
          Submit Your First Ticket
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
        <StatBadge Icon={Clock} label="24/7 Support" />
        <StatBadge Icon={Zap} label="Fast Response" />
        <StatBadge Icon={Shield} label="Expert Team" />
        <StatBadge Icon={CheckCircle2} label="Quality Assurance" />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeMessage;
