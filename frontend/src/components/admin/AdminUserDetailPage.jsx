import React, { useState, useEffect, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router";
import { X, ChevronDown, Check } from "lucide-react";
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

  const roles = ["Client", "Service Desk", "IT Support", "Manager"];
  const statuses = ["Pending", "Active", "Rejected"];

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
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">User Details</h3>
            <p className="text-sm text-gray-400 mt-1">Configure user role and account status</p>
          </div>
          <Link
            to="/admin-dashboard/users"
            onClick={(e) => {
              if (!window.confirm("Discard changes?")) e.preventDefault();
              else {
                setRole(user.role);
                setStatus(user.status);
              }
            }}
            className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </Link>
        </motion.div>

        {/* Details Panel */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 p-8 w-full max-w-2xl mx-auto rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl"
        >
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: "Username", value: user.username },
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</dt>
                <dd className="text-base font-bold text-gray-800 dark:text-white">{item.value}</dd>
              </div>
            ))}
          </dl>

          <hr className="border-gray-50 dark:border-gray-700 mb-8" />

          {/* Listbox Selectors */}
          <div className="space-y-6">
            {/* Role Listbox */}
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Update Role</label>
              <Listbox value={role} onChange={setRole}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-xl bg-gray-50 dark:bg-gray-900/50 py-3.5 pl-4 pr-10 text-left border border-transparent focus:border-blue-500 focus:outline-none text-sm font-bold text-gray-800 dark:text-white transition-all">
                    <span className="block truncate">{role}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl border border-gray-100 dark:border-gray-700 focus:outline-none">
                      {roles.map((r) => (
                        <ListboxOption key={r} value={r} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-black text-blue-600' : 'font-medium'}`}>{r}</span>
                              {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={16} /></span>}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Status Listbox */}
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Update Status</label>
              <Listbox value={status} onChange={setStatus}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-xl bg-gray-50 dark:bg-gray-900/50 py-3.5 pl-4 pr-10 text-left border border-transparent focus:border-blue-500 focus:outline-none text-sm font-bold text-gray-800 dark:text-white transition-all">
                    <span className="block truncate">{status}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl border border-gray-100 dark:border-gray-700 focus:outline-none">
                      {statuses.map((s) => (
                        <ListboxOption key={s} value={s} className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-black text-blue-600' : 'font-medium'}`}>{s}</span>
                              {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={16} /></span>}
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

          {/* Action Button */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center"
            >
              {loading ? "Processing..." : "Save Profile Changes"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetailPage;