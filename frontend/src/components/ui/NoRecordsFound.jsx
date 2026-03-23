import React from "react";
import { Calendar, Inbox, Clock, AlertCircle } from "lucide-react";

const NoRecordsFound = ({ 
    title = "No tickets found",
    message,
    dateRangeLabel, 
    onClearFilter, 
    onChangeDateRange,
    lastTicketDate,
    totalTickets,
    type = "client"
}) => {
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
        client: { icon: Inbox, label: 'tickets' },
        admin: { icon: Inbox, label: 'records' },
        reviewer: { icon: Inbox, label: 'assigned tickets' }
    };

    const config = typeConfig[type] || typeConfig.client;
    const Icon = config.icon;

    const defaultMessage = message || (
        totalTickets > 0 
            ? `You have ${totalTickets} ${config.label}, but none match this filter.`
            : `No ${config.label} found for this period.`
    );

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="relative mb-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                                <Icon size={32} className="text-gray-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Calendar size={14} className="text-white" />
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {title}
                        </h3>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                            {defaultMessage}
                        </p>
                    </div>

                    {/* Current Filter Info */}
                    {dateRangeLabel && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
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
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{days}</p>
                                        <p className="text-xs text-gray-400">days</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Last Ticket Info */}
                    {lastTicketDate && (
                        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                            <Clock size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Last {config.label.replace(/s$/, '')} created</p>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                    {formatLastDate(lastTicketDate)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Quick Range Selector */}
                    {onChangeDateRange && (
                        <div className="mb-6">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
                                Try a different period
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {quickRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => onChangeDateRange(range.value)}
                                        className={`p-3 rounded-xl text-center transition-all ${
                                            dateRangeLabel === range.label
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <p className="text-xs font-medium">{range.days ? `${range.days}d` : 'All'}</p>
                                        <p className="text-[10px] opacity-80">{range.days ? 'days' : 'time'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {onClearFilter && (
                            <button
                                onClick={onClearFilter}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                            >
                                View All
                            </button>
                        )}
                        {onChangeDateRange && (
                            <button
                                onClick={() => onChangeDateRange('all')}
                                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                            >
                                All Time
                            </button>
                        )}
                    </div>

                    {/* Tip */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                            <p>
                                Try expanding the date range or clearing filters to see more results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoRecordsFound;
