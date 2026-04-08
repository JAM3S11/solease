import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Crown,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import useAdminStore from "../../store/adminStore";
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

const PLAN_INFO = {
  BASIC: {
    name: "Basic",
    icon: Shield,
    color: "gray",
    maxPerHour: 0,
    description: "No AI auto-replies"
  },
  PRO: {
    name: "Pro",
    icon: Zap,
    color: "blue",
    maxPerHour: 15,
    description: "15 AI replies/hour, resets every 12hrs"
  },
  ENTERPRISE: {
    name: "Enterprise",
    icon: Crown,
    color: "purple",
    maxPerHour: "Unlimited",
    description: "Unlimited AI replies"
  }
};

const AdminPlanTierPage = () => {
  const { planUsers, fetchPlanUsers, updateUserPlanTier, loading, planUsersLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [sortConfig, setSortConfig] = useState({ key: "username", direction: "asc" });
  const [userToChange, setUserToChange] = useState(null);
  const [selectedTier, setSelectedTier] = useState("");

  useEffect(() => {
    fetchPlanUsers();
    const intervalId = setInterval(fetchPlanUsers, 30000);
    return () => clearInterval(intervalId);
  }, [fetchPlanUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const safePlanUsers = Array.isArray(planUsers) ? planUsers.filter(u => u && u.id) : [];

  const filteredUsers = useMemo(() => {
    let result = safePlanUsers.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [planUsers, searchTerm, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handlePlanTierChange = async () => {
    if (!userToChange || !selectedTier) return;
    
    try {
      await updateUserPlanTier(userToChange.username, selectedTier);
      toast.success(`Plan tier updated to ${selectedTier} for ${userToChange.username}`);
      setUserToChange(null);
      setSelectedTier("");
    } catch (error) {
      toast.error("Failed to update plan tier");
    }
  };

  const getPlanBadge = (tier) => {
    const info = PLAN_INFO[tier] || PLAN_INFO.BASIC;
    const Icon = info.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${info.color}-100 text-${info.color}-700`}>
        <Icon size={12} />
        {info.name}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Plan Tier Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage AI auto-reply plan tiers for all users</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 ${viewMode === "table" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    <button 
                      onClick={() => handleSort("username")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      User <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    <button 
                      onClick={() => handleSort("role")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Role <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Reset In</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {planUsersLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.username}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "MANAGER" ? "bg-purple-100 text-purple-700" :
                          user.role === "REVIEWER" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getPlanBadge(user.planTier || "BASIC")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600 text-sm">
                          {user.aiReplyCount || 0} / {PLAN_INFO[user.planTier || "BASIC"].maxPerHour === Infinity ? "∞" : PLAN_INFO[user.planTier || "BASIC"].maxPerHour}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Clock size={12} />
                          {user.hoursUntilReset ? user.hoursUntilReset.toFixed(1) : 12}h
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setUserToChange(user);
                            setSelectedTier(user.planTier || "BASIC");
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Change Plan
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <AlertDialog open={!!userToChange} onOpenChange={() => setUserToChange(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Plan Tier</AlertDialogTitle>
              <AlertDialogDescription>
                Select a new plan tier for {userToChange?.username}. This will reset their AI usage count.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-3 py-4">
              {["BASIC", "PRO", "ENTERPRISE"].map((tier) => {
                const info = PLAN_INFO[tier];
                const Icon = info.icon;
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedTier === tier 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={`text-${info.color}-600`} />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{info.name}</p>
                        <p className="text-gray-500 text-xs">{info.description}</p>
                      </div>
                    </div>
                    {selectedTier === tier && (
                      <CheckCircle2 size={20} className="text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePlanTierChange}>
                Update Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminPlanTierPage;