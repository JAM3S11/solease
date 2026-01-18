 import React, { useState, useEffect, Fragment } from "react";
 import DashboardLayout from "../ui/DashboardLayout";
 import { Link, useNavigate, useParams } from "react-router";
 import { X, ChevronDown, Check, User, Mail, Shield, Activity, Save, ArrowLeft } from "lucide-react";
 import useAdminStore from "../../store/adminStore";
 import toast from "react-hot-toast";
 import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
 import { motion, AnimatePresence } from "framer-motion";

const AdminUserDetailPage = () => {
  const { users, loading, updateUserRoleAndStatus, fetchUsers, error } = useAdminStore();
  const { username } = useParams();

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users]);

  const user = users.find((u) => u.username === username);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      await updateUserRoleAndStatus(user.username, role, status);
    };
    navigate("/admin-dashboard/users");
    toast.success(`${user.username}'s profile updated!`);
  };

  const roles = ["Client", "Reviewer", "Manager"];
  const statuses = ["Active", "Rejected"];

  // Motion Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-400">User not found</div>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/admin-dashboard/users"
              className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage user roles and account status</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Profile Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-blue-100">@{user.username}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.status === 'Active'
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                }`}>
                  <Activity size={14} className="inline mr-1" />
                  {user.status}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <User size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Username</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <Mail size={18} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <Shield size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Current Role</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <Activity size={18} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Account Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Edit Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Edit User Settings</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Update the user's role and account status below</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Shield size={16} className="inline mr-2 text-purple-500" />
                  Role
                </label>
                <Listbox value={role} onChange={setRole}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600">
                      <span className="block truncate">{role}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <ListboxOptions className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {roles.map((r) => (
                          <ListboxOption key={r} value={r} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{r}</span>
                                {selected && <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Activity size={16} className="inline mr-2 text-orange-500" />
                  Status
                </label>
                <Listbox value={status} onChange={setStatus}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600">
                      <span className="block truncate">{status}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <ListboxOptions className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {statuses.map((s) => (
                          <ListboxOption key={s} value={s} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{s}</span>
                                {selected && <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>

            {/* Save Button */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700"
            >
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetailPage;