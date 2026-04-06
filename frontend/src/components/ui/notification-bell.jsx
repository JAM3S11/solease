import * as React from "react"
import { createPortal } from "react-dom"
import { Bell, Check, Clock, CheckCheck, UserPlus, MessageCircle, Share2, X, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import useNotificationStore from "../../store/notificationStore"
import { useAuthenticationStore } from "../../store/authStore"
import { useEffect, useState } from "react"

const STATUS_COLORS = {
  "Open": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  "Resolved": "bg-green-500",
  "Closed": "bg-gray-500"
}

const getNotificationId = (notification) => notification?._id || notification?.id

const NotePreviewModal = ({ notification, onClose, getTicketPath, navigate, formatTimeAgo, markAsRead }) => {
  if (!notification) return null;
  
  const handleViewTicket = async () => {
    const ticketId = notification.ticketId;
    const notificationId = getNotificationId(notification);
    if (!notification.read && notificationId) {
      await markAsRead(notificationId);
    }
    onClose();
    navigate(getTicketPath(ticketId));
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <Share2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Shared Note</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">From</p>
            <p className="text-sm font-medium text-foreground">{notification.message}</p>
          </div>
          
          {notification.ticketId && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ticket</p>
              <p className="text-sm font-medium text-foreground">#{notification.ticketId.slice(-6).toUpperCase()}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{formatTimeAgo(notification.createdAt)}</span>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
          <button
            onClick={handleViewTicket}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            View Ticket
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export function NotificationBell() {
  const navigate = useNavigate()
  const { user } = useAuthenticationStore()
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAsUnread, markAllAsRead, fetchUnreadCount, notificationsEnabled } = useNotificationStore()
  const [selectedNoteNotification, setSelectedNoteNotification] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadCount])

  useEffect(() => {
    if (!dropdownOpen && selectedNoteNotification && !showModal) {
      setShowModal(true)
    }
  }, [dropdownOpen, selectedNoteNotification, showModal])

  const getTicketPath = (ticketId) => {
    const userRole = user?.role?.toUpperCase()

    if (userRole === 'MANAGER' || userRole === 'ADMIN') {
      return `/admin-dashboard/admin-tickets/${ticketId}`
    } else if (userRole === 'REVIEWER') {
      return `/reviewer-dashboard/ticket/${ticketId}/feedback`
    } else {
      return `/client-dashboard/ticket/${ticketId}/feedback`
    }
  }

  const getAllNotificationsPath = () => {
    const userRole = user?.role?.toUpperCase()

    if (userRole === 'MANAGER' || userRole === 'ADMIN') {
      return "/admin-dashboard/notifications"
    } else if (userRole === 'REVIEWER') {
      return "/reviewer-dashboard/notifications"
    } else {
      return "/client-dashboard/notifications"
    }
  }

  const handleNotificationClick = async (notification) => {
    const notificationId = getNotificationId(notification);
    if (notification.type === "NOTE_SHARED") {
      setDropdownOpen(false)
      setTimeout(() => {
        setSelectedNoteNotification(notification);
      }, 100)
      return;
    }
    if (!notification.read && notificationId) {
      await markAsRead(notificationId);
    }
    const ticketId = notification.ticketId || notification.ticket?._id;
    navigate(getTicketPath(ticketId));
  };

  const handleToggleRead = async (e, notification) => {
    e.preventDefault();
    e.stopPropagation();
    const notificationId = getNotificationId(notification);
    if (!notificationId) return;
    if (notification.read) {
      await markAsUnread(notificationId);
    } else {
      await markAsRead(notificationId);
    }
  };

  const closeNotePreview = () => {
    setSelectedNoteNotification(null);
    setShowModal(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "status_update":
      case "STATUS_UPDATE":
      case "TICKET_STATUS_UPDATE":
        return <Clock className="h-4 w-4" />
      case "TICKET_ASSIGNED":
      case "TICKET_ASSIGNED_TO_REVIEWER":
        return <UserPlus className="h-4 w-4" />
      case "NEW_COMMENT":
      case "NEW_REPLY":
        return <MessageCircle className="h-4 w-4" />
      case "NOTE_SHARED":
        return <Share2 className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationsEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {notificationsEnabled && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No notifications yet</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={getNotificationId(notification)}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleNotificationClick(notification)
                  }}
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`mt-0.5 p-1.5 rounded-full ${notification.read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900/40"}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-gray-100 font-medium"}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {notification.newStatus && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white ${STATUS_COLORS[notification.newStatus] || "bg-gray-500"}`}>
                            {notification.newStatus}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => handleToggleRead(e, notification)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
                      title={notification.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCheck 
                        size={16} 
                        className={notification.read ? "text-blue-500" : "text-gray-400"} 
                      />
                    </button>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate(getAllNotificationsPath())}
            className="text-center justify-center text-sm text-blue-600 hover:text-blue-800"
          >
            View All Notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotePreviewModal 
        notification={showModal ? selectedNoteNotification : null}
        onClose={closeNotePreview}
        getTicketPath={getTicketPath}
        navigate={navigate}
        formatTimeAgo={formatTimeAgo}
        markAsRead={markAsRead}
      />
    </>
  )
}
