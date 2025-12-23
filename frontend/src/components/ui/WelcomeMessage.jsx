// WelcomeMessage.jsx
import React from "react";
import { Link } from "react-router";
import { Plus, HelpCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const WelcomeMessage = ({ userName }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 sm:p-16 
      bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 
      rounded-3xl shadow-xl border border-blue-100 dark:border-gray-700 mx-auto max-w-2xl text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-6xl text-blue-500 mb-6">
        <Zap size={64} className="mx-auto" />
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
        Hello, {userName}! Welcome to Your Support Hub.
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        It looks like you haven&apos;t submitted any IT tickets yet. We&apos;re here to help you get started!
      </p>

      <Link
        to="/client-dashboard/new-ticket"
        className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white 
        font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out 
        transform hover:scale-[1.02] flex items-center gap-2 mb-6"
      >
        <Plus size={20} />
        <span>Submit Your First Ticket Now</span>
      </Link>

      <div className="mt-4 flex items-center text-gray-500 dark:text-gray-400">
        <HelpCircle size={18} className="mr-2" />
        <span className="text-sm">Need a hand? Our support team is ready to assist you.</span>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;