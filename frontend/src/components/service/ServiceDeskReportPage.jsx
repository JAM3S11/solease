import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Download, Filter, TrendingDown, Activity, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import { useAuthenticationStore } from '../../store/authStore';
import useTicketStore  from '../../store/ticketStore';

const ServiceDeskReportPage = () => {
  const { user } = useAuthenticationStore();
  const { tickets, fetchTickets, loading } = useTicketStore(); 

  // Fetched data on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // 2. Calculated Real-Time Metrics
  const stats = useMemo(() => {
    const total = tickets?.length || 0;
    const assigned = tickets?.filter(t => t.assignedTo === user?.name || t.assignedTo === 'Joy')?.length || 0;
    const pending = tickets?.filter(t => t.status?.toLowerCase() === 'open' || t.status?.toLowerCase() === 'pending')?.length || 0;
    const resolved = tickets?.filter(t => t.status?.toLowerCase() === 'resolved')?.length || 0;

    return { total, assigned, pending, resolved };
  }, [tickets, user]);

  // Fitted data into the chart
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return last7Days.map(day => ({
      day,
      count: tickets?.filter(t => new Date(t.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) === day).length || 0
    }));
  }, [tickets]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen"
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {user?.name}'s Live Reports
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Real-time database metrics for your dashboard</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 cursor-not-allowed">
            <Download size={16} /> Export Report
          </button>
        </header>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[2rem] text-white shadow-xl">
                <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Total Tickets</p>
                <h3 className="text-4xl font-black mt-1">{loading ? "..." : stats.total}</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-[2rem] text-white shadow-xl">
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Assigned to Me</p>
                <h3 className="text-4xl font-black mt-1">{loading ? "..." : stats.assigned}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 rounded-[2rem] text-white shadow-xl">
                <p className="text-purple-100 text-[10px] font-black uppercase tracking-widest">Awaiting Action</p>
                <h3 className="text-4xl font-black mt-1">{loading ? "..." : stats.pending}</h3>
            </div>
        </div>

        {/* Dynamic Chart */}
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-gray-900 dark:text-white text-lg font-black mb-6">Ticket Volume Trend (Last 7 Days)</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Live Table Section */}
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Tickets from Database</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Urgency</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                        {tickets?.slice(0, 5).map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-blue-600 text-sm">#{ticket._id?.slice(-6).toUpperCase()}</td>
                                <td className="px-6 py-4 font-medium text-gray-700 dark:text-slate-300 text-sm">{ticket.subject}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold ${ticket.urgency === 'Critical' ? 'text-rose-500' : 'text-orange-400'}`}>
                                        {ticket.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase">
                                        {ticket.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ServiceDeskReportPage;