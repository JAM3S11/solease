import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart, PieChart } from '@mui/x-charts';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { Ticket, Clock, CheckCircle, TrendingUp, Activity, User, Star, ArrowUpRight } from "lucide-react";

const SUCCESS_STATUSES = ['Closed', 'Resolved'];
const ACTIVE_STATUSES = ['Open', 'In Progress'];

const DetailedMetric = ({ label, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
    >
        <div className={cn("p-3 rounded-xl shadow-sm", color)}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
    </motion.div>
);

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ReviewerReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets, loading, error } = useTicketStore();

    useEffect(() => {
        // Fetch tickets - typically reviewers see all assigned, but we'll fetch all to get full history
        fetchTickets();
    }, [fetchTickets]);

    const reviewerTickets = useMemo(() => {
        const safeTickets = Array.isArray(tickets) ? tickets : [];
        // Filter logic for reviewer - ideally tickets assigned to them
        // For now, mirroring ReviewerAssignedTickets logic or including all for analytics
        return safeTickets;
    }, [tickets]);

    const stats = useMemo(() => {
        const resolved = reviewerTickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length;
        const total = reviewerTickets.length;

        // Group tickets by client user
        const userSummaryMap = {};
        reviewerTickets.forEach(t => {
            const userName = t.user?.name || t.user?.username || "Unknown User";
            const userId = t.user?._id || "unknown";

            if (!userSummaryMap[userId]) {
                userSummaryMap[userId] = {
                    name: userName,
                    total: 0,
                    resolved: 0,
                    open: 0,
                    lastActivity: t.updatedAt || t.createdAt
                };
            }
            userSummaryMap[userId].total++;
            if (SUCCESS_STATUSES.includes(t.status)) userSummaryMap[userId].resolved++;
            if (t.status === 'Open') userSummaryMap[userId].open++;

            const currentUpdate = new Date(t.updatedAt || t.createdAt);
            const storedUpdate = new Date(userSummaryMap[userId].lastActivity);
            if (currentUpdate > storedUpdate) {
                userSummaryMap[userId].lastActivity = t.updatedAt || t.createdAt;
            }
        });

        // Convert map to array for rendering
        const userSummary = Object.values(userSummaryMap).sort((a, b) => b.total - a.total);

        // Chart data logic (Status Distribution)
        const pieData = [
            { id: 0, value: reviewerTickets.filter(t => t.status === 'Resolved').length, label: 'Resolved', color: '#10b981' },
            { id: 1, value: reviewerTickets.filter(t => t.status === 'In Progress').length, label: 'In Progress', color: '#f59e0b' },
            { id: 2, value: reviewerTickets.filter(t => t.status === 'Open').length, label: 'Open', color: '#3b82f6' },
            { id: 3, value: reviewerTickets.filter(t => t.status === 'Closed').length, label: 'Closed', color: '#6b7280' },
        ].filter(d => d.value > 0);

        // Monthly trend (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const resolutionTrend = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthLabel = months[d.getMonth()];
            const count = reviewerTickets.filter(t => {
                const updated = new Date(t.updatedAt || t.createdAt);
                return updated.getMonth() === d.getMonth() && updated.getFullYear() === d.getFullYear() && SUCCESS_STATUSES.includes(t.status);
            }).length;
            resolutionTrend.push({ month: monthLabel, count });
        }

        return {
            total,
            resolved,
            open: reviewerTickets.filter(t => t.status === 'Open').length,
            inProgress: reviewerTickets.filter(t => t.status === 'In Progress').length,
            successRate: total > 0 ? ((resolved / total) * 100).toFixed(0) : 0,
            userSummary,
            pieData,
            resolutionTrend
        };
    }, [reviewerTickets]);

    if (loading) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 dark:bg-transparent min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Calculating reviewer metrics...</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <TrendingUp className="text-blue-600" size={32} />
                            Reviewer Insights
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Performance summary and user engagement data.</p>
                    </motion.div>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailedMetric label="Total Assigned" value={stats.total} icon={Ticket} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                    <DetailedMetric label="Completed" value={stats.resolved} icon={CheckCircle} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
                    <DetailedMetric label="In Progress" value={stats.inProgress} icon={Clock} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
                    <DetailedMetric label="Success Rate" value={`${stats.successRate}%`} icon={Star} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Status Distribution (Pie) */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-blue-500" />
                            Work Status Distribution
                        </h3>
                        <div className="h-64 flex justify-center">
                            <PieChart
                                series={[{ data: stats.pieData, innerRadius: 60, paddingAngle: 4, cornerRadius: 4 }]}
                                width={400}
                                height={250}
                            />
                        </div>
                    </motion.div>

                    {/* Resolution Trend (Line) */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-500" />
                            Resolution Trend (Last 6 Months)
                        </h3>
                        <div className="h-64">
                            <LineChart
                                dataset={stats.resolutionTrend}
                                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                series={[{ dataKey: 'count', label: 'Tickets Resolved', color: '#6366f1', area: true }]}
                                height={250}
                                margin={{ left: 30, right: 30, top: 20, bottom: 30 }}
                                sx={{ '.MuiAreaElement-root': { fillOpacity: 0.1 } }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* User Summary - The specific "summary being done in the system based on each user" */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <User className="text-blue-600" size={24} />
                            Tickets Summary by Client
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Breakdown of support engagements for each unique user.</p>
                    </div>

                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Client Name</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4 text-green-600">Resolved</th>
                                    <th className="px-6 py-4 text-blue-600">Open</th>
                                    <th className="px-6 py-4 rounded-r-xl">Last Interaction</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                {stats.userSummary.map((summary) => (
                                    <tr key={summary.userId} className="group hover:bg-gray-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                                                    {summary.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{summary.name}</span>
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
                                        <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(summary.lastActivity).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </div>
        </DashboardLayout>
    );
};

export default ReviewerReportPage;
