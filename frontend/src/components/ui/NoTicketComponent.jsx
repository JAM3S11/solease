import React from "react";
import { useNavigate } from "react-router";
import { Plus, HelpCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const NoTicketComponent = ({ noTicket }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative flex flex-col items-center justify-center
        p-10 sm:p-14
        max-w-2xl mx-auto text-center
        rounded-3xl
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-xl
        border border-gray-200 dark:border-gray-700
        shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      "
    >
      {/* Icon badge */}
      <div
        className="
          mb-6 flex items-center justify-center
          w-16 h-16 rounded-2xl
          bg-gradient-to-br from-blue-500 to-indigo-600
          text-white shadow-lg
        "
      >
        <Zap size={28} />
      </div>

      {/* Heading */}
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No tickets yet{noTicket ? `, ${noTicket}` : ""} 👋
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        You haven’t raised any support tickets yet.  
        Once you do, you’ll be able to track progress and updates right here.
      </p>

      {/* Primary CTA */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate("/client-dashboard/new-ticket")}
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          bg-blue-600 hover:bg-blue-700
          text-white font-medium
          shadow-lg shadow-blue-600/30
          transition
        "
      >
        <Plus size={18} />
        Raise your first ticket
      </motion.button>

      {/* Secondary action */}
      <button
        className="
          mt-4 inline-flex items-center gap-2
          text-sm text-gray-500 dark:text-gray-400
          hover:text-blue-600 dark:hover:text-blue-400
          transition
        "
      >
        <HelpCircle size={16} />
        Learn how ticketing works
      </button>
    </motion.div>
  );
};

export default NoTicketComponent;