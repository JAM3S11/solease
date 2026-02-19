import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Ticket, AlertCircle, Calendar, Hash, User } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * DetailedTicketsView component
 * Renders a list of tickets in a detailed description list (dl/dt/dd) format.
 * Used when a category filter is active.
 */
const DetailedTicketsView = ({ tickets = [], role = "admin", onRowClick = () => { } }) => {
    if (tickets.length === 0) {
        return (
            <div className="py-20 text-center text-gray-400 italic bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                No tickets found in this category.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Category Detailed View</h4>
            </div>

            <AnimatePresence>
                <div className="grid grid-cols-1 gap-6">
                    {tickets.map((ticket, index) => (
                        <motion.div
                            key={ticket._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onRowClick(ticket)}
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer overflow-hidden"
                        >
                            {/* Background accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                                {/* Ticket ID */}
                                <div className="flex flex-col gap-1">
                                    <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        <Hash size={12} /> Ticket ID
                                    </dt>
                                    <dd className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                                        #{ticket._id.slice(-6).toUpperCase()}
                                    </dd>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col gap-1">
                                    <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        <ActivityIcon status={ticket.status} /> Status
                                    </dt>
                                    <dd className="flex items-center gap-2">
                                        <span className={cn("text-sm font-semibold", getStatusColor(ticket.status))}>
                                            {ticket.status}
                                        </span>
                                    </dd>
                                </div>

                                {/* Urgency */}
                                <div className="flex flex-col gap-1">
                                    <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        <AlertCircle size={12} className={getUrgencyColor(ticket.urgency)} /> Urgency
                                    </dt>
                                    <dd className="flex items-center gap-2">
                                        <span className={cn("text-xs font-bold uppercase tracking-tight px-2 py-0.5 rounded-md", getUrgencyBadgeColor(ticket.urgency))}>
                                            {ticket.urgency}
                                        </span>
                                    </dd>
                                </div>

                                {/* Subject - Multi-column */}
                                <div className="sm:col-span-2 flex flex-col gap-1">
                                    <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        <Ticket size={12} /> Subject
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                        {ticket.subject || "No subject provided"}
                                    </dd>
                                </div>

                                {/* Created At */}
                                <div className="flex flex-col gap-1">
                                    <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        <Calendar size={12} /> Creation Date
                                    </dt>
                                    <dd className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </dd>
                                </div>

                                {/* User Info (Conditional) */}
                                {role !== "client" && (
                                    <div className="flex flex-col gap-1">
                                        <dt className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            <User size={12} /> Reported By
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {ticket.user?.name || ticket.user?.username || "Unknown"}
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            {/* Action indicator */}
                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-end items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                See full details <ArrowRightIcon />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
};

// Helper components & logic
const ActivityIcon = ({ status }) => {
    if (status === "Resolved") return <CheckCircle size={12} className="text-green-500" />;
    if (status === "In Progress") return <Clock size={12} className="text-yellow-500" />;
    return <Clock size={12} className="text-blue-500" />;
};

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const getStatusColor = (status) => {
    const maps = {
        Open: "text-blue-600 dark:text-blue-400",
        "In Progress": "text-yellow-600 dark:text-yellow-400",
        Resolved: "text-green-600 dark:text-green-400",
        Closed: "text-gray-600 dark:text-gray-400",
    };
    return maps[status] || "text-gray-600";
};

const getUrgencyColor = (urgency) => {
    const maps = {
        Critical: "text-red-500",
        High: "text-orange-500",
        Medium: "text-yellow-500",
        Low: "text-green-500",
    };
    return maps[urgency] || "text-gray-500";
};

const getUrgencyBadgeColor = (urgency) => {
    const maps = {
        Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
        Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
        Low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    };
    return maps[urgency] || "bg-gray-100 text-gray-700";
};

export default DetailedTicketsView;
