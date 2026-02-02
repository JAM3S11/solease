import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart } from '@mui/x-charts/LineChart';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { Ticket, Clock, CheckCircle, TrendingUp, Activity } from "lucide-react"; 
import { Link } from "react-router";

const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"];
const SUCCESS_STATUSES = ['Closed', 'Resolved'];
const ACTIVE_STATUSES = ['Open', 'In Progress'];

// --- Helper Functions ---
const getDaysDifference = (startDate, endDate) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? diffDays : 0;
};

const calculateAverageResolutionTime = (tickets) => {
    const closedTickets = tickets.filter(t => 
        t.status === 'Closed' && t.updatedAt && t.createdAt
    );
    if (closedTickets.length === 0) return { value: 'N/A', change: '0%', isPositiveBetter: false };

    const totalResolutionTimeMs = closedTickets.reduce((sum, ticket) => {
        const openDate = new Date(ticket.createdAt);
        const closeDate = new Date(ticket.updatedAt); 
        return closeDate > openDate ? sum + (closeDate - openDate) : sum;
    }, 0);

    const avgResolutionTimeDays = (totalResolutionTimeMs / closedTickets.length / (1000 * 60 * 60 * 24)).toFixed(1);
    return { value: `${avgResolutionTimeDays} Days`, change: '+0%', isPositiveBetter: false };
};

const calculateUserSatisfaction = (tickets) => {
    const totalTickets = tickets.length;
    const successfulTickets = tickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length;
    if (totalTickets === 0) return { value: 'N/A', change: '+0%', isPositiveBetter: true };
    const satisfactionRate = ((successfulTickets / totalTickets) * 100).toFixed(0);
    return { value: `${satisfactionRate}%`, change: '+0%', isPositiveBetter: true };
};

const calculateOpenTicketsByCategory = (tickets) => {
    const openTickets = tickets.filter(t => ACTIVE_STATUSES.includes(t.status));
    return ISSUE_TYPES.map(type => {
        const count = openTickets.filter(t => t.issueType === type).length;
        const displayName = type.replace(' issue', '').replace(' Connectivity', '');
        return { type, displayName, count };
    });
};

const calculateMonthlyResolutionTimeData = (tickets) => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const periods = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        periods.push({
            label: monthNames[date.getMonth()],
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
        });
    }

    const data = periods.map(p => {
        const closed = tickets.filter(t => {
            const d = t.updatedAt ? new Date(t.updatedAt) : null;
            return t.status === 'Closed' && d && d >= p.start && d <= p.end;
        });
        if (closed.length === 0) return null;
        const avg = closed.reduce((sum, t) => sum + getDaysDifference(new Date(t.createdAt), new Date(t.updatedAt)), 0) / closed.length;
        return parseFloat(avg.toFixed(1));
    });

    return { data, months: periods.map(p => p.label) };
}

const getColorClasses = (color) => {
  const maps = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  };
  return maps[color] || maps.blue;
};

const ClientReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets, loading, error } = useTicketStore(); 
    
    useEffect(() => { fetchTickets("Client"); }, [fetchTickets]);

    const clientTickets = useMemo(() => {
        if (!tickets) return [];
        const safeTickets = Array.isArray(tickets) ? tickets : [];
        return safeTickets.filter(t => (t.user?._id || t.user) === user._id);
    }, [tickets, user]);

    const stats = {
        total: clientTickets.length,
        resolved: clientTickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length,
        open: clientTickets.filter(t => t.status === 'Open').length,
        avgRes: useMemo(() => calculateAverageResolutionTime(clientTickets), [clientTickets]),
        sat: useMemo(() => calculateUserSatisfaction(clientTickets), [clientTickets]),
        categories: useMemo(() => calculateOpenTicketsByCategory(clientTickets), [clientTickets]),
        chart: useMemo(() => calculateMonthlyResolutionTimeData(clientTickets), [clientTickets]),
    };

return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {user?.name ? `${user.name.split(' ')[0]}'s Analytics` : "Report Overview"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Personal IT performance and ticket lifecycle tracking.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-2xl"
                    >
                        <Activity size={16} /> Live Data Tracking
                    </motion.div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 animate-pulse">Loading analytics data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                ) : clientTickets.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <TrendingUp size={32} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No Analytics Data Yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Start creating support tickets to see your performance analytics and insights here.
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: "Total Tickets", val: stats.total, icon: Ticket, color: "blue" },
                                { label: "Tickets Resolved", val: stats.resolved, icon: CheckCircle, color: "green" },
                                { label: "Pending Help", val: stats.open, icon: Clock, color: "orange" },
                                { label: "Resolution Time", val: stats.avgRes.value, icon: Clock, color: "purple" },
                                { label: "Satisfaction", val: stats.sat.value, icon: Ticket, color: "indigo" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
                                >
                                    <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.val}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Visual Trends Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Category Breakdown */}
                            <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Ticket Volume</h3>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">By Category</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-5xl font-bold text-blue-600">{stats.open}</p>
                                        <p className="text-xs font-bold text-gray-400">OPEN NOW</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    {stats.categories.map(cat => (
                                        <div key={cat.type} className="flex flex-col items-center text-center group">
                                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors">{cat.count}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase leading-tight">{cat.displayName}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Chart Card */}
                            <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-700">
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">Resolution Trend (6mo)</h3>
                                <div style={{ height: '220px', width: '100%' }}>
                                    <LineChart 
                                        series={[{ data: stats.chart.data, color: '#4f46e5', area: true, showMark: true }]}
                                        xAxis={[{ scaleType: 'point', data: stats.chart.months }]}
                                        height={220}
                                        margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
                                        sx={{ '.MuiAreaElement-root': { fillOpacity: 0.1 } }}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Navigation */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center mt-8"
                        >
                            <Link 
                                to="/client-dashboard/all-tickets" 
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all group"
                            >
                                View Full Ticket History
                                <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClientReportPage;