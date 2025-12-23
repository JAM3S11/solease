import React, { useMemo } from 'react';
import DashboardLayout from '../ui/DashboardLayout';
import useTicketStore from "../../store/ticketStore";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { 
  CheckCircle, Clock, BarChart3, AlertCircle, 
  Calendar, ArrowUpRight, Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

const ItSupportReport = () => {
  const { tickets } = useTicketStore();

  // 1. Process Real Data for MUI Charts
  const stats = useMemo(() => {
    const total = tickets.length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const openCount = tickets.filter(t => t.status === 'Open').length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
    
    const critical = tickets.filter(t => t.urgency === 'Critical').length;
    const high = tickets.filter(t => t.urgency === 'High').length;
    const medium = tickets.filter(t => t.urgency === 'Medium').length;
    const low = tickets.filter(t => t.urgency === 'Low').length;

    const resolutionRate = total > 0 ? ((resolvedCount / total) * 100).toFixed(0) : 0;

    // Data for MUI PieChart
    const pieData = [
      { id: 0, value: critical, label: 'Critical', color: '#ef4444' },
      { id: 1, value: high, label: 'High', color: '#f97316' },
      { id: 2, value: medium, label: 'Medium', color: '#eab308' },
      { id: 3, value: low, label: 'Low', color: '#22c55e' },
    ].filter(item => item.value > 0);

    return { 
        total, 
        resolvedCount, 
        openCount, 
        inProgressCount, 
        critical, 
        resolutionRate, 
        pieData 
    };
  }, [tickets]);

  const MetricCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
          <Icon size={22} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div className="text-blue-500">
            <ArrowUpRight size={16} />
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
      <p className="text-xs text-gray-500 mt-1 font-bold">{subtext}</p>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Support Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Performance overview using MUI X-Charts</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300">
            <Calendar size={16} />
            <span>Real-time Sync</span>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Tickets" value={stats.total} subtext="Lifetime queue" icon={Inbox} colorClass="bg-blue-600" />
          <MetricCard title="Resolution" value={`${stats.resolutionRate}%`} subtext="Success index" icon={CheckCircle} colorClass="bg-green-500" />
          <MetricCard title="Open Tasks" value={stats.openCount} subtext="Pending action" icon={Clock} colorClass="bg-orange-500" />
          <MetricCard title="Urgent" value={stats.critical} subtext="Critical urgency" icon={AlertCircle} colorClass="bg-red-500" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MUI Pie Chart - Urgency */}
          <div className="bg-white dark:bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-6 self-start flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                Severity Analysis
            </h3>
            <div className="h-[300px] w-full flex justify-center">
              <PieChart
                series={[
                  {
                    data: stats.pieData,
                    innerRadius: 70,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 8,
                    cx: 150,
                  },
                ]}
                width={350}
                height={300}
                slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      padding: 0,
                      labelStyle: { fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }
                    },
                }}
              />
            </div>
          </div>

          {/* MUI Bar Chart - Status Breakdown */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Queue Volume Breakdown
            </h3>
            <div className="h-[350px] w-full">
              <BarChart
                xAxis={[{ 
                    scaleType: 'band', 
                    data: ['Open', 'In Progress', 'Resolved'],
                    categoryGapRatio: 0.6
                }]}
                series={[{ 
                    data: [stats.openCount, stats.inProgressCount, stats.resolvedCount],
                    color: '#3b82f6',
                    label: 'Ticket Count'
                }]}
                height={350}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                borderRadius={10}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItSupportReport;