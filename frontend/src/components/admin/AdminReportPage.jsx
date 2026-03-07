import React, { useMemo, useState, useEffect, useRef } from 'react';
import DashboardLayout from '../ui/DashboardLayout';
import useTicketStore from "../../store/ticketStore";
import useAdminStore from "../../store/adminStore";
import { useAuthenticationStore } from "../../store/authStore";
import { useDarkMode } from "../../hooks/use-dark-mode";
import { PieChart, BarChart } from "@mui/x-charts";
import html2pdf from 'html2pdf.js';
import { 
  CheckCircle, Clock, BarChart3, AlertCircle, 
  Calendar, ArrowUpRight, Inbox, ClipboardX,
  Users, ShieldCheck, Activity, Cpu, Sparkles,
  Zap, Database, HardDrive, RefreshCw, TrendingUp,
  TrendingDown, AlertTriangle, Ticket, Target,
  ArrowRight, MapPin, FileText, MessageSquare,
  Star, ThumbsUp, Clock3, Filter, Download, ChevronDown, FileDown,
  Search, UserCheck, UserX, UserPlus, Mail, Building2, Eye, EyeOff,
  X, CalendarDays, Shield, AlertTriangle as AlertTri, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { NumberTicker } from "../ui/number-ticker";

const departments = ["All Departments", "Hardware issue", "Software issue",  "Network Connectivity", "Account Access"];
const reportTypes = ["All Types", "Open", "In Progress", "Resolved", "Closed"];

const AdminReportPage = () => {
  const { tickets, fetchTickets } = useTicketStore();
  const { users, fetchUsers, loading: usersLoading, activeUsers, fetchActiveUsers, activeUsersLoading, updateUserRoleAndStatus } = useAdminStore();
  const isDark = useDarkMode();
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'system', 'ai'
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ role: '', status: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  const handleSyncData = async () => {
    await Promise.all([
      fetchTickets(),
      fetchUsers(),
      fetchActiveUsers()
    ]);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const tabLabels = {
        overview: 'Overview',
        users: 'User Operations', 
        system: 'Infrastructure',
        ai: 'AI & MCP (Beta)'
      };

      const generateTabHTML = () => {
        let content = '';
        
        if (activeTab === 'overview') {
          content = `
            <div style="padding: 20px;">
              <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Key Metrics</h2>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Total Tickets</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.total}</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Resolution Rate</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.resolutionRate}%</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Pending</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.pending}</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">In Progress</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.inProgress}</div>
                </div>
              </div>
              <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Status Distribution</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Resolved</span><strong>${stats.resolved}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Pending</span><strong>${stats.pending}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>In Progress</span><strong>${stats.inProgress}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Closed</span><strong>${stats.closed}</strong></div>
              </div>
              <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Urgency Breakdown</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Critical</span><strong style="color: #dc2626;">${stats.urgencyBreakdown.critical}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>High</span><strong style="color: #ea580c;">${stats.urgencyBreakdown.high}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Medium</span><strong style="color: #ca8a04;">${stats.urgencyBreakdown.medium}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Low</span><strong style="color: #16a34a;">${stats.urgencyBreakdown.low}</strong></div>
              </div>
            </div>
          `;
        } else if (activeTab === 'users') {
          content = `
            <div style="padding: 20px;">
              <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">User Statistics</h2>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Total Users</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.users.total}</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Active Users</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.users.active}</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Verified</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.users.verified}</div>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                  <div style="font-size: 11px; color: #666;">Active Today</div>
                  <div style="font-size: 28px; font-weight: bold;">${stats.users.activeToday}</div>
                </div>
              </div>
              <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Role Distribution</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Managers</span><strong>${stats.users.roles.manager}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Reviewers</span><strong>${stats.users.roles.reviewer}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Clients</span><strong>${stats.users.roles.client}</strong></div>
              </div>
              <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Security Status</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Verified Users</span><strong>${stats.users.verified} / ${stats.users.total}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Active Accounts</span><strong>${stats.users.active} / ${stats.users.total}</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Rejected</span><strong>${stats.users.rejected}</strong></div>
              </div>
            </div>
          `;
        } else if (activeTab === 'system') {
          content = `
            <div style="padding: 20px;">
              <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Infrastructure Status</h2>
              <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 15px;">
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <div style="font-size: 14px; font-weight: bold;">Database Status</div>
                  <div style="font-size: 24px; font-weight: bold; color: #10b981;">Healthy</div>
                  <div style="font-size: 12px; color: #666;">4.2 GB / 10 GB (42% used)</div>
                </div>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <div style="font-size: 14px; font-weight: bold;">Storage Usage</div>
                  <div style="font-size: 24px; font-weight: bold; color: #10b981;">Optimal</div>
                  <div style="font-size: 12px; color: #666;">128 GB / 512 GB (25% used)</div>
                </div>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <div style="font-size: 14px; font-weight: bold;">API Latency</div>
                  <div style="font-size: 24px; font-weight: bold; color: #10b981;">Excellent</div>
                  <div style="font-size: 12px; color: #666;">48ms Average</div>
                </div>
              </div>
            </div>
          `;
        } else if (activeTab === 'ai') {
          content = `
            <div style="padding: 20px;">
              <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">AI & MCP Features</h2>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">MCP Status</div>
                <div style="font-size: 16px; color: #d97706; font-weight: bold;">STAGING_READY</div>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">AI Agent</div>
                <div style="font-size: 16px; color: #10b981; font-weight: bold;">READY_TO_DEPLOY</div>
              </div>
              <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Predicted Automation Impact</h2>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><span>Response Time Reduction</span><strong>~65%</strong></div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Auto-Categorization Accuracy</span><strong>~92%</strong></div>
              </div>
            </div>
          `;
        }
        
        return content;
      };

      const container = document.createElement('div');
      container.innerHTML = `
        <div style="width: 100%; padding: 30px; background: white; font-family: Arial, sans-serif;">
          <div style="border-bottom: 3px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1f2937;">SolEase - ${tabLabels[activeTab]}</h1>
            <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">Generated: ${new Date().toLocaleString()}</p>
          </div>
          ${generateTabHTML()}
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
            SolEase System Manager Dashboard
          </div>
        </div>
      `;

      const opt = {
        margin: 5,
        filename: `SolEase_${tabLabels[activeTab].replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const search = userSearch.toLowerCase();
    return users.filter(u => 
      u.name?.toLowerCase().includes(search) || 
      u.email?.toLowerCase().includes(search) ||
      u.role?.toLowerCase().includes(search)
    );
  }, [users, userSearch]);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchActiveUsers();
  }, [fetchTickets, fetchUsers, fetchActiveUsers]);

  // Comprehensive Data Memoization for real-time filtering
  const stats = useMemo(() => {
    let currentFilteredTickets = tickets;

    if (selectedDept !== "All Departments") {
      currentFilteredTickets = currentFilteredTickets.filter(t => t.issueType === selectedDept);
    }

    if (selectedType !== "All Types") {
      currentFilteredTickets = currentFilteredTickets.filter(t => t.status === selectedType);
    }

    // User stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const rejectedUsers = users.filter(u => u.status === 'Rejected').length;
    const verifiedUsers = users.filter(u => u.isVerified === true).length;
    const rolesDist = {
      manager: users.filter(u => u.role === 'Manager').length,
      reviewer: users.filter(u => u.role === 'Reviewer').length,
      client: users.filter(u => u.role === 'Client').length,
    };

    // User activity stats
    const live = new Date();
    const oneDayAgo = new Date(live.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(live.getTime() - 7 * 24 * 60 * 60 * 1000);
    const usersActiveToday = users.filter(u => u.lastLogin && new Date(u.lastLogin) >= oneDayAgo).length;
    const usersActiveThisWeek = users.filter(u => u.lastLogin && new Date(u.lastLogin) >= oneWeekAgo).length;

    // Urgency breakdown
    const urgencyBreakdown = {
      critical: currentFilteredTickets.filter(t => t.urgency === 'Critical').length,
      high: currentFilteredTickets.filter(t => t.urgency === 'High').length,
      medium: currentFilteredTickets.filter(t => t.urgency === 'Medium').length,
      low: currentFilteredTickets.filter(t => t.urgency === 'Low').length,
    };

    // Department breakdown
    const deptBreakdown = {};
    currentFilteredTickets.forEach(t => {
      const dept = t.issueType || 'General';
      deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
    });

    // Calculate resolution rate
    const resolved = currentFilteredTickets.filter(t => t.status === 'Resolved').length;
    const total = currentFilteredTickets.length;
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

    // Monthly trends (last 6 months)
    const monthlyData = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { created: 0, resolved: 0 };
    }
    
    currentFilteredTickets.forEach(t => {
      const createdDate = new Date(t.createdAt);
      const monthKey = createdDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].created += 1;
      }
      if (t.status === 'Resolved' && t.updatedAt) {
        const resolvedDate = new Date(t.updatedAt);
        const resolvedMonthKey = resolvedDate.toLocaleDateString('en-US', { month: 'short' });
        if (monthlyData[resolvedMonthKey]) {
          monthlyData[resolvedMonthKey].resolved += 1;
        }
      }
    });

    const barData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      created: data.created,
      resolved: data.resolved
    }));

    return {
      total: currentFilteredTickets.length,
      resolved: resolved,
      pending: currentFilteredTickets.filter(t => t.status === 'Open').length,
      inProgress: currentFilteredTickets.filter(t => t.status === 'In Progress').length,
      closed: currentFilteredTickets.filter(t => t.status === 'Closed').length,
      critical: urgencyBreakdown.critical,
      high: urgencyBreakdown.high,
      resolutionRate,
      users: {
        total: totalUsers,
        active: activeUsers,
        rejected: rejectedUsers,
        verified: verifiedUsers,
        roles: rolesDist,
        activeToday: usersActiveToday,
        activeThisWeek: usersActiveThisWeek,
      },
      urgencyBreakdown,
      deptBreakdown,
      // Mapping for MUI Pie Chart
      pieData: [
        { id: 0, value: resolved, label: 'Resolved', color: '#10b981' },
        { id: 1, value: currentFilteredTickets.filter(t => t.status === 'Open').length, label: 'Pending', color: '#f59e0b' },
        { id: 2, value: currentFilteredTickets.filter(t => t.status === 'In Progress').length, label: 'In Progress', color: '#3b82f6' },
        { id: 3, value: currentFilteredTickets.filter(t => t.status === 'Closed').length, label: 'Closed', color: '#6b7280' },
      ],
      userPieData: [
        { id: 0, value: rolesDist.manager, label: 'Managers', color: '#ef4444' },
        { id: 1, value: rolesDist.reviewer, label: 'Reviewers', color: '#8b5cf6' },
        { id: 2, value: rolesDist.client, label: 'Clients', color: '#6366f1' },
      ],
      barData,
      // Average resolution time (mock calculation based on data)
      avgResolutionTime: '2.4 hrs',
      // Feedback stats
      feedbackCount: currentFilteredTickets.filter(t => t.feedbackSubmitted).length,
    };
  }, [tickets, users, selectedDept, selectedType]);

  // Chart theme colors
  const chartTextColor = isDark ? '#e5e7eb' : '#374151';

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 min-h-screen bg-background/50 text-foreground transition-colors duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              {/* <div className="bg-primary/10 p-2 rounded-lg">
                <BarChart3 className="text-primary w-8 h-8" />
              </div> */}
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  System Manager Dashboard
                </h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <Activity size={14} className="text-green-500" />
                  SolEase System Status: <span className="text-green-600 dark:text-green-400 font-semibold">Healthy</span>
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSyncData}
              disabled={usersLoading}
              className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={18} className={usersLoading ? "animate-spin" : ""} /> Sync Data
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              <FileDown size={18} className={isExporting ? "animate-pulse" : ""} /> {isExporting ? 'Exporting...' : 'Export System Audit'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Operations', icon: Users },
            { id: 'system', label: 'Infrastructure', icon: Cpu },
            { id: 'ai', label: 'AI & MCP (Beta)', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div id="report-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              data-tab="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Dynamic Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Tickets" 
                  value={stats.total} 
                  icon={<Ticket />} 
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                  trend="+12% from last week"
                  trendUp={true}
                />
                <MetricCard 
                  title="Resolution Rate" 
                  value={`${stats.resolutionRate}%`} 
                  icon={<Target />} 
                  color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  trend="+5% improvement"
                  trendUp={true}
                />
                <MetricCard 
                  title="Pending Review" 
                  value={stats.pending} 
                  icon={<Clock />} 
                  color="bg-gradient-to-br from-amber-500 to-orange-500"
                  trend="-3 from yesterday"
                  trendUp={false}
                />
                <MetricCard 
                  title="Critical Issues" 
                  value={stats.critical} 
                  icon={<AlertTriangle />} 
                  color="bg-gradient-to-br from-red-500 to-rose-600"
                  trend={stats.critical > 0 ? "Requires attention" : "All clear"}
                  trendUp={stats.critical > 0}
                  critical={stats.critical > 0}
                />
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Active Now" 
                  value={activeUsers.length} 
                  icon={<Users />} 
                  color="bg-gradient-to-br from-purple-500 to-violet-600"
                  trend={activeUsersLoading ? "Loading..." : `${stats.users.total} total users`}
                >
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Live</span>
                  </div>
                </MetricCard>
                <MetricCard 
                  title="In Progress" 
                  value={stats.inProgress} 
                  icon={<Clock3 />} 
                  color="bg-gradient-to-br from-indigo-500 to-blue-600"
                  trend="Being handled"
                />
                <MetricCard 
                  title="Resolved" 
                  value={stats.resolved} 
                  icon={<CheckCircle />} 
                  color="bg-gradient-to-br from-green-500 to-emerald-600"
                  trend="This month"
                />
                <MetricCard 
                  title="Avg Resolution" 
                  value={stats.avgResolutionTime} 
                  icon={<Activity />} 
                  color="bg-gradient-to-br from-cyan-500 to-sky-600"
                  trend="Per ticket"
                />
              </div>

              {/* Quick Filters */}
              <section className="bg-card p-6 rounded-xl shadow-sm border border-border grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Filter size={14} /> Ticket Dept.
                  </label>
                  <CustomSelect value={selectedDept} onChange={setSelectedDept} options={departments} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Inbox size={14} /> Ticket Status
                  </label>
                  <CustomSelect value={selectedType} onChange={setSelectedType} options={reportTypes} />
                </div>

                <div className="flex items-center pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border border-border w-full">
                    <Calendar size={16} className="text-primary" />
                    <span>Real-time monitoring enabled for <strong>Today</strong></span>
                  </div>
                </div>
              </section>

              {/* Visual Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                          <CheckCircle className="text-blue-600 dark:text-blue-400" size={18} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Status Distribution</h3>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stats.total} total</span>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-center">
                    <PieChart
                      series={[{ 
                        data: stats.pieData, 
                        innerRadius: 60, 
                        paddingAngle: 4, 
                        cornerRadius: 6,
                        outerRadius: 90,
                      }]}
                      width={320}
                      height={220}
                      slotProps={{
                        legend: { 
                          labelStyle: { fill: chartTextColor, fontSize: 11 },
                          direction: 'row',
                          position: { vertical: 'bottom', horizontal: 'middle' },
                          padding: 15,
                        }
                      }}
                    />
                  </div>
                  {/* Quick Stats */}
                  <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolved</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{stats.resolved}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{stats.pending}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Monthly Trends */}
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                          <TrendingUp className="text-violet-600 dark:text-violet-400" size={18} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Monthly Trends</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span className="text-gray-500 dark:text-gray-400">Created</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-gray-500 dark:text-gray-400">Resolved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <BarChart
                      dataset={stats.barData}
                      xAxis={[{ 
                        dataKey: "month", 
                        scaleType: "band",
                        axisLine: false,
                        tickLine: false,
                      }]} 
                      series={[
                        { dataKey: "created", color: "#3b82f6", label: "Created", barSize: 16 },
                        { dataKey: "resolved", color: "#10b981", label: "Resolved", barSize: 16 }
                      ]} 
                      height={220}
                      grid={{ horizontal: true, vertical: false }}
                      margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Additional Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Urgency Breakdown */}
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <AlertTriangle className="text-red-600 dark:text-red-400" size={18} />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Urgency Breakdown</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Critical', value: stats.urgencyBreakdown.critical, color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                      { label: 'High', value: stats.urgencyBreakdown.high, color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                      { label: 'Medium', value: stats.urgencyBreakdown.medium, color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                      { label: 'Low', value: stats.urgencyBreakdown.low, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Department Breakdown */}
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <FileText className="text-purple-600 dark:text-purple-400" size={18} />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white">By Department</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.deptBreakdown).slice(0, 4).map(([dept, count], idx) => (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500'][idx]}`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{dept}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-5 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Download className="size-5" />
                    <h3 className="font-bold">Export Report</h3>
                  </div>
                  <p className="text-sm text-blue-100 mb-4">Download a comprehensive PDF report of all ticket analytics and user metrics.</p>
                  <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 transition-colors rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download PDF
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              data-tab="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* User Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Users" 
                  value={stats.users.total} 
                  icon={<Users />} 
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                  trend={`${stats.users.verified} verified`}
                />
                <MetricCard 
                  title="Active Users" 
                  value={stats.users.active} 
                  icon={<UserCheck />} 
                  color="bg-gradient-to-br from-green-500 to-emerald-600"
                  trend={`${stats.users.rejected} rejected`}
                >
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Live: {activeUsers.length}</span>
                  </div>
                </MetricCard>
                <MetricCard 
                  title="Active Today" 
                  value={stats.users.activeToday} 
                  icon={<Clock />} 
                  color="bg-gradient-to-br from-purple-500 to-violet-600"
                  trend={`${stats.users.activeThisWeek} this week`}
                />
                <MetricCard 
                  title="Verified" 
                  value={stats.users.verified} 
                  icon={<ShieldCheck />} 
                  color="bg-gradient-to-br from-amber-500 to-orange-500"
                  trend={`${((stats.users.verified / stats.users.total) * 100).toFixed(0)}% of total`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Distribution Chart */}
                <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
                  <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    User Role Distribution
                  </h3>
                  <div className="h-64 flex justify-center">
                    <PieChart
                      series={[{ data: stats.userPieData, innerRadius: 50, paddingAngle: 3, cornerRadius: 6, outerRadius: 80 }]}
                      width={400}
                      height={240}
                      slotProps={{
                        legend: { 
                          labelStyle: { fill: chartTextColor, fontSize: 12 },
                          direction: 'row',
                          position: { vertical: 'bottom', horizontal: 'middle' },
                          padding: 20,
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Quick Stats & Recent Activity */}
                <div className="space-y-4">
                  <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
                      <Activity size={14} /> User Activity
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <UserCheck className="text-green-500" size={16} />
                          <span className="text-sm text-muted-foreground">Active Today</span>
                        </div>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">{stats.users.activeToday}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Users className="text-blue-500" size={16} />
                          <span className="text-sm text-muted-foreground">Active This Week</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.users.activeThisWeek}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Mail className="text-purple-500" size={16} />
                          <span className="text-sm text-muted-foreground">Verified Emails</span>
                        </div>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.users.verified}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 p-5 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="text-primary w-6 h-6" />
                      <h4 className="font-bold text-foreground">User Security Status</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified Users</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{stats.users.verified} / {stats.users.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Accounts</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.users.active} / {stats.users.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rejected</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">{stats.users.rejected}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User List Table */}
              <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <UserPlus size={18} className="text-primary" />
                    All Users
                  </h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">User</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Role</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Verified</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Last Login</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.slice(0, 8).map((user) => (
                        <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Manager' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              user.role === 'Reviewer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`flex items-center gap-1.5 text-xs font-medium ${
                              user.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {user.isVerified ? (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <ShieldCheck size={14} /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <Clock size={14} /> Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-4">
                            <button 
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditMode(false);
                                setEditForm({ role: user.role, status: user.status });
                                setIsUserDialogOpen(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length > 8 && (
                  <div className="p-4 border-t border-border text-center">
                    <button className="text-sm text-primary font-medium hover:underline">
                      View all {filteredUsers.length} users →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div 
              key="system"
              data-tab="system"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <SystemCard title="Database Status" status="Healthy" icon={<Database />} color="text-blue-500" value="4.2 GB / 10 GB" load={42} />
              <SystemCard title="Storage Usage" status="Optimal" icon={<HardDrive />} color="text-purple-500" value="128 GB / 512 GB" load={25} />
              <SystemCard title="API Latency" status="Excellent" icon={<Zap />} color="text-amber-500" value="48ms Average" load={12} />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div 
              key="ai"
              data-tab="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-gray-900 to-primary p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                      <Sparkles size={14} className="text-amber-400" /> AI Features Incoming
                    </div>
                    <h2 className="text-4xl font-black leading-tight">Empower SolEase with Intelligence</h2>
                    <p className="text-gray-300 text-lg">
                      We're integrating AI to automate ticket classification, sentiment analysis, and smart replies.
                      Model Context Protocol (MCP) will soon allow seamless system introspection.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                        Join Beta Program
                      </button>
                      <button className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
                        View Roadmap
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="text-xs font-bold text-gray-400 mb-1">MCP STATUS</div>
                      <div className="flex items-center gap-2 text-amber-400">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-mono font-bold">STAGING_READY</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="text-xs font-bold text-gray-400 mb-1">AI AGENT</div>
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="font-mono font-bold">READY_TO_DEPLOY</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-3xl rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -ml-20 -mb-20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    Predicted Automation Impact
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">Response Time Reduction</span>
                        <span className="text-primary font-bold">~65%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">Auto-Categorization Accuracy</span>
                        <span className="text-green-500 font-bold">~92%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[92%]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                  <div className="bg-primary/5 p-4 rounded-full">
                    <Cpu className="text-primary w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">MCP Tooling</h3>
                    <p className="text-sm text-muted-foreground mt-1">Connect your local development environment directly to the SolEase management engine.</p>
                  </div>
                  <button className="text-primary font-bold text-sm hover:underline">
                    Read Documentation →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* User Detail Dialog */}
        <Dialog open={isUserDialogOpen} onClose={() => setIsUserDialogOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 p-6 border-b border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                      {selectedUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-foreground">
                        {selectedUser?.name}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser?.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedUser?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {selectedUser?.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsUserDialogOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Editable Fields - Only shown in edit mode */}
                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase font-medium">Role</span>
                      </div>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Manager">Manager</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Client">Client</option>
                      </select>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase font-medium">Status</span>
                      </div>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Active">Active</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase font-medium">Role</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser?.role === 'Manager' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        selectedUser?.role === 'Reviewer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {selectedUser?.role}
                      </span>
                    </div>

                    {/* Verification Status */}
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase font-medium">Verified</span>
                      </div>
                      {selectedUser?.isVerified ? (
                        <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-medium">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays size={16} />
                      <span className="text-sm">Joined</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span className="text-sm">Last Login</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {selectedUser?.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity size={16} />
                      <span className="text-sm">Online Status</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      {selectedUser?.isOnline ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-green-600 dark:text-green-400">Online</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          <span className="text-muted-foreground">Offline</span>
                        </>
                      )}
                    </span>
                  </div>

                  {selectedUser?.lastActivity && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertTri size={16} />
                        <span className="text-sm">Last Activity</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {new Date(selectedUser.lastActivity).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedUser?.approvedBy && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserCheck size={16} />
                        <span className="text-sm">Approved By</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {selectedUser.approvedBy.name || 'Admin'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border flex justify-between gap-2">
                <div>
                  {isEditMode && (
                    <button 
                      onClick={() => {
                        setIsEditMode(false);
                        setEditForm({ role: selectedUser?.role, status: selectedUser?.status });
                      }}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsUserDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                  {isEditMode ? (
                    <button 
                      onClick={async () => {
                        if (!selectedUser?.username) return;
                        setIsSaving(true);
                        try {
                          await updateUserRoleAndStatus(selectedUser.username, editForm.role, editForm.status);
                          await fetchUsers();
                          await fetchActiveUsers();
                          setSelectedUser({ ...selectedUser, role: editForm.role, status: editForm.status });
                          setIsEditMode(false);
                        } catch (error) {
                          console.error('Error updating user:', error);
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Edit User
                    </button>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

// Internal Components for Clean Code
const CustomSelect = ({ value, onChange, options }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative mt-1">
      <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-muted py-3 pl-4 pr-10 text-left border border-border hover:border-primary/50 transition-colors focus:outline-none">
        <span className="block truncate text-foreground font-medium">{value}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </span>
      </ListboxButton>
      <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-popover py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-border">
          {options.map((opt, i) => (
            <ListboxOption
              key={i}
              className={({ active }) => `relative cursor-default select-none py-3 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-popover-foreground'}`}
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

const MetricCard = ({ title, value, icon, color, trend, trendUp, critical, children }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
  >
    <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? <NumberTicker value={value} /> : value}
      </p>
      {children ? children : (
        trend && (
          <div className="flex items-center gap-1 mt-1">
            {critical ? (
              <span className="text-[10px] font-medium text-red-600 dark:text-red-400 flex items-center gap-0.5">
                <AlertCircle size={10} /> {trend}
              </span>
            ) : trendUp !== undefined ? (
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend}
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{trend}</span>
            )}
          </div>
        )
      )}
    </div>
  </motion.div>
);

const SystemCard = ({ title, status, icon, color, value, load }) => (
  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className={`${color} p-2 bg-muted rounded-lg`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
        {status}
      </span>
    </div>
    <div>
      <h4 className="font-bold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
        <span>LOAD</span>
        <span>{load}%</span>
      </div>
      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${load > 80 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${load}%` }} />
      </div>
    </div>
  </div>
);

export default AdminReportPage;