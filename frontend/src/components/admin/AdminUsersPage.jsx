import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { SquarePen, Trash, Search, ChevronLeft, ChevronRight, Users, LayoutGrid, List, ArrowUpDown, ArrowUp, ArrowDown, Mail, Shield, Activity } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import { Link } from "react-router";
import toast from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [2, 5, 10, 15, 20, 25, 50, 100];

const AdminUsersPage = () => {
  const { users, fetchUsers, loading, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [sortConfig, setSortConfig] = useState({ key: "username", direction: "asc" });

  useEffect(() => {
    fetchUsers();
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

  const handleDelete = async (user) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete {user.username}?</p>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteUser(user._id);
                toast.success(`${user.username} deleted!`);
              } catch {
                toast.error(`Failed to delete user`);
              }
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
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
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                <List size={16} className={viewMode === "table" ? "text-blue-600" : "text-gray-500"} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                <LayoutGrid size={16} className={viewMode === "grid" ? "text-blue-600" : "text-gray-500"} />
              </button>
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
              <AnimatePresence mode="popLayout">
                {paginatedUsers.map((user) => (
                  <UserCard key={user._id} user={user} onDelete={() => handleDelete(user)} />
                ))}
              </AnimatePresence>
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
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="text-sm font-bold text-white">{user.username?.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 dark:text-white">
                                  {user.username}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Mail size={12} />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider
                              ${user.role === "Manager" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                                user.role === "Service Desk" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                                user.role === "IT Support" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                                user.role === "Client" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                                "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"}`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold 
                              ${user.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                                user.status === "Pending" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" :
                                "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}`}
                            >
                              <span className={`w-2 h-2 rounded-full ${
                                user.status === "Active" ? "bg-green-500" :
                                user.status === "Pending" ? "bg-orange-500" : "bg-red-500"
                              }`} />
                              {user.status}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <Link 
                                to={`/admin-dashboard/users/${user.username}`}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                                title="Edit user"
                              >
                                <SquarePen size={16} />
                              </Link>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(user); }}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                                title="Delete user"
                              >
                                <Trash size={16} />
                              </button>
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
    </DashboardLayout>
  );
};

const UserCard = ({ user, onDelete }) => {
  const getRoleStyles = (role) => {
    switch (role) {
      case "Manager": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "Service Desk": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "IT Support": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "Client": return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
      default: return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Active": return { bg: "bg-green-100/50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" };
      case "Pending": return { bg: "bg-orange-100/50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" };
      default: return { bg: "bg-red-100/50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" };
    }
  };

  const statusStyles = getStatusStyles(user.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{user.username?.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Link 
            to={`/admin-dashboard/users/${user.username}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <SquarePen size={16} />
          </Link>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 dark:text-white mb-1">{user.username}</h3>
      <p className="text-sm text-gray-500 mb-3">{user.email}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getRoleStyles(user.role)}`}>
          {user.role}
        </span>
      </div>

      <div className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${statusStyles.bg} ${statusStyles.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyles.dot}`} />
        {user.status}
      </div>
    </motion.div>
  );
};

export default AdminUsersPage;
