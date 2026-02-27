import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/notificationStore";
import { 
  Bell, CheckCheck, Clock, Filter, Search, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Info, X
} from "lucide-react";

const STATUS_COLORS = {
  "Open": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  "Resolved": "bg-green-500",
  "Closed": "bg-gray-500"
};

const AllNotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, itemsPerPage]);

  const getTicketPath = (ticketId) => {
    const userRole = user?.role;
    if (userRole === 'Manager' || userRole === 'Admin') {
      return `/admin-dashboard/admin-tickets/${ticketId}`;
    } else if (userRole === 'Reviewer') {
      return `/reviewer-dashboard/ticket/${ticketId}`;
    } else {
      return `/client-dashboard/ticket/${ticketId}/feedback`;
    }
  };

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    if (filter === "unread") {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === "read") {
      filtered = filtered.filter(n => n.read);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title?.toLowerCase().includes(query) || 
        n.message?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, filter, searchQuery]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    navigate(getTicketPath(notification.ticket?._id || notification.ticket));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type, read) => {
    const baseClass = "p-2 rounded-full";
    switch (type) {
      case "status_update":
        return (
          <div className={`${baseClass} ${read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900/40"}`}>
            <Clock className={`h-4 w-4 ${read ? "text-gray-400" : "text-blue-600 dark:text-blue-400"}`} />
          </div>
        );
      default:
        return (
          <div className={`${baseClass} ${read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900/40"}`}>
            <Bell className={`h-4 w-4 ${read ? "text-gray-400" : "text-blue-600 dark:text-blue-400"}`} />
          </div>
        );
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bell className="h-7 w-7 text-blue-600" />
                Notifications
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === option.value
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {searchQuery || filter !== "all" ? "No matching notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery || filter !== "all" 
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "When you receive notifications about your tickets, they'll appear here."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 sm:p-5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type, notification.read)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${
                          notification.read 
                            ? "text-gray-600 dark:text-gray-400" 
                            : "text-gray-900 dark:text-gray-100"
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {notification.newStatus && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_COLORS[notification.newStatus] || "bg-gray-500"}`}>
                            {notification.newStatus}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.ticket?.subject && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                            Re: {notification.ticket.subject}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Items per page */}
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
                <div className="relative">
                  <button
                    onClick={() => setItemsPerPageOpen(!itemsPerPageOpen)}
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <span>{itemsPerPage}</span>
                    <ChevronRight size={12} className={`transition-transform ${itemsPerPageOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {itemsPerPageOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setItemsPerPageOpen(false)} />
                      <div className="absolute bottom-full mb-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 min-w-[70px]">
                        {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                          <button
                            key={num}
                            onClick={() => { setItemsPerPage(num); setCurrentPage(1); setItemsPerPageOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              itemsPerPage === num ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">per page</span>
              </div>

              {/* Page info and navigation */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  {totalPages <= 5 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    <>
                      {currentPage > 2 && (
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          1
                        </button>
                      )}
                      {currentPage > 3 && <span className="px-1 text-gray-400 text-xs">...</span>}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => Math.abs(page - currentPage) <= 1)
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))
                      }
                      {currentPage < totalPages - 2 && <span className="px-1 text-gray-400 text-xs">...</span>}
                      {currentPage < totalPages - 1 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {totalPages}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AllNotificationsPage;
