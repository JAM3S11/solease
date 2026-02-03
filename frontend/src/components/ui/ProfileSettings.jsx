import React from 'react'
import { motion } from "framer-motion";
import { User, Mail, MapPin, Phone, Globe, ShieldCheck, Fingerprint, Save, Lock } from "lucide-react";

const ProfileSettings = ({
  role = 'client',
  user,
  personalData,
  contactData,
  onPersonalChange,
  onContactChange,
  onSave,
  loading
}) => {

  // Input Field Component for consistency
  const ProfileInput = ({ label, icon: Icon, disabled, ...props }) => (
    <div className="w-full">
      <label className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1'>
        {Icon && <Icon size={14} className="text-blue-600 dark:text-blue-400" />}
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
          ${disabled
            ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-md outline-none shadow-sm text-slate-700 dark:text-slate-200'
          }`}
      />
    </div>
  );

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto ${role === 'client' ? 'space-y-8' : ''}`}>

      {/* Header */}
      <header className='flex flex-col items-start space-y-3 mb-8'>
        <h2 className={`font-bold text-slate-900 dark:text-white tracking-tight ${
          role === 'client' ? 'text-3xl font-black' : 'text-2xl md:text-3xl'
        }`}>
          {role === 'client' ? 'Account Settings' : 'Profile Settings'}
        </h2>
        <p className={`font-normal text-slate-600 dark:text-slate-400 ${
          role === 'client' ? 'font-medium text-sm' : 'text-sm sm:text-base'
        }`}>
          {role === 'client'
            ? 'Manage your personal identity, contact details, and account security.'
            : 'Manage your personal information and account settings'
          }
        </p>
      </header>

      {/* User Identity Card */}
      {role === 'client' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative overflow-hidden w-full flex items-center bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg rounded-2xl p-8 text-white group mb-8'>

          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-inner">
              <Fingerprint size={40} className="text-white" />
            </div>
            <div>
              <h2 className='text-2xl font-bold tracking-wide uppercase'>
                {user?.name || user?.username}
              </h2>
              <div className="flex items-center gap-2 mt-2 opacity-90">
                <ShieldCheck size={16} className="text-blue-100" />
                <span className="text-sm font-semibold tracking-tight">
                  {role === 'client' ? 'CLIENT' : 'ADMIN'} ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full flex flex-col items-start bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800/40 dark:to-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm rounded-2xl mb-8 p-6'
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-900/30 rounded-lg">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight'>
                {user?.name || user?.username}
              </h2>
              <p className='text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 tracking-wider'>
                {role.toUpperCase()} ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Information Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${role === 'admin' ? 'mb-8' : ''}`}
      >

        {/* Personal Information Card */}
        <motion.div
          initial={role === 'client' ? { opacity: 0, x: -20 } : { opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          className={`space-y-6 ${role === 'client'
            ? 'bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700'
            : 'bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm'
          }`}
        >

          {/* Section Header - Unified Styling */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <User size={20} className="text-blue-600 dark:text-blue-400" /> 
              Personal Information
            </h3>
          </div>

          <div className='space-y-4'>
            <ProfileInput
              label='Full Name'
              icon={User}
              name="name"
              value={personalData.name || ""}
              onChange={onPersonalChange}
            />
            <ProfileInput
              label='Email Address'
              icon={Mail}
              disabled
              value={personalData.email || ""}
            />
            <div className={role === 'client' ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"}>
              <ProfileInput
                label='Account Role'
                disabled
                value={personalData.role || ""}
              />
              <ProfileInput
                label='Account Status'
                disabled
                value={personalData.status || ""}
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Information Card */}
        <motion.div
          initial={role === 'client' ? { opacity: 0, x: 20 } : { opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          className={`space-y-6 ${role === 'client'
            ? 'bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700'
            : 'bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm'
          }`}
        >

          {/* Section Header - Unified Styling */}
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <MapPin size={20} className="text-blue-600 dark:text-blue-400" /> 
              Contact Details
            </h3>
          </div>

          <div className='space-y-4'>
            <ProfileInput
              label='Physical Address'
              icon={MapPin}
              name="address"
              value={contactData.address || ""}
              onChange={onContactChange}
            />
            <div className='grid grid-cols-2 gap-4'>
              <ProfileInput
                label="Country"
                icon={Globe}
                name="country"
                value={contactData.country || ""}
                onChange={onContactChange}
              />
              <ProfileInput
                label="County"
                name="county"
                value={contactData.county || ""}
                onChange={onContactChange}
              />
            </div>
            <ProfileInput
              label='Telephone Number'
              icon={Phone}
              name="telephoneNumber"
              value={contactData.telephoneNumber ?? ""}
              onChange={onContactChange}
            />
           </div>
        </motion.div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex ${role === 'client' ? 'justify-center md:justify-end' : 'justify-end'} pt-6`}
      >
        <button
          onClick={onSave}
          disabled={loading}
          className={`group flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold shadow-md hover:shadow-lg dark:shadow-none transition-all active:scale-95 ${
            role === 'admin' ? '' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {role === 'client' ? 'Syncing...' : 'Updating...'}
            </span>
          ) : (
            <>
              <Save size={18} className="group-hover:scale-110 transition-transform" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>

    </div>
  );
};

export default ProfileSettings;