import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart } from '@mui/x-charts/LineChart';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { ArrowRight, Ticket, Clock, CheckCircle, TrendingUp, Activity } from "lucide-react"; 
import { Link } from "react-router-dom"; 

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

const PerformanceCard = ({ title, value, change, isPositiveBetter, icon: Icon, gradient }) => {
    const isPositive = change.includes('+');
    const colorClass = isPositive ? (isPositiveBetter ? 'text-emerald-300' : 'text-rose-300') : (isPositiveBetter ? 'text-rose-300' : 'text-emerald-300');

    return (
        <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className={`relative overflow-hidden p-6 rounded-3xl shadow-2xl border border-white/20 ${gradient} text-white flex-1 min-w-[280px]`}
        >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                        {Icon && <Icon size={24} />}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-black/20 ${colorClass}`}>
                        {change}
                    </span>
                </div>
                <h3 className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-4xl font-black tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
};

const ClientReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets } = useTicketStore(); 
    
    useEffect(() => { fetchTickets(); }, []);

    const clientTickets = useMemo(() => {
        if (!user || !tickets) return [];
        return tickets.filter(t => (t.user?._id || t.user) === user._id);
    }, [tickets, user]);

    const activeTickets = useMemo(() => {
        return clientTickets.filter(t => ACTIVE_STATUSES.includes(t.status))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [clientTickets]);

    const stats = {
        resolved: clientTickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length,
        open: clientTickets.filter(t => t.status === 'Open').length,
        avgRes: useMemo(() => calculateAverageResolutionTime(clientTickets), [clientTickets]),
        sat: useMemo(() => calculateUserSatisfaction(clientTickets), [clientTickets]),
        categories: useMemo(() => calculateOpenTicketsByCategory(clientTickets), [clientTickets]),
        chart: useMemo(() => calculateMonthlyResolutionTimeData(clientTickets), [clientTickets])
    };

    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {user?.name ? `${user.name.split(' ')[0]}'s Analytics` : "Report Overview"}
                        </h1>
                        <p className="text-gray-500 font-normal mt-2 text-sm">Personal IT performance and ticket lifecycle tracking.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-2xl">
                        <Activity size={16} /> Live Data Tracking
                    </div>
                </header>

                {/* KPI Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PerformanceCard title="Tickets Resolved" value={stats.resolved} change="+0%" isPositiveBetter={true} icon={CheckCircle} gradient="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600" />
                    <PerformanceCard title="Resolution Time" value={stats.avgRes.value} change="-10%" isPositiveBetter={false} icon={Clock} gradient="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600" />
                    <PerformanceCard title="Satisfaction" value={stats.sat.value} change="+0%" isPositiveBetter={true} icon={Ticket} gradient="bg-gradient-to-br from-green-400 via-green-500 to-green-600" />
                </section>

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

                {/* Table Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <TrendingUp className="text-blue-600" /> Active Tickets
                        </h2>
                        <Link to="/client-dashboard/all-tickets" className="text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors">View All History →</Link>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-50 dark:border-gray-700 overflow-hidden">
                        {activeTickets.length === 0 ? (
                            <div className="p-20 text-center font-medium text-gray-400">Everything is resolved! Check back later.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Reference</th>
                                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Issue Subject</th>
                                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Urgency</th>
                                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Created</th>
                                            <th className="p-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {activeTickets.map((t) => (
                                            <tr key={t._id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-all group">
                                                <td className="p-6 text-sm font-mono font-bold text-blue-600">#{t._id.slice(-6).toUpperCase()}</td>
                                                <td className="p-6 text-sm font-bold text-gray-700 dark:text-gray-200">{t.subject}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${t.status === "Open" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${t.urgency === "Critical" ? "bg-rose-100 text-rose-700" : t.urgency === "High" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                                                        {t.urgency}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                <td className="p-6 text-right">
                                                    <Link to={`/client-dashboard/all-tickets`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                        <ArrowRight size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </motion.div>
        </DashboardLayout>
    );
};

export default ClientReportPage;