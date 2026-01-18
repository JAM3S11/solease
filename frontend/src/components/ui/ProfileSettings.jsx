import React from 'react'
import { motion } from "framer-motion";
import { User, Mail, MapPin, Phone, Globe, ShieldCheck, Fingerprint, Save } from "lucide-react";

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
      {role === 'client' && (
        <label className='flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1'>
          {Icon && <Icon size={14} />}
          {label}
        </label>
      )}
      {role === 'admin' && (
        <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>{label}</label>
      )}
      <input
        {...props}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
          ${disabled
            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-gray-400 cursor-not-allowed'
            : role === 'client'
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm text-gray-700 dark:text-gray-200'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'
          }`}
      />
    </div>
  );

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto ${role === 'client' ? 'space-y-8' : ''}`}>

      {/* Header */}
      <header className='flex flex-col items-start space-y-2 mb-8'>
        <h2 className={`font-bold text-gray-900 dark:text-white tracking-tight ${
          role === 'client' ? 'text-3xl font-black' : 'text-2xl md:text-3xl'
        }`}>
          {role === 'client' ? 'Account Settings' : 'Profile'}
        </h2>
        <p className={`font-normal text-gray-500 dark:text-gray-400 ${
          role === 'client' ? 'font-medium' : 'text-sm sm:text-base'
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
          className='relative overflow-hidden w-full flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl rounded-[2rem] p-8 text-white group mb-8'>

          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-inner">
              <Fingerprint size={40} className="text-white" />
            </div>
            <div>
              <h2 className='text-2xl font-black tracking-wide uppercase'>
                {user?.name || user?.username}
              </h2>
              <div className="flex items-center gap-2 mt-1 opacity-80">
                <ShieldCheck size={16} />
                <span className="text-sm font-bold tracking-tighter">
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
          className='w-full flex flex-col items-start bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl mb-8 p-6'
        >
          <h2 className='text-lg sm:text-xl font-black text-gray-800 dark:text-white tracking-tight uppercase'>
            {user?.name || user?.username}
          </h2>
          <p className='text-xs font-bold text-blue-500 mt-1 tracking-wider'>
            {role.toUpperCase()} ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
          </p>
        </motion.div>
      )}

      {/* Information Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${role === 'admin' ? 'mb-8' : ''}`}
      >

        {/* Personal Information Card */}
        <motion.div
          initial={role === 'client' ? { opacity: 0, x: -20 } : { opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          className={`space-y-6 ${role === 'client'
            ? 'bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-700'
          }`}
        >

          {role === 'client' && (
            <div className="border-b border-gray-50 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <User size={20} className="text-blue-500" /> Personal Info
              </h3>
            </div>
          )}

          {role === 'admin' && (
            <p className='text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3'>
              Personal Information
            </p>
          )}

          <div className='space-y-4'>
            <ProfileInput
              label={role === 'client' ? 'Full Name' : 'Full Name'}
              icon={role === 'client' ? User : null}
              name="name"
              value={personalData.name || ""}
              onChange={onPersonalChange}
            />
            <ProfileInput
              label={role === 'client' ? 'Email Address' : 'Email'}
              icon={role === 'client' ? Mail : null}
              disabled
              value={personalData.email || ""}
            />
            <div className={role === 'client' ? "grid grid-cols-2 gap-4" : ""}>
              <ProfileInput
                label={role === 'client' ? 'Account Role' : 'Role'}
                disabled
                value={personalData.role || ""}
              />
              <ProfileInput
                label={role === 'client' ? 'Account Status' : 'Status'}
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
            ? 'bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-700'
          }`}
        >

          {role === 'client' && (
            <div className="border-b border-gray-50 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MapPin size={20} className="text-indigo-500" /> Contact Details
              </h3>
            </div>
          )}

          {role === 'admin' && (
            <p className='text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3'>
              Contact Information
            </p>
          )}

          <div className='space-y-4'>
            <ProfileInput
              label={role === 'client' ? 'Physical Address' : 'Address'}
              icon={role === 'client' ? MapPin : null}
              name="address"
              value={contactData.address || ""}
              onChange={onContactChange}
            />
            <div className={role === 'client' ? 'flex gap-4' : 'grid grid-cols-2 gap-4'}>
              <ProfileInput
                label="Country"
                icon={role === 'client' ? Globe : null}
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
              label={role === 'client' ? 'Telephone Number' : 'Telephone Number'}
              icon={role === 'client' ? Phone : null}
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
        className={`flex ${role === 'client' ? 'justify-center md:justify-end' : 'justify-end'} pt-4`}
      >
        <button
          onClick={onSave}
          disabled={loading}
          className={`group flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 ${
            role === 'admin' ? 'px-8 py-3.5' : ''
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
              {role === 'client' ? 'Save and Continue' : 'Save and Continue'}
            </>
          )}
        </button>
      </motion.div>

    </div>
  );
};

export default ProfileSettings;