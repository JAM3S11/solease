import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added for motion
import DashboardLayout from "../ui/DashboardLayout";
import { SquarePen, Trash, Search } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import { Link } from "react-router";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
  const { users, fetchUsers, loading, error, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Motion Variants
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

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all"
              placeholder="Search by name or email..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  {["Name", "Role", "Status", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="loading">
                      <td colSpan="4" className="p-12 text-center text-gray-400">Loading users...</td>
                    </motion.tr>
                  ) : filteredUsers.map((user) => (
                    <motion.tr 
                      layout
                      key={user._id} 
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-blue-50/30 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider
                          ${user.role === "Manager" ? "bg-blue-100 text-blue-600" :
                            user.role === "Service Desk" ? "bg-emerald-100 text-emerald-600" :
                            user.role === "IT Support" ? "bg-amber-100 text-amber-600" :
                            user.role === "Client" ? "bg-slate-100 text-slate-600" :
                            "bg-rose-100 text-rose-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold 
                          ${user.status === "Active" ? "bg-green-100/50 text-green-700" :
                            user.status === "Pending" ? "bg-orange-100/50 text-orange-700" :
                            "bg-red-100/50 text-red-700"}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            user.status === "Active" ? "bg-green-500" :
                            user.status === "Pending" ? "bg-orange-500" : "bg-red-500"
                          }`} />
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link 
                            to={`/admin-dashboard/users/${user.username}`} 
                            className="text-blue-500 hover:text-blue-700 transition-transform hover:-translate-y-0.5"
                          >
                            <SquarePen size={18} />
                          </Link>
                          <button
                            onClick={async () => {
                              if(window.confirm(`Are you sure you want to delete ${user.username}?`)){
                                try {
                                  await deleteUser(user._id);
                                  toast.success(`${user.username} deleted!`);
                                } catch (err) {
                                  toast.error(`Failed to delete user`);
                                }
                              }
                            }}
                            className="text-gray-300 hover:text-red-500 transition-all hover:-translate-y-0.5"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;