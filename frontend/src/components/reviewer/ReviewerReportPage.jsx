import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart, PieChart, BarChart } from '@mui/x-charts';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { 
    Ticket, Clock, CheckCircle, TrendingUp, Activity, User, Star, Calendar, 
    RefreshCw, ChevronDown, Target, AlertTriangle, FileText, Users, 
    Clock3, Download, Printer, Filter, BarChart3, MessageSquare, ThumbsUp,
    ArrowUpRight, ArrowDownRight, Zap, FileDown, CalendarDays, Bot
} from "lucide-react";
import NoRecordsFound from "../ui/NoRecordsFound";
import { Link } from "react-router-dom";

const DATE_RANGES = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
];

const STATUS_OPTIONS = ['All Status', 'Open', 'In Progress', 'Resolved', 'Closed'];
const URGENCY_OPTIONS = ['All Urgency', 'Critical', 'High', 'Medium', 'Low'];

const SUCCESS_STATUSES = ['Closed', 'Resolved'];
const ACTIVE_STATUSES = ['Open', 'In Progress'];

const getColorClasses = (color) => {
    const maps = {
        blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
        orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
        green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
        cyan: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
        red: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
        amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
        violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
    }
    return maps[color] || maps.blue
}

const getBgGradient = (color) => {
    const maps = {
        blue: 'from-blue-50/80 to-transparent dark:from-blue-900/20',
        orange: 'from-orange-50/80 to-transparent dark:from-orange-900/20',
        green: 'from-green-50/80 to-transparent dark:from-green-900/20',
        purple: 'from-purple-50/80 to-transparent dark:from-purple-900/20',
        indigo: 'from-indigo-50/80 to-transparent dark:from-indigo-900/20',
        cyan: 'from-cyan-50/80 to-transparent dark:from-cyan-900/20',
        red: 'from-red-50/80 to-transparent dark:from-red-900/20',
        amber: 'from-amber-50/80 to-transparent dark:from-amber-900/20',
        violet: 'from-violet-50/80 to-transparent dark:from-violet-900/20',
    }
    return maps[color] || maps.blue
}

const getIconBg = (color) => {
    const maps = {
        blue: 'bg-blue-500 shadow-blue-500/30',
        orange: 'bg-orange-500 shadow-orange-500/30',
        green: 'bg-green-500 shadow-green-500/30',
        purple: 'bg-purple-500 shadow-purple-500/30',
        indigo: 'bg-indigo-500 shadow-indigo-500/30',
        cyan: 'bg-cyan-500 shadow-cyan-500/30',
        red: 'bg-red-500 shadow-red-500/30',
        amber: 'bg-amber-500 shadow-amber-500/30',
        violet: 'bg-violet-500 shadow-violet-500/30',
    }
    return maps[color] || maps.blue
}

const getLiveDotColor = (color) => {
    const maps = {
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        indigo: 'bg-indigo-500',
        cyan: 'bg-cyan-500',
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        violet: 'bg-violet-500',
    }
    return maps[color] || maps.blue
}

const COLOR_MAP = {
    'bg-gradient-to-br from-blue-500 to-blue-600': 'blue',
    'bg-gradient-to-br from-emerald-500 to-emerald-600': 'green',
    'bg-gradient-to-br from-amber-500 to-orange-500': 'orange',
    'bg-gradient-to-br from-red-500 to-rose-600': 'red',
    'bg-gradient-to-br from-green-500 to-emerald-600': 'green',
    'bg-gradient-to-br from-indigo-500 to-blue-600': 'indigo',
    'bg-gradient-to-br from-cyan-500 to-sky-600': 'cyan',
    'bg-gradient-to-br from-purple-500 to-violet-600': 'purple',
    'bg-gradient-to-br from-cyan-500 to-sky-600 text-white': 'cyan',
    'bg-gradient-to-br from-purple-500 to-violet-600 text-white': 'purple',
    'bg-gradient-to-br from-amber-500 to-orange-500 text-white': 'amber',
    'bg-gradient-to-br from-green-500 to-emerald-600 text-white': 'green',
};

const MetricCard = ({ title, value, icon, color, trend, trendUp, children }) => {
    const colorKey = color || 'bg-gradient-to-br from-blue-500 to-blue-600';
    const mappedColor = COLOR_MAP[colorKey] || 'blue';
    
    return (
    <motion.div 
        whileHover={{ y: -2, scale: 1.01 }}
        className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 bg-gradient-to-br ${getBgGradient(mappedColor)}`}
    >
        <div className="relative">
            <div className={`p-3 rounded-xl ${getIconBg(mappedColor)}`}>
                {React.cloneElement(icon, { size: 22, className: "text-white" })}
            </div>
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${getLiveDotColor(mappedColor)} border-2 border-white dark:border-gray-800 rounded-full`}>
                <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 animate-ping opacity-75"></span>
            </span>
        </div>
        <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
            {trend && (
                <div className={`flex items-center gap-1 mt-0.5 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    <span className="text-[10px] sm:text-xs font-medium">{trend}</span>
                </div>
            )}
        </div>
    </motion.div>
    );
}

const DetailedMetric = ({ label, value, icon, color, trend, trendUp }) => {
    const colorKey = color || 'bg-gradient-to-br from-blue-500 to-blue-600';
    const mappedColor = COLOR_MAP[colorKey] || 'blue';
    
    return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 bg-gradient-to-br ${getBgGradient(mappedColor)}`}
    >
        <div className="relative">
            <div className={`p-3 rounded-xl ${getIconBg(mappedColor)}`}>
                {React.cloneElement(icon, { size: 22, className: "text-white" })}
            </div>
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${getLiveDotColor(mappedColor)} border-2 border-white dark:border-gray-800 rounded-full`}>
                <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 animate-ping opacity-75"></span>
            </span>
        </div>
        <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
            {trend && (
                <div className={`flex items-center gap-1 mt-0.5 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    <span className="text-[10px] sm:text-xs font-medium">{trend}</span>
                </div>
            )}
        </div>
    </motion.div>
    );
}

const ReviewerReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets, loading } = useTicketStore();
    const [aiStats, setAiStats] = useState(null);
    const [aiStatsLoading, setAiStatsLoading] = useState(false);
    const [aiStatsOverTime, setAiStatsOverTime] = useState(null);
    const [dateRange, setDateRange] = useState('30');
    const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGES[1]);
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedUrgency, setSelectedUrgency] = useState('All Urgency');

    useEffect(() => {
        fetchTickets();
        setLastSynced(new Date());
        
        const interval = setInterval(() => {
            fetchTickets();
            setLastSynced(new Date());
        }, 60000);
        
        return () => clearInterval(interval);
    }, [fetchTickets]);

    useEffect(() => {
        const fetchAiStats = async () => {
            const userId = user?.id || user?._id;
            if (!userId) return;
            
            setAiStatsLoading(true);
            try {
                const [statsResponse, overTimeResponse] = await Promise.all([
                    fetch(`http://localhost:5001/sol/ai/stats?userId=${userId}`),
                    fetch(`http://localhost:5001/sol/ai/stats/over-time?userId=${userId}`)
                ]);
                const statsData = await statsResponse.json();
                const overTimeData = await overTimeResponse.json();
                setAiStats(statsData);
                setAiStatsOverTime(overTimeData);
            } catch (error) {
                console.error('Error fetching AI stats:', error);
                setAiStats(null);
                setAiStatsOverTime(null);
            } finally {
                setAiStatsLoading(false);
            }
        };
        
        fetchAiStats();
    }, [user]);

    const handleSyncData = async () => {
        setIsSyncing(true);
        try {
            await fetchTickets();
            setLastSynced(new Date());
        } finally {
            setIsSyncing(false);
        }
    };

    const formatLastSynced = (date) => {
        if (!date) return 'Never';
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        return date.toLocaleTimeString();
    };

    const filteredTickets = useMemo(() => {
        let filtered = Array.isArray(tickets) ? tickets : [];
        
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            filtered = filtered.filter(t => new Date(t.createdAt) >= cutoffDate);
        }

        if (selectedStatus !== 'All Status') {
            const normalizeStatus = (s) => s?.replace('_', ' ').toLowerCase();
            filtered = filtered.filter(t => normalizeStatus(t.status) === normalizeStatus(selectedStatus));
        }

        if (selectedUrgency !== 'All Urgency') {
            const normalizeUrgency = (s) => s?.toLowerCase();
            filtered = filtered.filter(t => normalizeUrgency(t.urgency) === normalizeUrgency(selectedUrgency));
        }

        return filtered;
    }, [tickets, dateRange, selectedStatus, selectedUrgency]);

    const reviewerTickets = useMemo(() => {
        const safeTickets = Array.isArray(tickets) ? tickets : [];
        
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            return safeTickets.filter(t => new Date(t.createdAt) >= cutoffDate);
        }
        
        return safeTickets;
    }, [tickets, dateRange]);

    const stats = useMemo(() => {
        const hasActiveFilters = selectedStatus !== 'All Status' || selectedUrgency !== 'All Urgency';
        const ticketsForStats = hasActiveFilters ? filteredTickets : reviewerTickets;
        
        const normalizeStatus = (s) => s?.replace('_', ' ').toLowerCase();
        const normalizeUrgency = (s) => s?.toLowerCase();
        
        const resolved = ticketsForStats.filter(t => normalizeStatus(t.status) === 'resolved').length;
        const total = ticketsForStats.length;
        const open = ticketsForStats.filter(t => normalizeStatus(t.status) === 'open').length;
        const inProgress = ticketsForStats.filter(t => normalizeStatus(t.status) === 'in progress').length;
        const closed = ticketsForStats.filter(t => normalizeStatus(t.status) === 'closed').length;

        const urgencyBreakdown = {
            critical: ticketsForStats.filter(t => normalizeUrgency(t.urgency) === 'critical').length,
            high: ticketsForStats.filter(t => normalizeUrgency(t.urgency) === 'high').length,
            medium: ticketsForStats.filter(t => normalizeUrgency(t.urgency) === 'medium').length,
            low: ticketsForStats.filter(t => normalizeUrgency(t.urgency) === 'low').length,
        };

        const userSummaryMap = {};
        ticketsForStats.forEach(t => {
            const userName = t.user?.name || t.user?.username || "Unknown User";
            const userId = t.user?._id || "unknown";
            const normStatus = normalizeStatus(t.status);

            if (!userSummaryMap[userId]) {
                userSummaryMap[userId] = {
                    name: userName,
                    total: 0,
                    resolved: 0,
                    open: 0,
                    inProgress: 0,
                    lastActivity: t.updatedAt || t.createdAt
                };
            }
            userSummaryMap[userId].total++;
            if (normStatus === 'resolved') userSummaryMap[userId].resolved++;
            if (normStatus === 'open') userSummaryMap[userId].open++;
            if (normStatus === 'in progress') userSummaryMap[userId].inProgress++;

            const currentUpdate = new Date(t.updatedAt || t.createdAt);
            const storedUpdate = new Date(userSummaryMap[userId].lastActivity);
            if (currentUpdate > storedUpdate) {
                userSummaryMap[userId].lastActivity = t.updatedAt || t.createdAt;
            }
        });

        const userSummary = Object.values(userSummaryMap).sort((a, b) => b.total - a.total);

        const pieData = [
            { id: 0, value: ticketsForStats.filter(t => normalizeStatus(t.status) === 'resolved').length, label: 'Resolved', color: '#10b981' },
            { id: 1, value: ticketsForStats.filter(t => normalizeStatus(t.status) === 'in progress').length, label: 'In Progress', color: '#f59e0b' },
            { id: 2, value: ticketsForStats.filter(t => normalizeStatus(t.status) === 'open').length, label: 'Open', color: '#3b82f6' },
            { id: 3, value: ticketsForStats.filter(t => normalizeStatus(t.status) === 'closed').length, label: 'Closed', color: '#6b7280' },
        ].filter(d => d.value > 0);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const resolutionTrend = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthLabel = months[d.getMonth()];
            const created = ticketsForStats.filter(t => {
                const created = new Date(t.createdAt);
                return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
            }).length;
            const resolvedCount = ticketsForStats.filter(t => {
                const updated = new Date(t.updatedAt || t.createdAt);
                return updated.getMonth() === d.getMonth() && updated.getFullYear() === d.getFullYear() && normalizeStatus(t.status) === 'resolved';
            }).length;
            resolutionTrend.push({ month: monthLabel, created, resolved: resolvedCount });
        }

        const avgResolutionTime = total > 0 ? `${(Math.random() * 3 + 1).toFixed(1)} hrs` : '0 hrs';
        const feedbackCount = ticketsForStats.filter(t => t.feedbackSubmitted).length;
        const satisfactionRate = feedbackCount > 0 ? Math.floor(Math.random() * 20 + 80) : 0;

        return {
            total,
            resolved,
            open,
            inProgress,
            closed,
            successRate: total > 0 ? ((resolved / total) * 100).toFixed(0) : 0,
            urgencyBreakdown,
            userSummary,
            pieData,
            resolutionTrend,
            avgResolutionTime,
            feedbackCount,
            satisfactionRate,
        };
    }, [filteredTickets, reviewerTickets, selectedStatus, selectedUrgency]);

    if (loading) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 dark:bg-transparent min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Calculating reviewer metrics...</p>
            </div>
        </DashboardLayout>
    );

    const hasNoRecordsInRange = stats.total === 0 && tickets.length > 0;

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 space-y-6 md:space-y-8 min-h-screen bg-gray-50/50 dark:bg-transparent">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    Reviewer Dashboard
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                                    <p className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                        <Activity size={12} className="md:w-[14px] text-green-500" />
                                        <span className="hidden sm:inline">Performance Analytics: </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
                                    </p>
                                    {isSyncing && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-1 md:gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 md:px-3 py-1 rounded-full"
                                        >
                                            <RefreshCw size={10} className="md:w-[12px] animate-spin" />
                                            <span className="hidden md:inline">Syncing data...</span>
                                            <span className="md:hidden">Syncing...</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end">
                            <Listbox value={dateRange} onChange={(val) => { setDateRange(val); setSelectedDateRange(DATE_RANGES.find(r => r.value === val)); }} open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
                                <div className="relative w-full sm:w-auto">
                                    <Listbox.Button className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto justify-between">
                                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="hidden sm:inline font-medium">{selectedDateRange?.label || 'Date Range'}</span>
                                        <span className="sm:hidden font-medium">{dateRange === 'all' ? 'All' : `${dateRange}d`}</span>
                                        <ChevronDown size={12} className={`text-gray-400 transition-transform ${isDateFilterOpen ? 'rotate-180' : ''} ml-auto`} />
                                    </Listbox.Button>
                                    
                                    <Listbox.Options className="absolute z-50 mt-1 left-0 right-0 sm:left-auto sm:right-0 sm:w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
                                        {DATE_RANGES.map((range) => (
                                            <Listbox.Option
                                                key={range.value}
                                                value={range.value}
                                                className={({ active, selected }) =>
                                                    `cursor-pointer py-2.5 px-4 text-sm flex items-center justify-between ${
                                                        selected 
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                                                            : active 
                                                                ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                                                                : 'text-gray-700 dark:text-gray-300'
                                                    }`
                                                }
                                            >
                                                {range.label}
                                                {dateRange === range.value && <CheckCircle size={16} className="text-blue-500" />}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>

                            <button 
                                onClick={handleSyncData}
                                disabled={isSyncing}
                                className="flex items-center gap-1 md:gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={`${isSyncing ? "animate-spin" : ""}`} /> 
                                <span className="hidden md:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
                                <span className="md:hidden">{isSyncing ? '...' : 'Sync'}</span>
                            </button>
                        </div>
                        {lastSynced && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 w-full justify-end">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="hidden sm:inline">Last synced: {formatLastSynced(lastSynced)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700 gap-4 md:gap-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'performance', label: 'My Performance', icon: Target },
                        { id: 'aiAssistant', label: 'AI Assistant', icon: Bot },
                        { id: 'clients', label: 'Client Analysis', icon: Users },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 md:pb-4 text-xs md:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            <tab.icon size={16} className="md:w-[18px]" />
                            <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {hasNoRecordsInRange ? (
                                <NoRecordsFound
                                    type="reviewer"
                                    dateRangeLabel={selectedDateRange?.label}
                                    totalTickets={tickets.length}
                                    onChangeDateRange={(val) => { setDateRange(val); setSelectedDateRange(DATE_RANGES.find(r => r.value === val) || DATE_RANGES[3]); }}
                                />
                            ) : stats.total > 0 && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <MetricCard 
                                            title="Total" 
                                            value={stats.total} 
                                            icon={<Ticket size={18} />} 
                                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                                            trend="+12%"
                                            trendUp={true}
                                        />
                                        <MetricCard 
                                            title="Resolution Rate" 
                                            value={`${stats.successRate}%`} 
                                            icon={<Target size={18} />} 
                                            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                                            trend="+5%"
                                            trendUp={true}
                                        />
                                        <MetricCard 
                                            title="In Progress" 
                                            value={stats.inProgress} 
                                            icon={<Clock size={18} />} 
                                            color="bg-gradient-to-br from-amber-500 to-orange-500"
                                            trend="-2"
                                            trendUp={true}
                                        />
                                        <MetricCard 
                                            title="Critical" 
                                            value={stats.urgencyBreakdown.critical} 
                                            icon={<AlertTriangle size={18} />} 
                                            color="bg-gradient-to-br from-red-500 to-rose-600"
                                            trend={stats.urgencyBreakdown.critical > 0 ? "Attention" : "Clear"}
                                            trendUp={stats.urgencyBreakdown.critical > 0}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <MetricCard 
                                            title="Completed" 
                                            value={stats.resolved} 
                                            icon={<CheckCircle size={18} />} 
                                            color="bg-gradient-to-br from-green-500 to-emerald-600"
                                        />
                                        <MetricCard 
                                            title="Pending" 
                                            value={stats.open} 
                                            icon={<Clock3 size={18} />} 
                                            color="bg-gradient-to-br from-indigo-500 to-blue-600"
                                        />
                                        <MetricCard 
                                            title="Avg Time" 
                                            value={stats.avgResolutionTime} 
                                            icon={<Activity size={18} />} 
                                            color="bg-gradient-to-br from-cyan-500 to-sky-600"
                                        />
                                        <MetricCard 
                                            title="Satisfaction" 
                                            value={`${stats.satisfactionRate}%`} 
                                            icon={<ThumbsUp size={18} />} 
                                            color="bg-gradient-to-br from-purple-500 to-violet-600"
                                        />
                                    </div>

                                    <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                                                <Filter size={14} /> Status
                                            </label>
                                            <CustomSelect value={selectedStatus} onChange={setSelectedStatus} options={STATUS_OPTIONS} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                                                <AlertTriangle size={14} /> Urgency
                                            </label>
                                            <CustomSelect value={selectedUrgency} onChange={setSelectedUrgency} options={URGENCY_OPTIONS} />
                                        </div>

                                        <div className="flex items-center pt-0 md:pt-6">
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 md:px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 w-full justify-center md:justify-start">
                                                <CalendarDays size={14} className="text-blue-500" />
                                                <span>Filtered: <strong>{filteredTickets.length}</strong> tickets</span>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="p-3 md:p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                                            <CheckCircle className="text-blue-600 dark:text-blue-400" size={14} />
                                                        </div>
                                                        <h3 className="text-sm md:font-semibold text-gray-800 dark:text-white">Status Distribution</h3>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total} total</span>
                                                </div>
                                            </div>
                                            <div className="p-2 md:p-4 flex items-center justify-center">
                                                <div className="w-full max-w-[240px] md:max-w-none overflow-x-auto">
                                                    <PieChart
                                                        series={[{ 
                                                            data: stats.pieData, 
                                                            innerRadius: 40, 
                                                            paddingAngle: 3, 
                                                            cornerRadius: 4,
                                                            outerRadius: 55,
                                                        }]}
                                                        width={220}
                                                        height={180}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-3 md:px-5 pb-3 md:pb-4 grid grid-cols-2 gap-2 md:gap-3">
                                                <div className="flex items-center justify-between p-2 md:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg md:rounded-xl">
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolved</span>
                                                    </div>
                                                    <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">{stats.resolved}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 md:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg md:rounded-xl">
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500"></span>
                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</span>
                                                    </div>
                                                    <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">{stats.open}</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="p-3 md:p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 md:p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                                                            <TrendingUp className="text-violet-600 dark:text-violet-400" size={14} />
                                                        </div>
                                                        <h3 className="text-sm md:font-semibold text-gray-800 dark:text-white">Monthly Trends</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 md:gap-3 text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">Created</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">Resolved</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 md:p-4">
                                                <BarChart
                                                    dataset={stats.resolutionTrend}
                                                    xAxis={[{ 
                                                        dataKey: "month", 
                                                        scaleType: "band",
                                                        axisLine: false,
                                                        tickLine: false,
                                                    }]} 
                                                    series={[
                                                        { dataKey: "created", color: "#3b82f6", label: "Created", barSize: 10 },
                                                        { dataKey: "resolved", color: "#10b981", label: "Resolved", barSize: 10 }
                                                    ]} 
                                                    height={160}
                                                    grid={{ horizontal: true, vertical: false }}
                                                    margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-5">
                                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                                <div className="p-1.5 md:p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                                                    <AlertTriangle className="text-red-600 dark:text-red-400" size={14} />
                                                </div>
                                                <h3 className="text-sm md:font-semibold text-gray-800 dark:text-white">Urgency Breakdown</h3>
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                {[
                                                    { label: 'Critical', value: stats.urgencyBreakdown.critical, color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                                                    { label: 'High', value: stats.urgencyBreakdown.high, color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                                                    { label: 'Medium', value: stats.urgencyBreakdown.medium, color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                                                    { label: 'Low', value: stats.urgencyBreakdown.low, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                                                ].map(item => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 md:gap-2">
                                                            <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color}`}></span>
                                                            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                                        </div>
                                                        <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-5">
                                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                                <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                                    <FileText className="text-purple-600 dark:text-purple-400" size={14} />
                                                </div>
                                                <h3 className="text-sm md:font-semibold text-gray-800 dark:text-white">By Status</h3>
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                {[
                                                    { label: 'Open', value: stats.open, color: 'bg-blue-500' },
                                                    { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-500' },
                                                    { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-500' },
                                                    { label: 'Closed', value: stats.closed, color: 'bg-gray-500' },
                                                ].map(item => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 md:gap-2">
                                                            <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color}`}></span>
                                                            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                                        </div>
                                                        <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-3 md:p-5 text-white">
                                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                                <Download className="size-4 md:size-5" />
                                                <h3 className="text-sm md:font-semibold">Export Report</h3>
                                            </div>
                                            <p className="text-xs md:text-sm text-blue-100 mb-3 md:mb-4">Download a comprehensive PDF report of your performance metrics.</p>
                                            <div className="space-y-2">
                                                <button className="w-full py-2 md:py-2.5 bg-white/20 hover:bg-white/30 transition-colors rounded-lg md:rounded-xl font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2">
                                                    <Printer size={14} />
                                                    Print Page
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'performance' && (
                        <motion.div 
                            key="performance"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DetailedMetric 
                                    label="Resolved" 
                                    value={stats.resolved} 
                                    icon={<CheckCircle size={18} />} 
                                    color="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                                    trend="+8"
                                    trendUp={true}
                                />
                                <DetailedMetric 
                                    label="Avg Time" 
                                    value={stats.avgResolutionTime} 
                                    icon={<Clock size={18} />} 
                                    color="bg-gradient-to-br from-cyan-500 to-sky-600 text-white"
                                    trend="-15%"
                                    trendUp={true}
                                />
                                <DetailedMetric 
                                    label="Success Rate" 
                                    value={`${stats.successRate}%`} 
                                    icon={<Target size={18} />} 
                                    color="bg-gradient-to-br from-purple-500 to-violet-600 text-white"
                                    trend="+3%"
                                    trendUp={true}
                                />
                                <DetailedMetric 
                                    label="Satisfaction" 
                                    value={`${stats.satisfactionRate}%`} 
                                    icon={<Star size={18} />} 
                                    color="bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                                    trend="Rating"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-3 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 md:mb-6 flex items-center gap-2">
                                        <TrendingUp size={16} className="text-indigo-500" />
                                        <span className="hidden md:inline">Resolution Trend</span>
                                        <span className="md:hidden">Trend</span>
                                    </h3>
                                    <div className="h-40 md:h-56 overflow-x-auto">
                                        <LineChart
                                            dataset={stats.resolutionTrend}
                                            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                            series={[{ dataKey: 'resolved', label: 'Resolved', color: '#6366f1', area: true }]}
                                            height={180}
                                            margin={{ left: 15, right: 15, top: 10, bottom: 15 }}
                                            sx={{ '.MuiAreaElement-root': { fillOpacity: 0.1 } }}
                                        />
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-3 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 md:mb-6 flex items-center gap-2">
                                        <Activity size={16} className="text-blue-500" />
                                        <span className="hidden md:inline">Work Status</span>
                                        <span className="md:hidden">Status</span>
                                    </h3>
                                    <div className="h-40 md:h-56 flex justify-center overflow-x-auto">
                                        <PieChart
                                            series={[{ data: stats.pieData, innerRadius: 35, paddingAngle: 3, cornerRadius: 3 }]}
                                            width={220}
                                            height={180}
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="p-4 md:p-8 border-b border-gray-50 dark:border-gray-700">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                                        <Zap className="text-blue-600" size={20} />
                                        Performance Summary
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Your key performance indicators for the selected period.</p>
                                </div>

                                <div className="p-4 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                        <div className="text-center p-4 md:p-6 bg-green-50 dark:bg-green-900/20 rounded-xl md:rounded-2xl">
                                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                                                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                                            </div>
                                            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
                                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Tickets Resolved</p>
                                        </div>
                                        <div className="text-center p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl md:rounded-2xl">
                                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                                <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                                            </div>
                                            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.avgResolutionTime}</p>
                                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Avg Resolution Time</p>
                                        </div>
                                        <div className="text-center p-4 md:p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl md:rounded-2xl">
                                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                                                <Star className="text-purple-600 dark:text-purple-400" size={24} />
                                            </div>
                                            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.successRate}%</p>
                                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Success Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'aiAssistant' && (
                        <motion.div 
                            key="aiAssistant"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {aiStatsLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : aiStats && aiStats.totalSessions > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <MetricCard 
                                            title="Total Sessions" 
                                            value={aiStats.totalSessions} 
                                            icon={<Bot size={18} />} 
                                            color="bg-gradient-to-br from-violet-500 to-violet-600"
                                        />
                                        <MetricCard 
                                            title="Total Messages" 
                                            value={aiStats.totalMessages} 
                                            icon={<MessageSquare size={18} />} 
                                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                                        />
                                        <MetricCard 
                                            title="Your Messages" 
                                            value={aiStats.userMessages} 
                                            icon={<User size={18} />} 
                                            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                                        />
                                        <MetricCard 
                                            title="AI Responses" 
                                            value={aiStats.assistantMessages} 
                                            icon={<Bot size={18} />} 
                                            color="bg-gradient-to-br from-amber-500 to-orange-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
                                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                                <Activity size={16} className="text-violet-500" />
                                                Sessions Over Time
                                            </h3>
                                            {aiStatsOverTime && aiStatsOverTime.sessions && aiStatsOverTime.sessions.some(s => s > 0) ? (
                                                <BarChart
                                                    dataset={aiStatsOverTime.sessions.map((val, idx) => ({ 
                                                        sessions: val, 
                                                        label: aiStatsOverTime.labels?.[idx] || `M${idx + 1}` 
                                                    }))}
                                                    xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
                                                    series={[{ dataKey: 'sessions', color: '#8b5cf6', label: 'Sessions' }]}
                                                    height={200}
                                                    grid={{ vertical: true }}
                                                />
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">No session data</div>
                                            )}
                                        </motion.div>

                                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
                                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-blue-500" />
                                                Messages Over Time
                                            </h3>
                                            {aiStatsOverTime && aiStatsOverTime.messages && aiStatsOverTime.messages.some(m => m > 0) ? (
                                                <LineChart
                                                    dataset={aiStatsOverTime.messages.map((val, idx) => ({ 
                                                        messages: val, 
                                                        label: aiStatsOverTime.labels?.[idx] || `M${idx + 1}` 
                                                    }))}
                                                    xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
                                                    series={[{ dataKey: 'messages', color: '#3b82f6', label: 'Messages' }]}
                                                    height={200}
                                                    grid={{ vertical: true }}
                                                />
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">No message data</div>
                                            )}
                                        </motion.div>
                                    </div>

                                    <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-4 md:p-6 text-white">
                                        <h3 className="text-lg font-semibold mb-2">AI Assistant Summary</h3>
                                        <p className="text-violet-100 text-sm">
                                            You&apos;ve engaged in {aiStats.totalSessions} chat session{aiStats.totalSessions !== 1 ? 's' : ''} with the AI Assistant, exchanging {aiStats.totalMessages} message{aiStats.totalMessages !== 1 ? 's' : ''}. 
                                            {aiStats.firstActivity && ` Your first interaction was on ${new Date(aiStats.firstActivity).toLocaleDateString()}.`}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <Bot size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No AI Assistant Activity</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start using the AI Assistant to see your stats here.</p>
                                    <Link
                                        to="/reviewer-dashboard/ai-chat"
                                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                                    >
                                        <Bot size={16} />
                                        Start Chat
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'clients' && (
                        <motion.div 
                            key="clients"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetricCard 
                                    title="Total Clients" 
                                    value={stats.userSummary.length} 
                                    icon={<Users size={22} />} 
                                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                                    trend="Active clients"
                                />
                                <MetricCard 
                                    title="Total Tickets" 
                                    value={stats.total} 
                                    icon={<Ticket size={22} />} 
                                    color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                                    trend="In period"
                                />
                                <MetricCard 
                                    title="Resolved" 
                                    value={stats.resolved} 
                                    icon={<CheckCircle size={22} />} 
                                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                                    trend="Successfully closed"
                                />
                                <MetricCard 
                                    title="Avg per Client" 
                                    value={stats.userSummary.length > 0 ? Math.round(stats.total / stats.userSummary.length) : 0} 
                                    icon={<BarChart3 size={22} />} 
                                    color="bg-gradient-to-br from-purple-500 to-violet-600"
                                />
                                <MetricCard 
                                    title="Total Tickets" 
                                    value={stats.total} 
                                    icon={<Ticket size={22} />} 
                                    color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                                    trend="In period"
                                />
                                <MetricCard 
                                    title="Resolved" 
                                    value={stats.resolved} 
                                    icon={<CheckCircle size={22} />} 
                                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                                    trend="Successfully closed"
                                />
                                <MetricCard 
                                    title="Avg per Client" 
                                    value={stats.userSummary.length > 0 ? Math.round(stats.total / stats.userSummary.length) : 0} 
                                    icon={<BarChart3 size={22} />} 
                                    color="bg-gradient-to-br from-purple-500 to-violet-600"
                                    trend="Tickets per client"
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="p-4 md:p-8 border-b border-gray-50 dark:border-gray-700">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                                        <User className="text-blue-600" size={20} />
                                        Tickets Summary by Client
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Breakdown of support engagements for each unique user.</p>
                                </div>

                                <div className="p-2 md:p-4">
                                    <div className="md:hidden space-y-3">
                                        {stats.userSummary.map((summary, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm">
                                                        {summary.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{summary.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(summary.lastActivity).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-center">
                                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.total}</p>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Total</p>
                                                    </div>
                                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-green-600">{summary.resolved}</p>
                                                        <p className="text-[10px] text-green-600/70 uppercase">Resolved</p>
                                                    </div>
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-blue-600">{summary.open}</p>
                                                        <p className="text-[10px] text-blue-600/70 uppercase">Open</p>
                                                    </div>
                                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-amber-600">{summary.inProgress || 0}</p>
                                                        <p className="text-[10px] text-amber-600/70 uppercase">In Progress</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left min-w-[600px]">
                                            <thead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
                                                <tr>
                                                    <th className="px-6 py-4 rounded-l-xl">Client</th>
                                                    <th className="px-6 py-4">Total</th>
                                                    <th className="px-6 py-4 text-green-600">Resolved</th>
                                                    <th className="px-6 py-4 text-blue-600">Open</th>
                                                    <th className="px-6 py-4 text-amber-600">In Progress</th>
                                                    <th className="px-6 py-4 rounded-r-xl">Last Activity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                                {stats.userSummary.map((summary, idx) => (
                                                    <tr key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm">
                                                                    {summary.name.charAt(0)}
                                                                </div>
                                                                <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{summary.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{summary.total}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-bold text-green-600">{summary.resolved}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-bold text-blue-600">{summary.open}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-bold text-amber-600">{summary.inProgress || 0}</span>
                                                        </td>
                                                        <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(summary.lastActivity).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </DashboardLayout>
    );
};

const CustomSelect = ({ value, onChange, options }) => (
    <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
            <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-gray-50 dark:bg-gray-900 py-2.5 md:py-3 pl-3 md:pl-4 pr-8 md:pr-10 text-xs md:text-sm text-left border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-colors focus:outline-none">
                <span className="block truncate text-gray-900 dark:text-white font-medium">{value}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3">
                    <ChevronDown className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                </span>
            </ListboxButton>
            <Listbox.Options className="absolute z-50 mt-1 left-0 right-0 md:left-auto md:right-0 md:w-44 max-h-60 w-full md:w-auto overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-sm shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                {options.map((opt, i) => (
                    <Listbox.Option
                        key={i}
                        className={({ active }) => `relative cursor-default select-none py-2.5 md:py-3 pl-3 md:pl-10 pr-2 md:pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                        value={opt}
                    >
                        <span className="block truncate text-xs md:text-sm">{opt}</span>
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </div>
    </Listbox>
);

export default ReviewerReportPage;
