import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { 
  SquarePen, 
  Trash, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Mail, 
  Shield, 
  Activity,
  Calendar,
  CheckCircle2
} from "lucide-react";
import useAdminStore from "../../store/adminStore";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const PAGE_SIZE_OPTIONS = [2, 5, 10, 15, 20, 25, 50, 100];

const AdminUsersPage = () => {
  const { users, fetchUsers, loading, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [sortConfig, setSortConfig] = useState({ key: "username", direction: "asc" });
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 30000);
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [users, searchTerm, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, staggerChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === "asc" ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />;
  };

  const SortableHeader = ({ label, columnKey, icon: Icon, className = "" }) => (
    <th 
      className={`px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${className}`}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={14} />}
        {label}
        {getSortIcon(columnKey)}
      </div>
    </th>
  );

  const handleDelete = async (user, e) => {
    if (e) e.stopPropagation();
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      toast.success(`${userToDelete.username} deleted!`);
    } catch {
      toast.error(`Failed to delete user`);
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="p-4 sm:p-6 lg:p-8 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="-mt-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            User Management
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage user accounts, roles, and statuses.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all"
              placeholder="Search by name or email..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggle & Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Users size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
              </span>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                    >
                      <List size={16} className={viewMode === "table" ? "text-blue-600" : "text-gray-500"} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Table View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                    >
                      <LayoutGrid size={16} className={viewMode === "grid" ? "text-blue-600" : "text-gray-500"} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Grid View</TooltipContent>
                </Tooltip>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {searchTerm ? "No users match your search" : "No users found"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedUsers.map((user) => (
                  <UserCard key={user._id} user={user} onDelete={(e) => handleDelete(user, e)} />
                ))}
              </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <SortableHeader label="User" columnKey="username" icon={Users} className="pl-5" />
                      <SortableHeader label="Role" columnKey="role" icon={Shield} />
                      <SortableHeader label="Status" columnKey="status" icon={Activity} />
                      <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <SquarePen size={14} />
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <AnimatePresence mode="popLayout">
                      {paginatedUsers.map((user, index) => (
                        <motion.tr 
                          layout
                          key={user._id} 
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-800/50"}`}
                        >
                          <td className="px-4 py-3.5 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${user.profilePhoto ? '' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                                  {user.profilePhoto ? (
                                    <img 
                                      src={user.profilePhoto} 
                                      alt={user.name || user.username}
                                      className="w-full h-full rounded-xl object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-bold text-white">
                                      {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {/* Online Indicator */}
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${user.isOnline ? "bg-green-500" : "bg-red-500"}`}>
                                  {user.isOnline && <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 dark:text-white truncate flex items-center gap-1">
                                  {user.name || user.username}
                                  {user.isVerified && <CheckCircle2 size={14} className="text-blue-500" />}
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border
                              ${user.role === "Manager" ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                                user.role === "Service Desk" ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" :
                                user.role === "IT Support" ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" :
                                user.role === "Client" ? "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" :
                                "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"}`}
                            >
                              <Shield size={10} className="mr-1" />
                              {user.role}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border
                              ${user.status === "Active" ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50" :
                                user.status === "Pending" ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50" :
                                "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50"}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                user.status === "Active" ? "bg-green-500" :
                                user.status === "Pending" ? "bg-orange-500" : "bg-red-500"
                              }`} />
                              {user.status}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link 
                                      to={`/admin-dashboard/users/${user.username}`}
                                      className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                    >
                                      <SquarePen size={16} />
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Profile</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDelete(user, e); }}
                                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete User</TooltipContent>
                                </Tooltip>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
          >
            {/* Page Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>

            {/* Page Info */}
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredUsers.length}</span> users
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let end = Math.min(totalPages, start + maxVisible - 1);
                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(
                    <button key={1} onClick={() => setCurrentPage(1)} className="w-9 h-9 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">1</button>
                  );
                  if (start > 2) pages.push(<span key="start-ellipsis" className="px-1">...</span>);
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-1">...</span>);
                  pages.push(
                    <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="w-9 h-9 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">{totalPages}</button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {userToDelete?.username}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  </TooltipProvider>
  );
};

const UserCard = ({ user, onDelete }) => {
  const getRoleStyles = (role) => {
    switch (role) {
      case "Manager": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Service Desk": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "IT Support": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Client": return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
      default: return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Active": return { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", dot: "bg-green-500", border: "border-green-100 dark:border-green-800/50" };
      case "Pending": return { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500", border: "border-orange-100 dark:border-orange-800/50" };
      default: return { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", dot: "bg-red-500", border: "border-red-100 dark:border-red-800/50" };
    }
  };

  const statusStyles = getStatusStyles(user.status);
  const formattedDate = user.createdAt ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(user.createdAt)) : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-5">
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 ${user.profilePhoto ? '' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            {user.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt={user.name || user.username}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white tracking-tighter">
                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Online Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${user.isOnline ? "bg-green-500" : "bg-red-500"}`}>
            {user.isOnline && <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to={`/admin-dashboard/users/${user.username}`}
                className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
              >
                <SquarePen size={18} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Edit Profile</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800 cursor-pointer"
              >
                <Trash size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete User</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-1 mb-5">
        <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight flex items-center gap-1.5">
          {user.name || user.username}
          {user.isVerified && (
            <CheckCircle2 size={16} className="text-blue-500" />
          )}
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">@{user.username}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${getRoleStyles(user.role)}`}>
          <Shield size={10} className="inline mr-1 -mt-0.5" />
          {user.role}
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyles.dot}`} />
          {user.status}
        </span>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2.5 group/info">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 group-hover/info:bg-blue-50 dark:group-hover/info:bg-blue-900/20 transition-colors">
            <Mail size={14} className="text-gray-400 group-hover/info:text-blue-500 transition-colors" />
          </div>
          <span className="truncate flex-1">{user.email}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2.5 group/info">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 group-hover/info:bg-emerald-50 dark:group-hover/info:bg-emerald-900/20 transition-colors">
            <Calendar size={14} className="text-gray-400 group-hover/info:text-emerald-500 transition-colors" />
          </div>
          <span>Joined {formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsersPage;
