import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar,
  Search,
  Clock,
  Filter,
  RefreshCw,
  Inbox
} from "lucide-react";

const NoRecordsFound = ({ dateRangeLabel = "this period", onClearFilter }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, y: -20, rotate: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3, duration: 0.4 }
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.4, duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Decorative top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="p-8 text-center">
          {/* Animated Icon Container */}
          <motion.div 
            variants={iconVariants}
            className="relative inline-block mb-6"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
            
            {/* Main icon circle */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full" />
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Inbox size={36} className="text-white" />
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <Search size={16} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={contentVariants}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Records Found
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2">
              No tickets match your selected criteria
            </p>
            
            {/* Date Range Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-100 dark:border-blue-800 mb-6">
              <Calendar size={14} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {dateRangeLabel}
              </span>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium mb-3 flex items-center justify-center gap-2">
                <Filter size={14} className="text-gray-400" />
                Try these options:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  Last 30 Days
                </span>
                <span className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  Last 90 Days
                </span>
                <span className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  All Time
                </span>
              </div>
            </div>

            {/* Info text */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
              <Clock size={12} />
              <span>Data is updated in real-time</span>
            </div>

            {/* Action buttons */}
            {onClearFilter && (
              <motion.button
                onClick={onClearFilter}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={16} />
                Clear Filter & Show All
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Decorative bottom pattern */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        {/* Floating bubbles decoration */}
        <div className="absolute -bottom-4 -left-4 -right-4 h-8 overflow-hidden pointer-events-none">
          <motion.div 
            variants={bubbleVariants}
            className="absolute bottom-0 left-[10%] w-3 h-3 bg-blue-400/30 rounded-full"
          />
          <motion.div 
            variants={bubbleVariants}
            className="absolute bottom-0 left-[30%] w-2 h-2 bg-indigo-400/30 rounded-full"
            style={{ transitionDelay: "0.1s" }}
          />
          <motion.div 
            variants={bubbleVariants}
            className="absolute bottom-0 left-[50%] w-4 h-4 bg-purple-400/30 rounded-full"
            style={{ transitionDelay: "0.2s" }}
          />
          <motion.div 
            variants={bubbleVariants}
            className="absolute bottom-0 left-[70%] w-2 h-2 bg-blue-400/30 rounded-full"
            style={{ transitionDelay: "0.3s" }}
          />
          <motion.div 
            variants={bubbleVariants}
            className="absolute bottom-0 left-[90%] w-3 h-3 bg-indigo-400/30 rounded-full"
            style={{ transitionDelay: "0.4s" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NoRecordsFound;
