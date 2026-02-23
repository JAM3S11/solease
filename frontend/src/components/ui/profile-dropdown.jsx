import * as React from "react"
import { Tickets, User, LogOut, ChevronDown } from "lucide-react"
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
import { useAuthenticationStore } from "../../store/authStore"
import { toast } from "sonner"

export function ProfileDropdown({ showChevron = true }) {
  const { user, logout } = useAuthenticationStore()
  const navigate = useNavigate()

  const getInitials = (name) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getTicketPath = () => {
    switch (user?.role) {
      case "admin":
        return "/admin-dashboard/admin-tickets"
      case "reviewer":
        return "/reviewer-dashboard/assigned-ticket"
      case "client":
        return "/client-dashboard/all-tickets"
      default:
        return "/client-dashboard/all-tickets"
    }
  }

  const getProfilePath = () => {
    switch (user?.role) {
      case "admin":
        return "/admin-dashboard/settings"
      case "reviewer":
        return "/reviewer-dashboard/profile"
      case "client":
        return "/client-dashboard/profile"
      default:
        return "/client-dashboard/profile"
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("See you later!", { duration: 2000 })
      navigate("/auth/login")
    } catch (err) {
      toast.error("Logout failed")
    }
  }

  const getRoleStyles = () => {
    switch (user?.role) {
      case "admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "reviewer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "client":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusStyles = () => {
    switch (user?.status) {
      case "Active":
        return { dot: "bg-green-500", text: "text-green-600 dark:text-green-400" }
      case "Pending":
        return { dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" }
      case "Inactive":
      default:
        return { dot: "bg-red-500", text: "text-red-600 dark:text-red-400" }
    }
  }

  const statusStyles = getStatusStyles()
  const initials = getInitials(user?.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {initials}
          </div>
          {showChevron && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {initials}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getRoleStyles()}`}>
                    {user?.role || "client"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}></span>
                    <span className={`text-xs ${statusStyles.text}`}>{user?.status || "Active"}</span>
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(getTicketPath())} className="cursor-pointer">
          <Tickets className="mr-2 h-4 w-4" />
          <span>Tickets</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(getProfilePath())} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
