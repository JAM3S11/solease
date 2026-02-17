import * as React from "react"
import { Ticket, User, LogOut, ChevronDown } from "lucide-react"
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

export function ProfileDropdown() {
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

  const initials = getInitials(user?.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {initials}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "Client"}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(getTicketPath())} className="cursor-pointer">
          <Ticket className="mr-2 h-4 w-4" />
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
