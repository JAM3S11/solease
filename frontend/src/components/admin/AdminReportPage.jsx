import React, { useMemo, useState } from 'react';
import DashboardLayout from '../ui/DashboardLayout';
import useTicketStore from "../../store/ticketStore";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { 
  CheckCircle, Clock, BarChart3, AlertCircle, 
  Calendar, ArrowUpRight, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import { ChevronDown, Filter, FileDown } from 'lucide-react';

const departments = ["All Departments", "Network Connectivity", "Hardware issue", "Software issue"];
const reportTypes = ["Monthly Resolution", "Issue Distribution", "SLA Status"];

const AdminReportPage = () => {
  const { tickets } = useTicketStore();
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedType, setSelectedType] = useState(reportTypes[0]);

  // Comprehensive Data Memoization for real-time filtering
  const stats = useMemo(() => {
    const filtered = selectedDept === "All Departments" 
      ? tickets 
      : tickets.filter(t => t.issueType === selectedDept);

    return {
      total: filtered.length,
      resolved: filtered.filter(t => t.status === 'Resolved').length,
      pending: filtered.filter(t => t.status === 'Open').length,
      critical: filtered.filter(t => t.urgency === 'Critical').length,
      // Mapping for MUI Pie Chart
      pieData: [
        { id: 0, value: filtered.filter(t => t.status === 'Resolved').length, label: 'Resolved', color: '#1173d4' },
        { id: 1, value: filtered.filter(t => t.status === 'Open').length, label: 'Pending', color: '#fbbf24' },
      ],
      // Mapping for MUI Bar Chart (Resolution per month mockup based on real data)
      barData: [
        { month: 'Oct', count: filtered.filter(t => t.oldest?.includes('/10/')).length },
        { month: 'Nov', count: filtered.filter(t => t.oldest?.includes('/11/')).length },
        { month: 'Dec', count: filtered.filter(t => t.oldest?.includes('/12/')).length },
      ]
    };
  }, [tickets, selectedDept]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 min-h-screen">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="text-primary w-8 h-8" />
              Performance Analytics
            </h1>
            <p className="text-gray-500 mt-1">Real-time oversight of SolEase ticket resolution metrics.</p>
          </motion.div>
          
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <FileDown size={18} /> Export PDF
          </button>
        </div>

        {/* Report Filters - Headless UI Listbox */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
              <Filter size={14} /> Filter Department
            </label>
            <CustomSelect value={selectedDept} onChange={setSelectedDept} options={departments} />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
              <Inbox size={14} /> Report Category
            </label>
            <CustomSelect value={selectedType} onChange={setSelectedType} options={reportTypes} />
          </div>

          <div className="flex items-center pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <Calendar size={16} className="text-primary" />
              <span>Period: <strong>Last 90 Days</strong></span>
            </div>
          </div>
        </section>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Tickets" value={stats.total} icon={<Inbox />} color="bg-blue-500" />
          <MetricCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="bg-green-500" />
          <MetricCard title="Pending" value={stats.pending} icon={<Clock />} color="bg-amber-500" />
          <MetricCard title="Critical" value={stats.critical} icon={<AlertCircle />} color="bg-red-500" />
        </div>

        {/* Visual Analytics with MUI X-Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Resolution Distribution <ArrowUpRight size={16} className="text-gray-400" />
            </h3>
            <div className="h-72 flex justify-center">
              <PieChart
                series={[{ data: stats.pieData, innerRadius: 80, paddingAngle: 5, cornerRadius: 5 }]}
                width={400}
                height={250}
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Monthly Growth <ArrowUpRight size={16} className="text-gray-400" />
            </h3>
            <div className="h-72">
              <BarChart
                dataset={stats.barData}
                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                series={[{ dataKey: 'count', label: 'Tickets', color: '#1173d4' }]}
                width={500}
                height={300}
                borderRadius={8}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// Internal Components for Clean Code
const CustomSelect = ({ value, onChange, options }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative mt-1">
      <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-gray-50 py-3 pl-4 pr-10 text-left border border-gray-200 hover:border-primary/50 transition-colors focus:outline-none">
        <span className="block truncate text-gray-700 font-medium">{value}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </ListboxButton>
      <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((opt, i) => (
            <ListboxOption
              key={i}
              className={({ active }) => `relative cursor-default select-none py-3 pl-10 pr-4 ${active ? 'bg-blue-50 text-primary' : 'text-gray-900'}`}
              value={opt}
            >
              <span className="block truncate">{opt}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </div>
  </Listbox>
);

const MetricCard = ({ title, value, icon, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4"
  >
    <div className={`${color} p-3 rounded-lg text-white shadow-lg`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </motion.div>
);

export default AdminReportPage;