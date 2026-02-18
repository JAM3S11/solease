import * as React from "react"
import { Bell, Check, Clock, CheckCheck } from "lucide-react"
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
import { useEffect } from "react"

const STATUS_COLORS = {
  "Open": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  "Resolved": "bg-green-500",
  "Closed": "bg-gray-500"
}

export function NotificationBell() {
  const navigate = useNavigate()
  const { user } = useAuthenticationStore()
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, fetchUnreadCount } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadCount])

  const getTicketPath = (ticketId) => {
    const userRole = user?.role
    
    if (userRole === 'Manager' || userRole === 'Admin') {
      return `/admin-dashboard/admin-tickets/${ticketId}`
    } else if (userRole === 'Reviewer') {
      return `/reviewer-dashboard/ticket/${ticketId}`
    } else {
      return `/client-dashboard/ticket/${ticketId}/feedback`
    }
  }

  const getAllTicketsPath = () => {
    const userRole = user?.role
    
    if (userRole === 'Manager' || userRole === 'Admin') {
      return "/admin-dashboard/admin-tickets"
    } else if (userRole === 'Reviewer') {
      return "/reviewer-dashboard/assigned-ticket"
    } else {
      return "/client-dashboard/all-tickets"
    }
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id)
    }
    navigate(getTicketPath(notification.ticket._id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "status_update":
        return <Clock className="h-4 w-4" />
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
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
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
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
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigate(getAllTicketsPath())}
          className="text-center justify-center text-sm text-blue-600 hover:text-blue-800"
        >
          View all tickets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
