import React from "react";
import { Link } from "react-router";
import { 
    Calendar, 
    Inbox, 
    Clock, 
    AlertCircle,
    Search,
    Filter,
    ArrowRight,
    Sparkles,
    FileText,
    X
} from "lucide-react";
import { motion } from "framer-motion";

const QuickRangeButton = ({ range, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl text-center transition-all ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
    >
        <p className="text-xs font-medium">{range.days ? `${range.days}d` : 'All'}</p>
        <p className="text-[10px] opacity-80">{range.days ? 'days' : 'time'}</p>
    </button>
);

const FilterPill = ({ label, onRemove }) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
        <Filter size={12} />
        {label}
        {onRemove && (
            <button onClick={onRemove} className="ml-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5">
                <X size={12} />
            </button>
        )}
    </div>
);

const ActionButton = ({ onClick, children, variant = "primary", className = "" }) => {
    const baseClasses = "flex-1 px-4 py-2.5 rounded-xl font-medium transition-all";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl",
        secondary: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
        outline: "border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300"
    };
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const InfoBadge = ({ Icon, label, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        green: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    
    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${colors[color]}`}>
            <Icon size={12} />
            {label}
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

const NoRecordsFound = ({ 
    title = "No records found",
    message,
    dateRangeLabel, 
    onClearFilter, 
    onChangeDateRange,
    lastTicketDate,
    totalTickets,
    type = "client",
    customFilters = []
}) => {
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

    const getDateRangeDays = (label) => {
        if (label?.includes('7 Days')) return 7;
        if (label?.includes('30 Days')) return 30;
        if (label?.includes('90 Days')) return 90;
        return null;
    };

    const days = getDateRangeDays(dateRangeLabel);

    const formatLastDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const quickRanges = [
        { value: '7', label: 'Last 7 Days', days: 7 },
        { value: '30', label: 'Last 30 Days', days: 30 },
        { value: '90', label: 'Last 90 Days', days: 90 },
        { value: 'all', label: 'All Time', days: null },
    ];

    const typeConfig = {
        client: { 
            icon: Inbox, 
            label: 'tickets',
            createLink: "/client-dashboard/new-ticket",
            viewLink: "/client-dashboard/all-tickets",
            description: "You haven't created any tickets yet, or your current filters are too restrictive."
        },
        admin: { 
            icon: Inbox, 
            label: 'records',
            createLink: "/admin-dashboard/users",
            viewLink: "/admin-dashboard",
            description: "No records match your current search criteria. Try adjusting your filters."
        },
        reviewer: { 
            icon: Inbox, 
            label: 'assigned tickets',
            createLink: "/reviewer-dashboard/assigned-tickets",
            viewLink: "/reviewer-dashboard/all-tickets",
            description: "No tickets are currently assigned to you, or none match the selected filters."
        }
    };

    const config = typeConfig[type] || typeConfig.client;
    const Icon = config.icon;

    const defaultMessage = message || (
        totalTickets > 0 
            ? `You have ${totalTickets} ${config.label}, but none match the current filter. Try expanding your search or clearing filters.`
            : config.description
    );

    const hasActiveFilters = dateRangeLabel || (customFilters && customFilters.length > 0);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <div className="p-6">
                    {/* Icon and Title */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-6">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20" />
                            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                                <Icon size={36} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
                                <Search size={14} className="text-white" />
                            </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h2>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                            {defaultMessage}
                        </p>

                        {hasActiveFilters && (
                            <div className="flex flex-wrap justify-center gap-2 mt-3">
                                {dateRangeLabel && (
                                    <FilterPill 
                                        label={dateRangeLabel} 
                                        onRemove={onClearFilter} 
                                    />
                                )}
                                {customFilters?.map((filter, idx) => (
                                    <FilterPill 
                                        key={idx}
                                        label={filter} 
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Current Filter Info */}
                    {dateRangeLabel && (
                        <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Current filter</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{dateRangeLabel}</p>
                                    </div>
                                </div>
                                {days && (
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Range</p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{days}</p>
                                        <p className="text-xs text-gray-400">days</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Last Record Info */}
                    {lastTicketDate && (
                        <motion.div variants={itemVariants} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-5">
                            <Clock size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Last {config.label.replace(/s$/, '')} created</p>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                    {formatLastDate(lastTicketDate)}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Range Selector */}
                    {onChangeDateRange && (
                        <motion.div variants={itemVariants} className="mb-5">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
                                Try a different period
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {quickRanges.map((range) => (
                                    <QuickRangeButton
                                        key={range.value}
                                        range={range}
                                        isActive={dateRangeLabel === range.label}
                                        onClick={() => onChangeDateRange(range.value)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <motion.div variants={itemVariants} className="flex gap-3">
                        {onClearFilter && (
                            <ActionButton onClick={onClearFilter} variant="primary">
                                View All Records
                            </ActionButton>
                        )}
                        {onChangeDateRange && (
                            <ActionButton onClick={() => onChangeDateRange('all')} variant="secondary">
                                All Time
                            </ActionButton>
                        )}
                    </motion.div>

                    {/* Info Badges */}
                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mt-4">
                        <InfoBadge Icon={Search} label="Search Tips" color="blue" />
                        <InfoBadge Icon={Filter} label="Filter Results" color="green" />
                        <InfoBadge Icon={Clock} label="Any Time Range" color="amber" />
                    </motion.div>

                    {/* Tip */}
                    <motion.div variants={itemVariants} className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
                            <p>
                                <strong>Tip:</strong> Try expanding the date range, clearing filters, or using broader search terms to see more results.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Stats */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
                <StatBadge Icon={FileText} label="All Records" />
                <StatBadge Icon={Search} label="Smart Search" />
                <StatBadge Icon={Filter} label="Easy Filter" />
            </motion.div>
        </motion.div>
    );
};

export default NoRecordsFound;
