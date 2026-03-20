import React, { useMemo, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from '../ui/DashboardLayout'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Listbox } from '@headlessui/react';
import html2pdf from 'html2pdf.js';
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";
import { NumberTicker } from "../ui/number-ticker";
import { 
    Clock, CheckCircle, Check, TrendingUp, TrendingDown, Activity, MessageCircle, Star, 
    AlertTriangle, Zap, BarChart3, 
    Search, ChevronDown, X, RefreshCw, Eye,
    ArrowRight, ArrowUpDown, Target, Flame, Timer, ThumbsUp, Phone, Gauge,
    Tickets, FileDown, Ticket, Calendar, Send, User
} from "lucide-react"; 
import { Link } from "react-router";
import NoReport from "../ui/NoReport";
import NoRecordsFound from "../ui/NoRecordsFound";

const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"];
const SUCCESS_STATUSES = ['Closed', 'Resolved'];
const ACTIVE_STATUSES = ['Open', 'In Progress'];
const DATE_RANGES = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
];

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

const formatFullDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const calculateSLACompliance = (tickets) => {
    const urgentTickets = tickets.filter(t => t.urgency === 'Critical' || t.urgency === 'High');
    const resolvedUrgent = urgentTickets.filter(t => SUCCESS_STATUSES.includes(t.status));
    
    const onTime = resolvedUrgent.filter(t => {
        const resolutionTime = getDaysDifference(new Date(t.createdAt), new Date(t.updatedAt));
        return t.urgency === 'Critical' ? resolutionTime <= 1 : resolutionTime <= 3;
    }).length;

    return {
        total: urgentTickets.length,
        onTime,
        compliance: urgentTickets.length > 0 ? Math.round((onTime / urgentTickets.length) * 100) : 100
    };
};

const calculateTicketHealthScore = (tickets) => {
    if (tickets.length === 0) return 0;
    
    const resolvedRate = tickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length / tickets.length;
    const avgResponse = calculateAverageResponseTime(tickets).hours || 0;
    const responseScore = Math.max(0, 100 - (avgResponse * 5));
    
    return Math.round((resolvedRate * 50) + (responseScore * 0.5));
};

const calculateComparativeStats = (tickets, periodDays) => {
    const now = new Date();
    const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(periodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const currentPeriod = tickets.filter(t => new Date(t.createdAt) >= periodStart);
    const previousPeriod = tickets.filter(t => {
        const date = new Date(t.createdAt);
        return date >= previousPeriodStart && date < periodStart;
    });

    const currentResolved = currentPeriod.filter(t => SUCCESS_STATUSES.includes(t.status)).length;
    const previousResolved = previousPeriod.filter(t => SUCCESS_STATUSES.includes(t.status)).length;

    const resolvedChange = previousResolved > 0 
        ? Math.round(((currentResolved - previousResolved) / previousResolved) * 100) 
        : currentResolved > 0 ? 100 : 0;

    return {
        currentCount: currentPeriod.length,
        previousCount: previousPeriod.length,
        currentResolved,
        previousResolved,
        change: previousPeriod.length > 0 
            ? Math.round(((currentPeriod.length - previousPeriod.length) / previousPeriod.length) * 100)
            : 0,
        resolvedChange
    };
};

const calculateDetailedFeedbackAnalytics = (tickets) => {
    const detailed = tickets.map(ticket => {
        const feedback = ticket.comments || [];
        const responses = feedback.filter(c => c.isStaff || c.role === 'reviewer').length;
        const clientMessages = feedback.filter(c => !c.isStaff && c.role !== 'reviewer').length;
        
        return {
            ticketId: ticket._id,
            subject: ticket.subject,
            totalMessages: feedback.length,
            staffResponses: responses,
            clientMessages,
            hasFeedback: feedback.length > 0,
            lastActivity: feedback.length > 0 ? feedback[feedback.length - 1].createdAt : null
        };
    });

    const totalFeedback = detailed.reduce((sum, d) => sum + d.totalMessages, 0);
    const ticketsWithActivity = detailed.filter(d => d.hasFeedback).length;

    return {
        detailed,
        totalFeedback,
        ticketsWithActivity,
        engagementRate: tickets.length > 0 ? Math.round((ticketsWithActivity / tickets.length) * 100) : 0,
        avgMessagesPerTicket: tickets.length > 0 ? (totalFeedback / tickets.length).toFixed(1) : 0
    };
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

const calculateReopenedTickets = () => {
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
        if (Object.hasOwn(statusCounts, t.status)) {
            statusCounts[t.status]++;
        }
    });
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count })).filter(i => i.count > 0);
};

const calculateTicketsByUrgency = (tickets) => {
    const urgencyCounts = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
    tickets.forEach(t => {
        if (Object.hasOwn(urgencyCounts, t.urgency)) {
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
        {Icon && <Icon size={18} />}
        <span>{label}</span>
        {count !== undefined && (
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${active ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {count}
            </span>
        )}
    </button>
);

const MetricCard = ({ title, value, icon, color, trend, trendUp, children, badge }) => (
    <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all relative overflow-hidden"
    >
        {badge && (
            <div className={`absolute top-0 right-0 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold rounded-bl-lg ${badge.bg} ${badge.text}`}>
                {badge.label}
            </div>
        )}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className={`p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl ${color}`}>
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span className="hidden xs:inline">{trend}</span>
                </div>
            )}
        </div>
        <div className="space-y-0.5 sm:space-y-1">
            <NumberTicker 
                value={typeof value === 'number' ? value : 0} 
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
            />
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        </div>
        {children && <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">{children}</div>}
    </motion.div>
);

const ClientReportPage = () => {
    const { user } = useAuthenticationStore();
    const { tickets, fetchTickets, loading, error } = useTicketStore(); 
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    useEffect(() => {
        fetchTickets("Client");
        setLastSynced(new Date());
        
        const interval = setInterval(() => {
            fetchTickets("Client");
            setLastSynced(new Date());
        }, 60000);
        
        const checkTheme = () => {
            const newTheme = localStorage.getItem('solease-ui-theme') || 'system';
            setIsDark(newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
        };
        checkTheme();
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        window.addEventListener('storage', checkTheme);
        
        return () => {
            clearInterval(interval);
            mediaQuery.removeEventListener('change', handleChange);
            window.removeEventListener('storage', checkTheme);
        };
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
    
    // New state for enhanced features
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [dateRange, setDateRange] = useState('30');
    const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGES[1]);
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

    const handleSyncData = async () => {
        setIsSyncing(true);
        try {
            await fetchTickets("Client");
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

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const printContent = `
                <div style="padding: 20px; font-family: Arial, sans-serif; width: 900px;">
                    <div style="border-bottom: 4px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px;">
                        <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #1f2937;">${user?.name}'s Support Report</h1>
                        <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 13px;">Generated: ${new Date().toLocaleString()}</p>
                    </div>

                    <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 15px;">Performance Overview</h2>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 15px; border-radius: 8px; color: white;">
                            <div style="font-size: 11px; opacity: 0.9;">Total Tickets</div>
                            <div style="font-size: 28px; font-weight: bold;">${stats.total}</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 15px; border-radius: 8px; color: white;">
                            <div style="font-size: 11px; opacity: 0.9;">Resolved</div>
                            <div style="font-size: 28px; font-weight: bold;">${stats.resolved}</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 15px; border-radius: 8px; color: white;">
                            <div style="font-size: 11px; opacity: 0.9;">In Progress</div>
                            <div style="font-size: 28px; font-weight: bold;">${stats.inProgress}</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 15px; border-radius: 8px; color: white;">
                            <div style="font-size: 11px; opacity: 0.9;">Satisfaction</div>
                            <div style="font-size: 28px; font-weight: bold;">${stats.sat.value}</div>
                        </div>
                    </div>

                    <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 15px;">Response Analytics</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #6b7280;">Avg Response Time</div>
                            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.avgResponse.value}</div>
                        </div>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #6b7280;">First Response Rate</div>
                            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${stats.firstResponseRate.value}</div>
                        </div>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #6b7280;">Avg Resolution</div>
                            <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${stats.avgRes.value}</div>
                        </div>
                    </div>

                    <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 15px;">Tickets by Status</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background: #3b82f6; color: white;">
                                <th style="padding: 12px; text-align: left; border: 1px solid #2563eb;">Status</th>
                                <th style="padding: 12px; text-align: center; border: 1px solid #2563eb;">Count</th>
                                <th style="padding: 12px; text-align: center; border: 1px solid #2563eb;">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.byStatus.map((row, idx) => `
                                <tr style="background: ${idx % 2 === 0 ? '#f9fafb' : 'white'};">
                                    <td style="padding: 12px; border: 1px solid #e5e7eb;">${row.status}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb; font-weight: bold;">${row.count}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">${stats.total > 0 ? ((row.count / stats.total) * 100).toFixed(1) : 0}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 15px;">Urgency Breakdown</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #6b7280; color: white;">
                                <th style="padding: 12px; text-align: left; border: 1px solid #4b5563;">Urgency</th>
                                <th style="padding: 12px; text-align: center; border: 1px solid #4b5563;">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.byUrgency.map((row, idx) => `
                                <tr style="background: ${idx % 2 === 0 ? '#f9fafb' : 'white'};">
                                    <td style="padding: 12px; border: 1px solid #e5e7eb;">${row.urgency}</td>
                                    <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb; font-weight: bold;">${row.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
                        <div style="font-size: 11px; color: #9ca3af;">SolEase Support Dashboard | Generated automatically</div>
                    </div>
                </div>
            `;

            const container = document.createElement('div');
            container.innerHTML = printContent;

            const opt = {
                margin: 5,
                filename: `SolEase_Report_${user?.name}_${new Date().toISOString().split('T')[0]}.pdf`,
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

    // Safe tickets array
    const safeTickets = useMemo(() => {
        return Array.isArray(tickets) ? tickets : [];
    }, [tickets]);

    // User's tickets (unfiltered)
    const userAllTickets = useMemo(() => {
        return safeTickets.filter(t => (t.user?._id || t.user) === user._id);
    }, [safeTickets, user]);

    // Check if user has any tickets at all (for distinguishing "no records" vs "no tickets ever")
    const userHasAnyTickets = useMemo(() => {
        return safeTickets.some(t => (t.user?._id || t.user) === user._id);
    }, [safeTickets, user]);

    const clientTickets = useMemo(() => {
        let filtered = userAllTickets;
        
        // Apply date range filter
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            filtered = filtered.filter(t => new Date(t.createdAt) >= cutoffDate);
        }
        
        return filtered;
    }, [userAllTickets, dateRange]);

    // Has tickets but none in selected date range
    const hasNoRecordsInRange = userHasAnyTickets && clientTickets.length === 0;

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
        slaCompliance: calculateSLACompliance(clientTickets),
        healthScore: calculateTicketHealthScore(clientTickets),
        comparative: calculateComparativeStats(clientTickets, parseInt(dateRange)),
        feedbackDetailed: calculateDetailedFeedbackAnalytics(clientTickets),
        // Computed trends
        trends: {
            totalChange: calculateComparativeStats(clientTickets, parseInt(dateRange)).change,
            resolvedChange: calculateComparativeStats(clientTickets, parseInt(dateRange)).resolvedChange,
            resolutionRate: clientTickets.length > 0 ? ((clientTickets.filter(t => SUCCESS_STATUSES.includes(t.status)).length / clientTickets.length) * 100).toFixed(1) : 0,
        }
    }), [clientTickets, dateRange]);

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
                {(clientTickets.length > 0 || hasNoRecordsInRange) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    {user?.name ? `${user.name.split(' ')[0]}'s Dashboard` : "My Dashboard"}
                                </h1>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Activity size={14} className="text-green-500" />
                                        <span className="text-green-600 dark:text-green-400 font-semibold">Live Data</span>
                                    </p>
                                    {isSyncing && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
                                        >
                                            <RefreshCw size={12} className="animate-spin" />
                                            Syncing data...
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Date Range Filter */}
                                <Listbox value={dateRange} onChange={(val) => { setDateRange(val); setSelectedDateRange(DATE_RANGES.find(r => r.value === val)); }} open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
                                    <div className="relative">
                                        <Listbox.Button className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="hidden xs:inline">{selectedDateRange?.label || 'Date Range'}</span>
                                            <span className="xs:hidden font-medium">{dateRange === 'all' ? 'All' : `${dateRange}d`}</span>
                                            <ChevronDown size={12} className={`text-gray-400 transition-transform ${isDateFilterOpen ? 'rotate-180' : ''} hidden sm:block`} />
                                        </Listbox.Button>
                                        
                                        <Listbox.Options className="absolute z-50 mt-1 left-0 sm:right-0 w-[calc(100vw-2rem)] sm:w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
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
                                                    {dateRange === range.value && <Check size={16} className="text-blue-500" />}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>

                                {/* Sync Button */}
                                <button 
                                    onClick={handleSyncData}
                                    disabled={isSyncing}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCw size={16} className={`text-gray-600 dark:text-gray-300 ${isSyncing ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
                                </button>

                                {/* Export Button */}
                                <button 
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    <FileDown size={16} />
                                    <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export Report'}</span>
                                </button>

                                <Link 
                                    to="/client-dashboard/all-tickets" 
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Eye size={16} />
                                    <span className="hidden sm:inline">View All</span>
                                </Link>
                            </div>
                        </div>
                        {lastSynced && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Last synced: {formatLastSynced(lastSynced)}
                            </div>
                        )}
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
                ) : hasNoRecordsInRange ? (
                    <NoRecordsFound 
                        dateRangeLabel={selectedDateRange?.label || 'this period'}
                        totalTickets={userAllTickets.length}
                        lastTicketDate={userAllTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt}
                        onClearFilter={() => {
                            setDateRange('all');
                            setSelectedDateRange(DATE_RANGES.find(r => r.value === 'all'));
                        }}
                        onChangeDateRange={(value) => {
                            setDateRange(value);
                            setSelectedDateRange(DATE_RANGES.find(r => r.value === value));
                        }}
                    />
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
                                    {/* Key Metrics Row */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                        <MetricCard 
                                            title="Total Tickets" 
                                            value={stats.total} 
                                            icon={<Tickets size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                                            trend={stats.trends.totalChange !== 0 ? `${stats.trends.totalChange > 0 ? '+' : ''}${stats.trends.totalChange}%` : null}
                                            trendUp={stats.trends.totalChange >= 0}
                                        />
                                        <MetricCard 
                                            title="Resolution Rate" 
                                            value={`${stats.trends.resolutionRate}%`}
                                            icon={<Target size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                                            trend={stats.trends.resolvedChange !== 0 ? `${stats.trends.resolvedChange > 0 ? '+' : ''}${stats.trends.resolvedChange}%` : null}
                                            trendUp={stats.trends.resolvedChange >= 0}
                                        />
                                        <MetricCard 
                                            title="Avg Response Time" 
                                            value={stats.avgResponse.value}
                                            icon={<Timer size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-indigo-500 to-blue-600"
                                            trend={stats.avgResponse.hours ? `${stats.avgResponse.hours}h avg` : null}
                                        />
                                        <MetricCard 
                                            title="Active Tickets" 
                                            value={stats.inProgress} 
                                            icon={<Clock size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-amber-500 to-orange-500"
                                            trend="Currently Open"
                                        />
                                    </div>

                                    {/* Secondary Stats Row */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                        <MetricCard 
                                            title="Resolved" 
                                            value={stats.resolved} 
                                            icon={<CheckCircle size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-green-500 to-emerald-600"
                                            trend={`${stats.trends.resolutionRate}% Resolved`}
                                        />
                                        <MetricCard 
                                            title="First Response Rate" 
                                            value={stats.firstResponseRate.value}
                                            icon={<Zap size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-purple-500 to-violet-600"
                                            trend="Quick Response"
                                        />
                                        <MetricCard 
                                            title="SLA Compliance" 
                                            value={`${stats.slaCompliance.compliance}%`}
                                            icon={<Gauge size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-cyan-500 to-sky-600"
                                            badge={{ label: `${stats.slaCompliance.onTime}/${stats.slaCompliance.total}`, bg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', text: 'text-green-700 dark:text-green-400' }}
                                        />
                                        <MetricCard 
                                            title="Critical/High" 
                                            value={stats.critical} 
                                            icon={<AlertTriangle size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-red-500 to-rose-600"
                                            badge={stats.critical > 0 ? { label: '!', bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', text: 'text-red-700 dark:text-red-400' } : null}
                                        />
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Resolution Time Trend */}
                                        {hasChartData(stats.chart.data) && (
                                            <motion.div 
                                                initial={{ y: 20 }} 
                                                animate={{ y: 0 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                                            <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 dark:text-white">Resolution Time</h3>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Average days to close tickets</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg days</span>
                                                </div>
                                                <div style={{ height: '180px' }}>
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

                                        {/* Monthly Ticket Volume */}
                                        {hasChartData(stats.monthlyVolume.data) && (
                                            <motion.div 
                                                initial={{ y: 20 }} 
                                                animate={{ y: 0 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                                                            <Flame size={18} className="text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 dark:text-white">Ticket Volume</h3>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Number of tickets created per month</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Monthly</span>
                                                </div>
                                                <div style={{ height: '180px' }}>
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
                                                        height={180}
                                                        margin={{ top: 10, bottom: 25, left: 35, right: 10 }}
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

                                    {/* Status & Urgency Breakdown */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Tickets by Status */}
                                        <motion.div 
                                            whileHover={{ y: -4 }}
                                            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                                    <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <h3 className="font-bold text-gray-800 dark:text-white">Status Distribution</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {stats.byStatus.map((item) => {
                                                    const total = stats.byStatus.reduce((sum, s) => sum + s.count, 0);
                                                    const percentage = total > 0 ? (item.count / total) * 100 : 0;
                                                    const statusColors = {
                                                        'Open': 'bg-blue-500',
                                                        'In Progress': 'bg-yellow-500',
                                                        'Resolved': 'bg-purple-500',
                                                        'Closed': 'bg-green-500'
                                                    };
                                                    return (
                                                        <div key={item.status} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.status}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.count} ({percentage.toFixed(0)}%)</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>

                                        {/* Tickets by Urgency */}
                                        <motion.div 
                                            whileHover={{ y: -4 }}
                                            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                                                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                                                </div>
                                                <h3 className="font-bold text-gray-800 dark:text-white">Urgency Breakdown</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Critical', value: stats.byUrgency.find(u => u.urgency === 'Critical')?.count || 0, color: 'bg-red-500' },
                                                    { label: 'High', value: stats.byUrgency.find(u => u.urgency === 'High')?.count || 0, color: 'bg-orange-500' },
                                                    { label: 'Medium', value: stats.byUrgency.find(u => u.urgency === 'Medium')?.count || 0, color: 'bg-yellow-500' },
                                                    { label: 'Low', value: stats.byUrgency.find(u => u.urgency === 'Low')?.count || 0, color: 'bg-green-500' },
                                                ].map(item => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Performance Summary */}
                                        <motion.div 
                                            whileHover={{ y: -4 }}
                                            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl shadow-lg text-white"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <Gauge size={20} className="text-white/80" />
                                                <h3 className="font-bold">Performance Summary</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                                                    <span className="text-sm text-blue-100">Health Score</span>
                                                    <span className={`text-xl font-bold ${stats.healthScore >= 70 ? 'text-green-300' : stats.healthScore >= 40 ? 'text-yellow-300' : 'text-red-300'}`}>
                                                        {stats.healthScore}/100
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                                                    <span className="text-sm text-blue-100">Avg Resolution</span>
                                                    <span className="text-xl font-bold">{stats.avgRes.value}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                                                    <span className="text-sm text-blue-100">Satisfaction</span>
                                                    <span className="text-xl font-bold">{stats.sat.value}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Response Analytics Section */}
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg">
                                                    <MessageCircle size={18} className="text-cyan-600 dark:text-cyan-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 dark:text-white">Response Analytics</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">How quickly support responds to your tickets</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                <div className="p-2 bg-blue-500 rounded-lg">
                                                    <Timer size={18} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgResponse.value}</p>
                                                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Avg Response Time</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <div className="p-2 bg-green-500 rounded-lg">
                                                    <Zap size={18} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.firstResponseRate.value}</p>
                                                    <p className="text-xs text-green-600/70 dark:text-green-400/70">First Response Rate</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                <div className="p-2 bg-purple-500 rounded-lg">
                                                    <ThumbsUp size={18} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.firstResponseData.withResponse}/{stats.firstResponseData.total}</p>
                                                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Tickets Responded</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                    {/* Performance Metrics Row */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                        <MetricCard 
                                            title="First Response Rate" 
                                            value={stats.firstResponseRate.value}
                                            icon={<Zap size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-green-500 to-emerald-600"
                                            trend="Quick Reply %"
                                        />
                                        <MetricCard 
                                            title="Avg Response Time" 
                                            value={stats.avgResponse.value}
                                            icon={<Timer size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-blue-500 to-indigo-600"
                                            trend="Hours to Respond"
                                        />
                                        <MetricCard 
                                            title="Avg Resolution Time" 
                                            value={stats.avgRes.value}
                                            icon={<CheckCircle size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-purple-500 to-violet-600"
                                            trend="Days to Close"
                                        />
                                        <MetricCard 
                                            title="Satisfaction Score" 
                                            value={stats.sat.value}
                                            icon={<Star size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-orange-500 to-amber-600"
                                            trend="Avg Rating"
                                        />
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Response Time Trend */}
                                        {hasChartData(stats.avgResponseTimeOverTime.data) && (
                                            <motion.div 
                                                initial={{ y: 20 }} 
                                                animate={{ y: 0 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                                            <Timer size={18} className="text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 dark:text-white">Response Time Trend</h3>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Average hours to first response</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg hours</span>
                                                </div>
                                                <div style={{ height: '200px' }}>
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
                                                        height={200}
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
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                                                            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 dark:text-white">Resolution Rate</h3>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Percentage of tickets resolved</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">% resolved</span>
                                                </div>
                                                <div style={{ height: '200px' }}>
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
                                                        height={200}
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

                                    {/* Category Breakdown */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Open Tickets by Category */}
                                        {stats.categories.some(c => c.count > 0) && (
                                            <motion.div 
                                                whileHover={{ y: -4 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                                        <BarChart3 size={18} className="text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 dark:text-white">Tickets by Category</h3>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Distribution of issue types</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {stats.categories.filter(c => c.count > 0).map((cat, idx) => {
                                                        const maxCount = Math.max(...stats.categories.map(c => c.count));
                                                        const percentage = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                                                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
                                                        return (
                                                            <div key={cat.type} className="space-y-1">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{cat.displayName}</span>
                                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cat.count}</span>
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
                                            </motion.div>
                                        )}

                                        {/* Tickets by Status */}
                                        {stats.byStatus.length > 0 && (
                                            <motion.div 
                                                whileHover={{ y: -4 }}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                                        <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 dark:text-white">Tickets by Status</h3>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Current ticket status breakdown</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
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
                                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.status}</span>
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.count} ({percentage.toFixed(0)}%)</span>
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
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Performance Summary */}
                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg text-white"
                                    >
                                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                            <Gauge size={18} className="text-white/80" />
                                            <h3 className="font-bold text-sm sm:text-base">Performance Summary</h3>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                            <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                                                <p className="text-2xl sm:text-3xl font-bold">{stats.healthScore}</p>
                                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">Health Score</p>
                                            </div>
                                            <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                                                <p className="text-2xl sm:text-3xl font-bold">{stats.slaCompliance.compliance}%</p>
                                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">SLA Compliance</p>
                                            </div>
                                            <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                                                <p className="text-2xl sm:text-3xl font-bold">{stats.feedbackDetailed.engagementRate}%</p>
                                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">Engagement</p>
                                            </div>
                                            <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                                                <p className="text-2xl sm:text-3xl font-bold">{stats.feedbackDetailed.avgMessagesPerTicket}</p>
                                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">Msgs per Ticket</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ACTIVITY TAB */}
                            {activeTab === 'activity' && (
                                <motion.div
                                    key="activity"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    {/* Activity Metrics Row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                                        <MetricCard 
                                            title="Feedback Tickets" 
                                            value={stats.feedback.ticketsWithFeedback}
                                            icon={<MessageCircle size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-blue-500 to-indigo-600"
                                            trend="With Feedback"
                                        />
                                        <MetricCard 
                                            title="Total Messages" 
                                            value={stats.feedback.totalFeedbackCount}
                                            icon={<Activity size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-green-500 to-emerald-600"
                                            trend="All Time"
                                        />
                                        <MetricCard 
                                            title="Active Discussions" 
                                            value={stats.activeDiscussions}
                                            icon={<Zap size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-purple-500 to-violet-600"
                                            trend="In Progress"
                                        />
                                        <MetricCard 
                                            title="Engagement Rate" 
                                            value={`${stats.feedback.engagementRate}%`}
                                            icon={<TrendingUp size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-orange-500 to-amber-600"
                                            trend="Active %"
                                        />
                                        <MetricCard 
                                            title="Recent Activity" 
                                            value={stats.feedback.recentFeedback}
                                            icon={<Clock size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-cyan-500 to-sky-600"
                                            trend="This Week"
                                        />
                                        <MetricCard 
                                            title="Feedback Rate" 
                                            value={`${stats.feedback.feedbackRate}%`}
                                            icon={<ThumbsUp size={18} className="text-white" />}
                                            color="bg-gradient-to-br from-pink-500 to-rose-600"
                                            trend="Response %"
                                        />
                                    </div>

                                    {/* Engagement Metrics */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Message Breakdown */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
                                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                    <MessageCircle size={16} className="text-blue-500" />
                                                    <span className="text-sm sm:text-base">Message Breakdown</span>
                                                </h3>
                                                <span className="text-[10px] text-gray-500">Communication overview</span>
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                                                            <Send size={14} className="text-white" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Your Messages</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{stats.feedbackDetailed.detailed.reduce((sum, d) => sum + d.clientMessages, 0)}</p>
                                                        <p className="text-[10px] sm:text-xs text-gray-500">{((stats.feedbackDetailed.detailed.reduce((sum, d) => sum + d.clientMessages, 0) / Math.max(stats.feedbackDetailed.totalFeedback, 1) * 100)).toFixed(0)}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                                                            <User size={14} className="text-white" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Staff Responses</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{stats.feedbackDetailed.detailed.reduce((sum, d) => sum + d.staffResponses, 0)}</p>
                                                        <p className="text-[10px] sm:text-xs text-gray-500">{((stats.feedbackDetailed.detailed.reduce((sum, d) => sum + d.staffResponses, 0) / Math.max(stats.feedbackDetailed.totalFeedback, 1) * 100)).toFixed(0)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-500">Avg messages/ticket</span>
                                                    <span className="font-bold text-gray-800 dark:text-white">{stats.feedbackDetailed.avgMessagesPerTicket}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Feedback */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                        <Clock size={16} className="text-purple-500" />
                                                        <span className="text-sm sm:text-base">Recent Activity</span>
                                                    </h3>
                                                    <span className="text-[10px] text-gray-500">Latest interactions</span>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[300px] sm:max-h-80 overflow-y-auto">
                                                {stats.recentFeedback.length > 0 ? stats.recentFeedback.map((feedback, idx) => (
                                                    <motion.div 
                                                        key={`${feedback.ticketId}-${idx}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-2 sm:gap-3">
                                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0">
                                                                {feedback.user?.name?.charAt(0) || feedback.user?.username?.charAt(0) || 'U'}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                                    <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-white truncate">
                                                                        {feedback.user?.name || feedback.user?.username || 'Unknown'}
                                                                    </span>
                                                                    <span className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold rounded-full ${feedback.isStaff ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                                                                        {feedback.isStaff ? 'Staff' : 'You'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">{feedback.ticketSubject}</p>
                                                                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{feedback.content}</p>
                                                                <p className="text-[8px] sm:text-[10px] text-gray-400 mt-1 sm:mt-2 flex items-center gap-1">
                                                                    <Clock size={8} />
                                                                    {formatFullDate(feedback.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )) : (
                                                    <div className="p-6 sm:p-8 text-center text-gray-400">
                                                        <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">No recent activity</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Activity Timeline */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                    <Activity size={16} className="text-green-500" />
                                                    <span className="text-sm sm:text-base">Activity Timeline</span>
                                                </h3>
                                                <span className="text-[10px] text-gray-500">Ticket history</span>
                                            </div>
                                        </div>
                                        <div className="p-3 sm:p-5">
                                            <div className="relative">
                                                {/* Timeline line */}
                                                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                                                
                                                <div className="space-y-3 sm:space-y-4">
                                                    {stats.feedbackDetailed.detailed.slice(0, 5).map((item, idx) => {
                                                        const ticket = clientTickets.find(t => t._id === item.ticketId);
                                                        if (!ticket) return null;
                                                        
                                                        return (
                                                            <motion.div 
                                                                key={item.ticketId}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                className="relative flex items-start gap-3 sm:gap-4 pl-8 sm:pl-10"
                                                            >
                                                                <div className={`absolute left-1.5 sm:left-2 w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 ${
                                                                    SUCCESS_STATUSES.includes(ticket.status) 
                                                                        ? 'bg-green-500 border-green-500' 
                                                                        : ticket.status === 'In Progress'
                                                                            ? 'bg-yellow-500 border-yellow-500'
                                                                            : 'bg-blue-500 border-blue-500'
                                                                }`}></div>
                                                                <div className="flex-1 p-2 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg sm:rounded-xl">
                                                                    <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                                                                        <span className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold rounded-full ${
                                                                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                                                            ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                                                            SUCCESS_STATUSES.includes(ticket.status) ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                                            'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400'
                                                                        }`}>
                                                                            {ticket.status}
                                                                        </span>
                                                                        <span className="text-[8px] sm:text-[10px] text-gray-400">
                                                                            {item.totalMessages} msgs
                                                                        </span>
                                                                    </div>
                                                                    <p className="font-medium text-xs sm:text-sm text-gray-800 dark:text-white truncate">{item.subject}</p>
                                                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                                                                        {item.staffResponses} staff • {item.clientMessages} your
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
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
                            className="mt-6 sm:mt-8"
                        >
                            <div className="p-4 sm:p-5">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 text-center">
                                    Quick Actions
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                    <Link 
                                        to="/client-dashboard/new-ticket"
                                        className="group relative flex flex-col items-center text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                                        <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg backdrop-blur-sm mb-1.5 sm:mb-2">
                                            <Tickets size={14} className="sm:hidden" />
                                            <Tickets size={16} className="hidden sm:block" />
                                        </span>
                                        <span className="relative text-xs sm:text-sm">New Ticket</span>
                                        <span className="relative text-[8px] sm:text-[10px] opacity-70 mt-0.5 sm:mt-1 hidden xs:block">Submit a request</span>
                                    </Link>
                                    <Link 
                                        to="/client-dashboard/all-tickets"
                                        className="group relative flex flex-col items-center text-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                                    >
                                        <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors mb-1.5 sm:mb-2">
                                            <Eye size={14} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors sm:hidden" />
                                            <Eye size={16} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden sm:block" />
                                        </span>
                                        <span className="relative text-xs sm:text-sm">View Tickets</span>
                                        <span className="relative text-[8px] sm:text-[10px] text-gray-400 mt-0.5 sm:mt-1 hidden xs:block">Browse history</span>
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
