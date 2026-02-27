import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Listbox } from '@headlessui/react';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { 
    Clock, CheckCircle, TrendingUp, Activity, MessageCircle, Star, 
    AlertTriangle, Zap, RotateCcw, Users, BarChart3, ArrowUpDown, 
    Search, Filter, ChevronDown, ChevronUp, X, RefreshCw, Eye,
    ArrowRight, Target, Award, Flame, Sparkles, Timer, ThumbsUp, Phone, Gauge,
    Tickets
} from "lucide-react"; 
import { Link } from "react-router";
import NoReport from "../ui/NoReport";

const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"];
const SUCCESS_STATUSES = ['Closed', 'Resolved'];
const ACTIVE_STATUSES = ['Open', 'In Progress'];

const getDaysDifference = (startDate, endDate) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? diffDays : 0;
};

const formatTimeDisplay = (days) => {
    if (!days || days === 0) return '-';
    const totalHours = Math.round(days * 24);
    if (totalHours < 24) return `${totalHours}h`;
    return `${days.toFixed(1)}d`;
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

const calculateFeedbackAnalytics = (tickets) => {
    const ticketsWithFeedback = tickets.filter(t => t.comments && t.comments.length > 0);
    const totalFeedbackCount = tickets.reduce((sum, ticket) => sum + (ticket.comments?.length || 0), 0);
    const recentFeedback = tickets.filter(t => {
        const latestComment = t.comments?.[t.comments.length - 1];
        return latestComment && (new Date() - new Date(latestComment.createdAt)) / (1000 * 60 * 60 * 24) <= 7;
    }).length;
    
    return {
        ticketsWithFeedback: ticketsWithFeedback.length,
        totalFeedbackCount,
        recentFeedback,
        feedbackRate: tickets.length > 0 ? ((ticketsWithFeedback.length / tickets.length) * 100).toFixed(0) : '0'
    };
};

const getRecentFeedbackActivity = (tickets) => {
    const allFeedback = [];
    tickets.forEach(ticket => {
        if (ticket.comments && ticket.comments.length > 0) {
            ticket.comments.forEach((comment, index) => {
                allFeedback.push({
                    ...comment,
                    ticketId: ticket._id,
                    ticketSubject: ticket.subject,
                    commentIndex: index + 1
                });
            });
        }
    });
    
    return allFeedback
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
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
};

const calculateCriticalTickets = (tickets) => {
    return tickets.filter(t => t.urgency === 'High' || t.urgency === 'Critical').length;
};

const calculateAverageResponseTime = (tickets) => {
    const ticketsWithResponses = tickets.filter(t => t.comments && t.comments.length > 0);
    if (ticketsWithResponses.length === 0) return { value: 'N/A', hours: null };

    const totalResponseTimeMs = ticketsWithResponses.reduce((sum, ticket) => {
        const firstComment = ticket.comments[0];
        const createdDate = new Date(ticket.createdAt);
        const responseDate = new Date(firstComment.createdAt);
        return responseDate > createdDate ? sum + (responseDate - createdDate) : sum;
    }, 0);

    const avgHours = Math.round(totalResponseTimeMs / ticketsWithResponses.length / (1000 * 60 * 60));
    if (avgHours < 24) {
        return { value: `${avgHours}h`, hours: avgHours, isPositiveBetter: true };
    }
    const avgDays = (avgHours / 24).toFixed(1);
    return { value: `${avgDays}d`, hours: avgHours, isPositiveBetter: true };
};

const calculateFirstResponseRate = (tickets) => {
    const ticketsWithResponses = tickets.filter(t => t.comments && t.comments.length > 0);
    const rate = tickets.length > 0 ? ((ticketsWithResponses.length / tickets.length) * 100).toFixed(0) : 0;
    return { value: `${rate}%`, rate: parseFloat(rate), isPositiveBetter: true };
};

const calculateAutoResolved = (tickets) => {
    return tickets.filter(t => t.resolutionMethod === 'Auto' && (t.status === 'Resolved' || t.status === 'Closed')).length;
};

const calculateReopenedTickets = (tickets) => {
    return 0;
};

const calculateActiveDiscussions = (tickets) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return tickets.filter(t => {
        if (!t.comments || t.comments.length === 0) return false;
        const lastComment = t.comments[t.comments.length - 1];
        return new Date(lastComment.createdAt) >= sevenDaysAgo;
    }).length;
};

const calculateTicketsByStatus = (tickets) => {
    const statusCounts = { 'Open': 0, 'In Progress': 0, 'Resolved': 0, 'Closed': 0 };
    tickets.forEach(t => {
        if (statusCounts.hasOwnProperty(t.status)) {
            statusCounts[t.status]++;
        }
    });
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count })).filter(i => i.count > 0);
};

const calculateTicketsByUrgency = (tickets) => {
    const urgencyCounts = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
    tickets.forEach(t => {
        if (urgencyCounts.hasOwnProperty(t.urgency)) {
            urgencyCounts[t.urgency]++;
        }
    });
    return Object.entries(urgencyCounts).map(([urgency, count]) => ({ urgency, count })).filter(i => i.count > 0);
};

const calculateReviewerActivity = (tickets) => {
    const reviewerCounts = {};
    tickets.forEach(ticket => {
        if (ticket.comments) {
            ticket.comments.forEach(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        const reviewerName = reply.user?.name || reply.user?.username || 'Unknown';
                        reviewerCounts[reviewerName] = (reviewerCounts[reviewerName] || 0) + 1;
                    });
                }
            });
        }
    });
    return Object.entries(reviewerCounts).map(([name, count]) => ({ name, count }));
};

const calculateMonthlyTicketVolume = (tickets) => {
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
        return tickets.filter(t => {
            const d = new Date(t.createdAt);
            return d >= p.start && d <= p.end;
        }).length;
    });

    return { data, months: periods.map(p => p.label) };
};

const calculateResponseRateOverTime = (tickets) => {
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
        const monthTickets = tickets.filter(t => {
            const d = new Date(t.createdAt);
            return d >= p.start && d <= p.end;
        });
        if (monthTickets.length === 0) return null;
        const responded = monthTickets.filter(t => t.comments && t.comments.length > 0).length;
        return Math.round((responded / monthTickets.length) * 100);
    });

    return { data, months: periods.map(p => p.label) };
};

const calculateResolutionRateOverTime = (tickets) => {
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
        const monthTickets = tickets.filter(t => {
            const d = t.updatedAt ? new Date(t.updatedAt) : null;
            return d && d >= p.start && d <= p.end && SUCCESS_STATUSES.includes(t.status);
        });
        const totalInMonth = tickets.filter(t => {
            const d = new Date(t.createdAt);
            return d >= p.start && d <= p.end;
        });
        if (totalInMonth.length === 0) return null;
        return Math.round((monthTickets.length / totalInMonth.length) * 100);
    });

    return { data, months: periods.map(p => p.label) };
};

const calculateAvgResponseTimeOverTime = (tickets) => {
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
        const monthTickets = tickets.filter(t => {
            const d = new Date(t.createdAt);
            return d >= p.start && d <= p.end && t.comments && t.comments.length > 0;
        });
        if (monthTickets.length === 0) return null;
        const totalMs = monthTickets.reduce((sum, t) => {
            const created = new Date(t.createdAt);
            const responded = new Date(t.comments[0].createdAt);
            return sum + (responded - created);
        }, 0);
        return Math.round(totalMs / monthTickets.length / (1000 * 60 * 60));
    });

    return { data, months: periods.map(p => p.label) };
};

const calculateTicketsWithFirstResponse = (tickets) => {
    const withResponse = tickets.filter(t => t.comments && t.comments.length > 0).length;
    const withoutResponse = tickets.length - withResponse;
    return { withResponse, withoutResponse, total: tickets.length };
};

const hasChartData = (dataArray) => {
    return dataArray && dataArray.some(val => val !== null && val > 0);
};

const getChartColors = (isDark) => ({
    primary: isDark ? '#818cf8' : '#4f46e5',
    secondary: isDark ? '#34d399' : '#10b981',
    text: isDark ? '#9ca3af' : '#6b7280',
    grid: isDark ? '#374151' : '#e5e7eb',
    background: isDark ? '#1f2937' : '#ffffff',
});

const calculatePerTicketMetrics = (tickets) => {
    return tickets.map(ticket => {
        const createdDate = new Date(ticket.createdAt);
        const updatedDate = ticket.updatedAt ? new Date(ticket.updatedAt) : createdDate;
        const resolutionDays = getDaysDifference(createdDate, updatedDate);
        
        const firstResponse = ticket.comments && ticket.comments.length > 0 ? ticket.comments[0] : null;
        const responseTime = firstResponse ? getDaysDifference(createdDate, new Date(firstResponse.createdAt)) : null;

        let handledBy = 'Unassigned';
        if (ticket.comments) {
            ticket.comments.forEach(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    handledBy = comment.replies[0].user?.name || comment.replies[0].user?.username || 'Reviewer';
                }
            });
        }

        return {
            id: ticket._id,
            subject: ticket.subject,
            category: ticket.issueType,
            urgency: ticket.urgency,
            status: ticket.status,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            resolutionDays,
            responseTime,
            handledBy,
            location: ticket.location,
        };
    });
};

const calculateResolutionPerformance = (tickets) => {
    const resolvedTickets = tickets.filter(t => SUCCESS_STATUSES.includes(t.status) && t.createdAt && t.updatedAt);
    if (resolvedTickets.length === 0) {
        return { fastest: 'N/A', longest: 'N/A', avg: 'N/A', slaViolations: 0 };
    }

    const resolutionTimes = resolvedTickets.map(t => getDaysDifference(new Date(t.createdAt), new Date(t.updatedAt)));
    const fastest = Math.min(...resolutionTimes);
    const longest = Math.max(...resolutionTimes);
    const avg = (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(1);

    const slaViolations = resolvedTickets.filter(t => {
        const time = getDaysDifference(new Date(t.createdAt), new Date(t.updatedAt));
        return (t.urgency === 'High' || t.urgency === 'Critical') && time > 3;
    }).length;

    return { 
        fastest: `${fastest}d`, 
        longest: `${longest}d`, 
        avg: `${avg}d`, 
        slaViolations 
    };
};

const getColorClasses = (color) => {
  const maps = {
    blue: "from-blue-500/20 to-blue-600/10 text-blue-600 dark:text-blue-400",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-600 dark:text-orange-400",
    green: "from-green-500/20 to-green-600/10 text-green-600 dark:text-green-400",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400",
    indigo: "from-indigo-500/20 to-indigo-600/10 text-indigo-600 dark:text-indigo-400",
    pink: "from-pink-500/20 to-pink-600/10 text-pink-600 dark:text-pink-400",
    red: "from-red-500/20 to-red-600/10 text-red-600 dark:text-red-400",
    yellow: "from-yellow-500/20 to-yellow-600/10 text-yellow-600 dark:text-yellow-400",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-600 dark:text-cyan-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400",
    violet: "from-violet-500/20 to-violet-600/10 text-violet-600 dark:text-violet-400",
  };
  return maps[color] || maps.blue;
};

const getStatusColor = (status) => {
    const colors = {
        'Open': 'bg-blue-500',
        'In Progress': 'bg-yellow-500',
        'Resolved': 'bg-purple-500',
        'Closed': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
};

const getUrgencyColor = (urgency) => {
    const colors = {
        'Critical': 'bg-red-500',
        'High': 'bg-orange-500',
        'Medium': 'bg-yellow-500',
        'Low': 'bg-green-500',
    };
    return colors[urgency] || 'bg-gray-500';
};

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
            active 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
        {count !== undefined && (
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${active ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {count}
            </span>
        )}
    </button>
);

const StatCard = ({ label, value, icon: Icon, color, progress, subtitle }) => {
    const colorStyles = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-100 dark:ring-blue-900' },
        green: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-100 dark:ring-green-900' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-100 dark:ring-yellow-900' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-100 dark:ring-purple-900' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-900' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-100 dark:ring-cyan-900' },
    };
    const style = colorStyles[color] || colorStyles.blue;
    const isLongLabel = label.length > 12;
    
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg transition-shadow h-full"
        >
            <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-lg ${style.bg} bg-opacity-10 flex-shrink-0`}>
                    <Icon size={16} className={style.text} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-medium text-gray-500 dark:text-gray-400 ${isLongLabel ? 'text-[10px]' : 'text-xs'} leading-tight`}>{label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{value}</p>
                </div>
            </div>
            {(progress !== undefined || subtitle) && (
                <div className="mt-2 pl-0">
                    {progress !== undefined && (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${style.bg} rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-semibold ${style.text} flex-shrink-0`}>{progress}%</span>
                        </div>
                    )}
                    {subtitle && <p className="text-[10px] text-gray-400 mt-1 truncate">{subtitle}</p>}
                </div>
            )}
        </motion.div>
    );
};

const useSafeTheme = () => {
    try {
        const { theme } = require("../ui/theme-provider").useTheme();
        return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
};

const ClientReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets, loading, error } = useTicketStore(); 
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    useEffect(() => {
        fetchTickets("Client");
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        
        try {
            const { theme } = require("../ui/theme-provider").useTheme();
            const checkTheme = () => {
                const newTheme = localStorage.getItem('solease-ui-theme') || 'system';
                setIsDark(newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
            };
            checkTheme();
            window.addEventListener('storage', checkTheme);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
                window.removeEventListener('storage', checkTheme);
            };
        } catch (e) {
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [fetchTickets]);

    const [activeTab, setActiveTab] = useState('overview');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);
    const [columnsOpen, setColumnsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

    const availableColumns = [
        { key: 'subject', label: 'Ticket', default: true },
        { key: 'category', label: 'Category', default: true },
        { key: 'urgency', label: 'Urgency', default: true },
        { key: 'status', label: 'Status', default: true },
        { key: 'createdAt', label: 'Created', default: true },
        { key: 'resolutionDays', label: 'Time', default: true },
        // { key: 'handledBy', label: 'Handler', default: true },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        availableColumns.reduce((acc, col) => ({ ...acc, [col.key]: col.default }), {})
    );

    const toggleColumn = (key) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
        setColumnsOpen(false);
    };

    const STATUS_OPTIONS = [
        { value: 'all', label: 'All Status' },
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Closed', label: 'Closed' },
    ];

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];

    const clientTickets = useMemo(() => {
        if (!tickets) return [];
        const safeTickets = Array.isArray(tickets) ? tickets : [];
        return safeTickets.filter(t => (t.user?._id || t.user) === user._id);
    }, [tickets, user]);

    const stats = useMemo(() => ({
        total: clientTickets.length,
        resolved: clientTickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length,
        open: clientTickets.filter(t => t.status === 'Open').length,
        inProgress: clientTickets.filter(t => t.status === 'In Progress').length,
        avgRes: calculateAverageResolutionTime(clientTickets),
        sat: calculateUserSatisfaction(clientTickets),
        categories: calculateOpenTicketsByCategory(clientTickets),
        chart: calculateMonthlyResolutionTimeData(clientTickets),
        feedback: calculateFeedbackAnalytics(clientTickets),
        recentFeedback: getRecentFeedbackActivity(clientTickets),
        critical: calculateCriticalTickets(clientTickets),
        avgResponse: calculateAverageResponseTime(clientTickets),
        firstResponseRate: calculateFirstResponseRate(clientTickets),
        autoResolved: calculateAutoResolved(clientTickets),
        reopened: calculateReopenedTickets(clientTickets),
        activeDiscussions: calculateActiveDiscussions(clientTickets),
        byStatus: calculateTicketsByStatus(clientTickets),
        byUrgency: calculateTicketsByUrgency(clientTickets),
        reviewerActivity: calculateReviewerActivity(clientTickets),
        monthlyVolume: calculateMonthlyTicketVolume(clientTickets),
        ticketMetrics: calculatePerTicketMetrics(clientTickets),
        resolutionPerf: calculateResolutionPerformance(clientTickets),
        responseRateOverTime: calculateResponseRateOverTime(clientTickets),
        resolutionRateOverTime: calculateResolutionRateOverTime(clientTickets),
        avgResponseTimeOverTime: calculateAvgResponseTimeOverTime(clientTickets),
        firstResponseData: calculateTicketsWithFirstResponse(clientTickets),
    }), [clientTickets]);

    const filteredTickets = useMemo(() => {
        let filtered = [...stats.ticketMetrics];
        
        if (searchQuery) {
            filtered = filtered.filter(t => 
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.handledBy.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === statusFilter);
        }
        
        filtered.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];
            
            if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';
            
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        return filtered;
    }, [stats.ticketMetrics, searchQuery, statusFilter, sortConfig]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, itemsPerPage]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'tickets', label: 'My Tickets', icon: Tickets, count: stats.total },
        { id: 'performance', label: 'Performance', icon: Target },
        { id: 'activity', label: 'Activity', icon: Activity },
    ];

    return (
        <DashboardLayout>
            <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
                {clientTickets.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {user?.name ? `${user.name.split(' ')[0]}'s Dashboard` : "My Dashboard"}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                    <Sparkles size={14} className="text-yellow-500" />
                                    Track your IT support tickets and performance metrics
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-xl">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Data
                                </div>
                                <Link 
                                    to="/client-dashboard/all-tickets" 
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                                >
                                    <Eye size={16} />
                                    View All
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                            <RefreshCw className="absolute inset-0 m-auto text-blue-600 animate-spin" size={20} />
                        </div>
                        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <span className="font-bold">Error:</span> {error}
                    </div>
                ) : clientTickets.length === 0 ? (
                    <NoReport userName={user?.name?.split(' ')[0]} type="client" />
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                            {tabs.map(tab => (
                                <TabButton
                                    key={tab.id}
                                    active={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    icon={tab.icon}
                                    label={tab.label}
                                    count={tab.count}
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    {/* Main Stats Grid - Key Metrics */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                                        <StatCard label="Total Tickets" value={stats.total} icon={Tickets} color="blue" subtitle="All time" />
                                        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="green" progress={stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0} />
                                        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="yellow" />
                                        <StatCard label="Avg Resolution" value={stats.avgRes.value} icon={TrendingUp} color="purple" />
                                        <StatCard label="Satisfaction" value={stats.sat.value} icon={Star} color="indigo" progress={parseInt(stats.sat.value) || 0} />
                                        <StatCard label="Response Rate" value={stats.firstResponseRate.value} icon={Zap} color="cyan" progress={parseInt(stats.firstResponseRate.value) || 0} />
                                    </div>

                                    {/* Response Analytics Section */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500 rounded-xl">
                                                    <Gauge size={20} className="text-white sm:hidden" />
                                                    <Gauge size={24} className="text-white hidden sm:block" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg">Response Analytics</h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">How quickly the support team responds to your tickets</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                    <Timer size={16} className="text-blue-500 sm:hidden" />
                                                    <Timer size={18} className="text-blue-500 hidden sm:block" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</span>
                                                </div>
                                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.avgResponse.value}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                    <Phone size={16} className="text-green-500 sm:hidden" />
                                                    <Phone size={18} className="text-green-500 hidden sm:block" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</span>
                                                </div>
                                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.firstResponseRate.value}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                    <ThumbsUp size={16} className="text-purple-500 sm:hidden" />
                                                    <ThumbsUp size={18} className="text-purple-500 hidden sm:block" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Responded</span>
                                                </div>
                                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.firstResponseData.withResponse}/{stats.firstResponseData.total}</p>
                                            </div>
                                        </div>

                                        {/* Response Rate Over Time Chart */}
                                        {hasChartData(stats.responseRateOverTime.data) && (
                                            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base mb-3 sm:mb-4">Response Rate Over Time (%)</h4>
                                                <div style={{ height: '150px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.responseRateOverTime.data, 
                                                            color: isDark ? '#60a5fa' : '#3b82f6', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.responseRateOverTime.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={150}
                                                        margin={{ top: 10, bottom: 25, left: 30, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.15 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Resolution Trend */}
                                        {hasChartData(stats.chart.data) && (
                                            <motion.div 
                                                initial={{ x: -20 }} 
                                                animate={{ x: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <TrendingUp size={16} className="text-indigo-500 sm:w-5" />
                                                        <span className="hidden sm:inline">Resolution Time Trend</span>
                                                        <span className="sm:hidden">Resolution Trend</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">Avg days</span>
                                                </div>
                                                <div style={{ height: '160px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.chart.data, 
                                                            color: isDark ? '#818cf8' : '#6366f1', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.chart.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={160}
                                                        margin={{ top: 10, bottom: 25, left: 25, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.2 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Monthly Volume */}
                                        {hasChartData(stats.monthlyVolume.data) && (
                                            <motion.div 
                                                initial={{ x: 20 }} 
                                                animate={{ x: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <Flame size={16} className="text-orange-500 sm:w-5" />
                                                        <span className="hidden sm:inline">Ticket Volume</span>
                                                        <span className="sm:hidden">Volume</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">Monthly</span>
                                                </div>
                                                <div style={{ height: '160px' }}>
                                                    <LineChart
                                                        series={[{
                                                            data: stats.monthlyVolume.data,
                                                            color: isDark ? '#fb923c' : '#f97316',
                                                            area: true,
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.monthlyVolume.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={160}
                                                        margin={{ top: 10, bottom: 25, left: 25, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.15 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Resolution Rate Over Time */}
                                        {hasChartData(stats.resolutionRateOverTime.data) && (
                                            <motion.div 
                                                initial={{ x: -20 }} 
                                                animate={{ x: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <CheckCircle size={16} className="text-green-500 sm:w-5" />
                                                        <span className="hidden sm:inline">Resolution Rate</span>
                                                        <span className="sm:hidden">Res. Rate</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">% resolved</span>
                                                </div>
                                                <div style={{ height: '160px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.resolutionRateOverTime.data, 
                                                            color: isDark ? '#34d399' : '#10b981', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.resolutionRateOverTime.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={160}
                                                        margin={{ top: 10, bottom: 25, left: 30, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.15 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Average Response Time Over Time */}
                                        {hasChartData(stats.avgResponseTimeOverTime.data) && (
                                            <motion.div 
                                                initial={{ x: 20 }} 
                                                animate={{ x: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <Timer size={16} className="text-cyan-500 sm:w-5" />
                                                        <span className="hidden sm:inline">Response Time Trend</span>
                                                        <span className="sm:hidden">Response Time</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">Avg hours</span>
                                                </div>
                                                <div style={{ height: '160px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.avgResponseTimeOverTime.data, 
                                                            color: isDark ? '#22d3ee' : '#06b6d4', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.avgResponseTimeOverTime.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={160}
                                                        margin={{ top: 10, bottom: 25, left: 30, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.15 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Pie Charts - Only show if data exists */}
                                    {stats.byStatus.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                            {[
                                                { title: 'Tickets by Status', data: stats.byStatus, colors: isDark ? ['#60a5fa', '#fbbf24', '#34d399', '#a78bfa'] : ['#3b82f6', '#f59e0b', '#10b981', '#6366f1'] },
                                                { title: 'Tickets by Urgency', data: stats.byUrgency, colors: isDark ? ['#4ade80', '#facc15', '#fb923c', '#f87171'] : ['#22c55e', '#eab308', '#f97316', '#ef4444'] },
                                                { title: 'Support Team Activity', data: stats.reviewerActivity, colors: isDark ? ['#a78bfa', '#22d3ee', '#f472b6', '#2dd4bf'] : ['#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'] },
                                            ].map((chart, idx) => {
                                                const total = chart.data.reduce((sum, d) => sum + (d.count || 0), 0);
                                                return (
                                                <motion.div 
                                                    key={chart.title}
                                                    initial={{ y: 20 }}
                                                    animate={{ y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
                                                >
                                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base mb-2 sm:mb-4">{chart.title}</h3>
                                                    {chart.data.length > 0 ? (
                                                        <>
                                                            <div className="flex justify-center">
                                                                <div style={{ width: '100%', maxWidth: '200px', height: '150px' }}>
                                                                    <PieChart
                                                                        series={[{
                                                                            data: chart.data.map((d, i) => ({ 
                                                                                value: d.count || 0, 
                                                                                label: d.status || d.urgency || d.name,
                                                                                color: chart.colors[i % chart.colors.length]
                                                                            })),
                                                                            innerRadius: 45,
                                                                            outerRadius: 65,
                                                                            paddingAngle: 3,
                                                                        }]}
                                                                        width={200}
                                                                        height={150}
                                                                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-1.5 mt-3 px-2">
                                                                {chart.data.slice(0, 4).map((d, i) => {
                                                                    const value = d.count || 0;
                                                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                                                    const label = d.status || d.urgency || d.name;
                                                                    return (
                                                                        <div key={i} className="flex items-center justify-between text-xs">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: chart.colors[i % chart.colors.length] }}></span>
                                                                                <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-bold text-gray-900 dark:text-white">{value}</span>
                                                                                <span className="text-gray-400">({percentage}%)</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="h-[150px] flex items-center justify-center text-gray-400">No data</div>
                                                    )}
                                                </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TICKETS TAB */}
                            {activeTab === 'tickets' && (
                                <motion.div
                                    key="tickets"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {/* Search and Filter */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                        <div className="relative flex-1 min-w-0">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search tickets..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-8 py-2.5 sm:py-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Status Filter Listbox */}
                                            <div className="relative flex-1 sm:flex-none">
                                                <Listbox value={statusFilter} onChange={(val) => { setStatusFilter(val); setStatusFilterOpen(false); }} open={statusFilterOpen} onOpenChange={setStatusFilterOpen}>
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full sm:w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 sm:py-3 text-left focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                                            <span className="block truncate text-xs sm:text-sm">
                                                                {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || 'All'}
                                                            </span>
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${statusFilterOpen ? 'rotate-180' : ''}`} />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Listbox.Options className="absolute z-20 mt-1 w-full sm:w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-auto focus:outline-none">
                                                            {STATUS_OPTIONS.map((option) => (
                                                                <Listbox.Option
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    className={({ active }) =>
                                                                        `cursor-pointer select-none py-2 px-3 text-xs sm:text-sm ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`
                                                                    }
                                                                >
                                                                    {option.label}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </div>
                                                </Listbox>
                                            </div>

                                            {/* Column Visibility Listbox */}
                                            <div className="relative flex-1 sm:flex-none">
                                                <Listbox value={null} onChange={() => {}} open={columnsOpen} onOpenChange={setColumnsOpen}>
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 sm:py-3 text-left focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center gap-2">
                                                            <span className="block truncate text-xs sm:text-sm">
                                                                <span className="hidden sm:inline">{Object.values(visibleColumns).filter(Boolean).length} Columns</span>
                                                                <span className="sm:hidden">Columns</span>
                                                            </span>
                                                            <span className="sm:hidden absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${columnsOpen ? 'rotate-180' : ''}`} />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Listbox.Options className="absolute z-30 mt-1 right-0 w-40 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-auto focus:outline-none">
                                                            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex gap-2">
                                                                <button 
                                                                    onClick={() => { availableColumns.forEach(c => setVisibleColumns(prev => ({...prev, [c.key]: true}))); }}
                                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                                >
                                                                    Show All
                                                                </button>
                                                                <span className="text-gray-300">|</span>
                                                                <button 
                                                                    onClick={() => availableColumns.forEach(c => setVisibleColumns(prev => ({...prev, [c.key]: false})))}
                                                                    className="text-xs text-gray-500 hover:text-gray-600"
                                                                >
                                                                    Hide All
                                                                </button>
                                                            </div>
                                                            {availableColumns.map((col) => (
                                                                <Listbox.Option
                                                                    key={col.key}
                                                                    value={col.key}
                                                                    className={({ active }) =>
                                                                        `cursor-pointer select-none py-2 px-3 text-xs sm:text-sm flex items-center gap-3 ${active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`
                                                                    }
                                                                >
                                                                    <div 
                                                                        onClick={() => toggleColumn(col.key)}
                                                                        className="flex items-center gap-3 cursor-pointer w-full"
                                                                    >
                                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visibleColumns[col.key] ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                                            {visibleColumns[col.key] && <CheckCircle size={12} className="text-white" />}
                                                                        </div>
                                                                        <span className={visibleColumns[col.key] ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>{col.label}</span>
                                                                    </div>
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </div>
                                                </Listbox>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="lg:hidden space-y-3">
                                        {filteredTickets
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((ticket, idx) => (
                                                <motion.div
                                                    key={ticket.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
                                                >
                                                    <div 
                                                        className="p-3 sm:p-4 cursor-pointer"
                                                        onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className={`w-1 h-12 sm:h-14 rounded-full flex-shrink-0 ${getStatusColor(ticket.status)}`} />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ticket.subject}</p>
                                                                    <p className="text-xs text-gray-500 truncate">{ticket.location}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                                                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    ticket.status === 'Resolved' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                }`}>
                                                                    {ticket.status}
                                                                </span>
                                                                {visibleColumns.urgency && (
                                                                    <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                                        ticket.urgency === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                        ticket.urgency === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                        ticket.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                    }`}>
                                                                        <span className={`w-1 h-1 rounded-full ${getUrgencyColor(ticket.urgency)}`}></span>
                                                                        {ticket.urgency}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            {visibleColumns.category && (
                                                                <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                                    {ticket.category?.replace(' issue', '').replace(' Connectivity', '')}
                                                                </span>
                                                            )}
                                                            {visibleColumns.createdAt && (
                                                                <span className="text-[10px] text-gray-500">
                                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                            {visibleColumns.resolutionDays && (
                                                                <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 ml-auto">
                                                                    {formatTimeDisplay(ticket.resolutionDays)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                                    <tr>
                                                        {availableColumns.filter(col => visibleColumns[col.key]).map(col => (
                                                            <th 
                                                                key={col.key}
                                                                onClick={() => handleSort(col.key)}
                                                                className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    {col.label}
                                                                    <ArrowUpDown size={12} className={sortConfig.key === col.key ? 'text-blue-500' : 'text-gray-300'} />
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {filteredTickets
                                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                        .map((ticket, idx) => {
                                                            const visibleCols = availableColumns.filter(col => visibleColumns[col.key]);
                                                            return (
                                                            <motion.tr 
                                                                key={ticket.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: idx * 0.03 }}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                                                            >
                                                                {visibleCols.map(col => {
                                                                    if (col.key === 'subject') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className={`w-1 h-10 rounded-full ${getStatusColor(ticket.status)}`} />
                                                                                    <div>
                                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.subject}</p>
                                                                                        <p className="text-xs text-gray-500">{ticket.location}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'category') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                                                    {ticket.category?.replace(' issue', '').replace(' Connectivity', '')}
                                                                                </span>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'urgency') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <span className={`flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-full ${
                                                                                    ticket.urgency === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                                    ticket.urgency === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                                    ticket.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                                }`}>
                                                                                    <span className={`w-1.5 h-1.5 rounded-full ${getUrgencyColor(ticket.urgency)}`}></span>
                                                                                    {ticket.urgency}
                                                                                </span>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'status') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                                                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                                    ticket.status === 'Resolved' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                                }`}>
                                                                                    {ticket.status}
                                                                                </span>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'createdAt') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'resolutionDays') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                                                    {formatTimeDisplay(ticket.resolutionDays)}
                                                                                </span>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    if (col.key === 'handledBy') {
                                                                        return (
                                                                            <td key={col.key} className="px-4 py-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                                                        {ticket.handledBy.charAt(0)}
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-600 dark:text-gray-300">{ticket.handledBy}</span>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                            </motion.tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination Controls */}
                                    {filteredTickets.length > 0 && (
                                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4">
                                            {/* Items per page */}
                                            <div className="flex items-center gap-2 order-2 sm:order-1">
                                                <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">Show</span>
                                                <Listbox value={itemsPerPage} onChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }} open={itemsPerPageOpen} onOpenChange={setItemsPerPageOpen}>
                                                    <div className="relative">
                                                        <Listbox.Button className="relative cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-1.5 pl-3 pr-7 sm:pr-8 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                            <span className="block truncate">{itemsPerPage}</span>
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-2.5 pointer-events-none">
                                                                <ChevronDown size={12} className={`text-gray-400 transition-transform ${itemsPerPageOpen ? 'rotate-180' : ''}`} />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Listbox.Options className="absolute z-30 mt-1 w-16 sm:w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-auto">
                                                            {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                                                                <Listbox.Option
                                                                    key={num}
                                                                    value={num}
                                                                    className={({ active }) =>
                                                                        `cursor-pointer select-none py-2 px-2 sm:px-3 text-xs sm:text-sm text-center ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`
                                                                    }
                                                                >
                                                                    {num}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </div>
                                                </Listbox>
                                                <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 hidden sm:inline">per page</span>
                                            </div>

                                            {/* Page info and navigation */}
                                            <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                                                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                                    <span className="inline sm:hidden">{filteredTickets.length} items</span>
                                                    <span className="hidden sm:inline text-gray-800 dark:text-gray-200">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length}</span>
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                        className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        aria-label="Previous page"
                                                    >
                                                        <ChevronDown size={14} className="rotate-90" />
                                                    </button>
                                                    
                                                    {Array.from({ length: Math.ceil(filteredTickets.length / itemsPerPage) }, (_, i) => i + 1)
                                                        .filter((page, idx, arr) => {
                                                            const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
                                                            return idx === 0 || idx === arr.length - 1 || Math.abs(page - currentPage) <= 1 || (idx === 1 && currentPage > 3) || (idx === arr.length - 2 && currentPage < totalPages - 2);
                                                        })
                                                        .map((page, idx, arr) => {
                                                            const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                                                            return (
                                                                <React.Fragment key={page}>
                                                                    {showEllipsis && <span className="px-1 text-gray-400 text-xs">...</span>}
                                                                    <button
                                                                        onClick={() => setCurrentPage(page)}
                                                                        className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                                            currentPage === page
                                                                                ? 'bg-blue-600 text-white'
                                                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                        }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </React.Fragment>
                                                            );
                                                        })
                                                    }

                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredTickets.length / itemsPerPage), p + 1))}
                                                        disabled={currentPage >= Math.ceil(filteredTickets.length / itemsPerPage)}
                                                        className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        aria-label="Next page"
                                                    >
                                                        <ChevronDown size={14} className="-rotate-90" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* PERFORMANCE TAB */}
                            {activeTab === 'performance' && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    {/* Performance Overview Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-5 rounded-2xl border border-green-100 dark:border-green-800"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2 bg-green-500 rounded-lg">
                                                    <Zap size={18} className="text-white" />
                                                </div>
                                                <TrendingUp size={18} className="text-green-500" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.firstResponseRate.value}</p>
                                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mt-1">First Response Rate</p>
                                            <p className="text-[10px] text-green-600/70 dark:text-green-400/70 mt-0.5">Tickets with initial response</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-blue-800"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2 bg-blue-500 rounded-lg">
                                                    <Timer size={18} className="text-white" />
                                                </div>
                                                <Clock size={18} className="text-blue-500" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.avgResponse.value}</p>
                                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-1">Avg Response Time</p>
                                            <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">Time to first reply</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-purple-800"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2 bg-purple-500 rounded-lg">
                                                    <CheckCircle size={18} className="text-white" />
                                                </div>
                                                <Target size={18} className="text-purple-500" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.avgRes.value}</p>
                                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-1">Avg Resolution</p>
                                            <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70 mt-0.5">Time to close ticket</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 sm:p-5 rounded-2xl border border-orange-100 dark:border-orange-800"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2 bg-orange-500 rounded-lg">
                                                    <Star size={18} className="text-white" />
                                                </div>
                                                <Award size={18} className="text-orange-500" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.sat.value}</p>
                                            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mt-1">Satisfaction</p>
                                            <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 mt-0.5">Resolved tickets rate</p>
                                        </motion.div>
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Response Time Trend */}
                                        {hasChartData(stats.avgResponseTimeOverTime.data) && (
                                            <motion.div 
                                                initial={{ y: 20 }} 
                                                animate={{ y: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <Timer size={16} className="text-blue-500 sm:w-5" />
                                                        <span>Response Time Trend</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">Avg hours</span>
                                                </div>
                                                <div style={{ height: '180px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.avgResponseTimeOverTime.data, 
                                                            color: isDark ? '#3b82f6' : '#2563eb', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.avgResponseTimeOverTime.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={180}
                                                        margin={{ top: 10, bottom: 25, left: 35, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.2 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Resolution Rate Trend */}
                                        {hasChartData(stats.resolutionRateOverTime.data) && (
                                            <motion.div 
                                                initial={{ y: 20 }} 
                                                animate={{ y: 0 }}
                                                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                                        <CheckCircle size={16} className="text-green-500 sm:w-5" />
                                                        <span>Resolution Rate</span>
                                                    </h3>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">% resolved</span>
                                                </div>
                                                <div style={{ height: '180px' }}>
                                                    <LineChart 
                                                        series={[{ 
                                                            data: stats.resolutionRateOverTime.data, 
                                                            color: isDark ? '#22c55e' : '#16a34a', 
                                                            area: true, 
                                                            showMark: true,
                                                            curve: 'monotoneX'
                                                        }]}
                                                        xAxis={[{ 
                                                            scaleType: 'point', 
                                                            data: stats.resolutionRateOverTime.months,
                                                            tickLabelStyle: { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
                                                        }]}
                                                        height={180}
                                                        margin={{ top: 10, bottom: 25, left: 35, right: 10 }}
                                                        sx={{ 
                                                            '.MuiAreaElement-root': { fillOpacity: 0.2 },
                                                            '.MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                            '.MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#e5e7eb' },
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Category & Status Breakdown */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Open Tickets by Category */}
                                        {stats.categories.some(c => c.count > 0) && (
                                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm sm:text-base">
                                                    <BarChart3 size={16} className="text-purple-500 sm:w-5" />
                                                    Open Tickets by Category
                                                </h3>
                                                <div className="space-y-3">
                                                    {stats.categories.filter(c => c.count > 0).map((cat, idx) => {
                                                        const maxCount = Math.max(...stats.categories.map(c => c.count));
                                                        const percentage = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                                                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
                                                        return (
                                                            <div key={cat.type} className="space-y-1">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{cat.displayName}</span>
                                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{cat.count}</span>
                                                                </div>
                                                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                    <motion.div 
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percentage}%` }}
                                                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                                                        className={`h-full ${colors[idx % colors.length]} rounded-full`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tickets by Status */}
                                        {stats.byStatus.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm sm:text-base">
                                                    <Activity size={16} className="text-indigo-500 sm:w-5" />
                                                    Tickets by Status
                                                </h3>
                                                <div className="space-y-3">
                                                    {stats.byStatus.map((item, idx) => {
                                                        const total = stats.byStatus.reduce((sum, s) => sum + s.count, 0);
                                                        const percentage = total > 0 ? (item.count / total) * 100 : 0;
                                                        const statusColors = {
                                                            'Open': 'bg-blue-500',
                                                            'In Progress': 'bg-yellow-500',
                                                            'Resolved': 'bg-purple-500',
                                                            'Closed': 'bg-green-500'
                                                        };
                                                        return (
                                                            <div key={item.status} className="space-y-1">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
                                                                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{item.status}</span>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.count}</span>
                                                                </div>
                                                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                    <motion.div 
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percentage}%` }}
                                                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                                                        className={`h-full ${statusColors[item.status]} rounded-full`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Stats Summary */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm sm:text-base">
                                            <Gauge size={16} className="text-blue-500 sm:w-5" />
                                            Performance Summary
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Total Tickets</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">High Priority</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ACTIVITY TAB */}
                            {activeTab === 'activity' && (
                                <motion.div
                                    key="activity"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Activity Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: 'Tickets with Feedback', value: stats.feedback.ticketsWithFeedback, icon: MessageCircle, color: 'blue' },
                                            { label: 'Total Messages', value: stats.feedback.totalFeedbackCount, icon: Activity, color: 'green' },
                                            { label: 'Active Discussions', value: stats.activeDiscussions, icon: Users, color: 'purple' },
                                        ].map((stat, idx) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ y: 20 }}
                                                animate={{ y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4"
                                            >
                                                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                                    <stat.icon size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Recent Feedback */}
                                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                <MessageCircle size={20} className="text-blue-500" />
                                                Recent Activity
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {stats.recentFeedback.length > 0 ? stats.recentFeedback.map((feedback, idx) => (
                                                <motion.div 
                                                    key={`${feedback.ticketId}-${idx}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                            {feedback.user?.name?.charAt(0) || feedback.user?.username?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="font-semibold text-gray-800 dark:text-white">
                                                                    {feedback.user?.name || feedback.user?.username || 'Unknown'}
                                                                </span>
                                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                                                    {feedback.ticketSubject?.substring(0, 30)}...
                                                                </span>
                                                                {feedback.aiGenerated && (
                                                                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                                                                        AI
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                                                {feedback.content}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {new Date(feedback.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )) : (
                                                <div className="p-8 text-center text-gray-400">
                                                    <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                                                    <p>No recent activity</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Quick Actions Footer */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8"
                        >
                            <div className="p-5">
                                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 text-center">
                                    Quick Actions
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link 
                                        to="/client-dashboard/new-ticket"
                                        className="group relative flex flex-col items-center text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                                        <span className="relative flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm mb-2">
                                            <Tickets size={16} />
                                        </span>
                                        <span className="relative text-sm">New Ticket</span>
                                        <span className="relative text-[10px] opacity-70 mt-1">Submit a new support request</span>
                                    </Link>
                                    <Link 
                                        to="/client-dashboard/all-tickets"
                                        className="group relative flex flex-col items-center text-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                    >
                                        <span className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors mb-2">
                                            <Eye size={16} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </span>
                                        <span className="relative text-sm">View All Tickets</span>
                                        <span className="relative text-[10px] text-gray-400 mt-1">Browse your ticket history</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClientReportPage;
