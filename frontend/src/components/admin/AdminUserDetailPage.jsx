import React, { useState, useEffect, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router";
import { X, ChevronDown, Check, User, Mail, Shield, Activity, Save, ArrowLeft, Calendar, CheckCircle, XCircle, AlertCircle, Pencil, RefreshCw } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from "framer-motion";

const ROLES = ["Client", "Manager", "Reviewer"];
const STATUSES = ["Active", "Rejected"];

const AdminUserDetailPage = () => {
  const { users, loading, updateUserRoleAndStatus, fetchUsers, error } = useAdminStore();
  const { username } = useParams();

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users]);

  const user = users.find((u) => u.username === username);

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
      setStatus(user.status || "");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const changed = role !== user.role || status !== user.status;
      setHasChanges(changed);
    }
  }, [role, status, user]);

  const handleSave = async () => {
    if (!hasChanges) {
      toast.error("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserRoleAndStatus(user.username, role, status);
      toast.success(`${user.username}'s profile updated!`);
      navigate("/admin-dashboard/users");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Discard changes?</p>
          <p className="text-sm text-gray-500">You have unsaved changes that will be lost.</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg">Keep Editing</button>
            <button onClick={() => { toast.dismiss(t.id); navigate("/admin-dashboard/users"); }} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg">Discard</button>
          </div>
        </div>
      ), { duration: 5000 });
    } else {
      navigate("/admin-dashboard/users");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading && !user) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-gray-400">Loading user details...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => fetchUsers()} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-2">
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </DashboardLayout>
  );

  if (!user) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <User size={48} className="text-gray-400" />
        <p className="text-gray-500 font-medium">User not found</p>
        <Link to="/admin-dashboard/users" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Users
        </Link>
      </div>
    </DashboardLayout>
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "Active": return { bg: "bg-green-500", text: "text-green-600", darkText: "dark:text-green-400", bgLight: "bg-green-50", darkBgLight: "dark:bg-green-900/20", border: "border-green-200", label: "Active", icon: CheckCircle };
      case "Rejected": return { bg: "bg-red-500", text: "text-red-600", darkText: "dark:text-red-400", bgLight: "bg-red-50", darkBgLight: "dark:bg-red-900/20", border: "border-red-200", label: "Rejected", icon: XCircle };
      default: return { bg: "bg-gray-500", text: "text-gray-600", darkText: "dark:text-gray-400", bgLight: "bg-gray-50", darkBgLight: "dark:bg-gray-800", border: "border-gray-200", label: status, icon: Activity };
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "Manager": return { bg: "bg-blue-500", text: "text-blue-600", darkText: "dark:text-blue-400", bgLight: "bg-blue-50", darkBgLight: "dark:bg-blue-900/20", border: "border-blue-200" };
      case "Service Desk": return { bg: "bg-emerald-500", text: "text-emerald-600", darkText: "dark:text-emerald-400", bgLight: "bg-emerald-50", darkBgLight: "dark:bg-emerald-900/20", border: "border-emerald-200" };
      case "IT Support": return { bg: "bg-amber-500", text: "text-amber-600", darkText: "dark:text-amber-400", bgLight: "bg-amber-50", darkBgLight: "dark:bg-amber-900/20", border: "border-amber-200" };
      case "Client": return { bg: "bg-slate-500", text: "text-slate-600", darkText: "dark:text-slate-400", bgLight: "bg-slate-50", darkBgLight: "dark:bg-slate-800", border: "border-slate-200" };
      default: return { bg: "bg-purple-500", text: "text-purple-600", darkText: "dark:text-purple-400", bgLight: "bg-purple-50", darkBgLight: "dark:bg-purple-900/20", border: "border-purple-200" };
    }
  };

  const statusConfig = getStatusConfig(user.status);
  const roleConfig = getRoleConfig(user.role);
  const StatusIcon = statusConfig.icon;

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6"
        >
          <Link to="/admin-dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to="/admin-dashboard/users" className="hover:text-blue-500 transition-colors">Users</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white font-medium">{user.username}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/admin-dashboard/users"
              className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage user account</p>
            </div>
          </div>
          
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
            >
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Unsaved changes</span>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className={`bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 ring-4 ring-white/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{user.name || user.username}</h2>
                  <p className="text-blue-100">@{user.username}</p>
                  
                  <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${
                    statusConfig.bgLight + " " + statusConfig.text + " " + statusConfig.darkText + " " + statusConfig.bg + "/10 " + statusConfig.border
                  }`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                  <span className={`text-sm font-semibold ${roleConfig.text} ${roleConfig.darkText}`}>{user.role}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[150px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">User ID</span>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{user._id?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Member Since</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Edit Form */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Pencil size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Modify user role and account status</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Role Selector */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Shield size={16} className="text-purple-500" />
                    Role
                    {hasChanges && role !== user.role && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        Changed from {user.role}
                      </span>
                    )}
                  </label>
                  <Listbox value={role} onChange={setRole}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3.5 text-left text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${roleConfig.bg}`} />
                          <span className="block truncate font-medium">{role || "Select a role"}</span>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto">
                          {ROLES.map((r) => {
                            const rConfig = getRoleConfig(r);
                            return (
                              <ListboxOption key={r} value={r} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                {({ selected }) => (
                                  <div className="flex items-center gap-3">
                                    <span className={`w-2.5 h-2.5 rounded-full ${rConfig.bg}`} />
                                    <span className={`block truncate ${selected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{r}</span>
                                    {selected && <Check className="absolute right-3 w-4 h-4 text-blue-500" />}
                                  </div>
                                )}
                              </ListboxOption>
                            );
                          })}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Status Selector */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Activity size={16} className="text-orange-500" />
                    Account Status
                    {hasChanges && status !== user.status && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        Changed from {user.status}
                      </span>
                    )}
                  </label>
                  <Listbox value={status} onChange={setStatus}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3.5 text-left text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${getStatusConfig(status).bg}`} />
                          <span className="block truncate font-medium">{status || "Select status"}</span>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                          {STATUSES.map((s) => {
                            const sConfig = getStatusConfig(s);
                            return (
                              <ListboxOption key={s} value={s} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                {({ selected }) => (
                                  <div className="flex items-center gap-3">
                                    <span className={`w-2.5 h-2.5 rounded-full ${sConfig.bg}`} />
                                    <span className={`block truncate ${selected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{s}</span>
                                    {selected && <Check className="absolute right-3 w-4 h-4 text-blue-500" />}
                                  </div>
                                )}
                              </ListboxOption>
                            );
                          })}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <AlertCircle size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Important Information</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Changing a user's role will immediately affect their permissions and access levels. 
                    Deactivating an account will prevent the user from logging in.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetailPage;
