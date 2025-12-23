import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { User, Mail, Shield, Activity, MapPin, Globe, Phone, Save, Fingerprint } from "lucide-react";

const ItSupportProfile = () => {
  const { user } = useAuthenticationStore();
  const { personal, contact, getProfile, putProfile, loading, setUser } = useProfileStore();

  const [ personalData, setPersonalData ] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  })

  const [ contactData, setContactData ] = useState({
    address: "",
    country: "",
    county: "",
    telephoneNumber: "",
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if(personal) setPersonalData((prev) => ({ ...prev, ...personal }));
    if(contact) setContactData((prev) => ({ ...prev, ...contact }));
  }, [personal, contact]);

  const handlePersonalChange = (e) => 
    setPersonalData({
      ...personalData,
      [e.target.name] : e.target.value,
    });

  const handleContactChange = (e) => 
    setContactData({
      ...contactData,
      [e.target.name] : e.target.value,
    });

  const handleSave = async () => {
    const res = await putProfile({
      personal: personalData,
      contact: contactData
    });
    if(res?.success){
      toast.success("Profile updated successfully!", { duration: 2000 });
      if(res?.user){
        setUser(res.user);
      }
    }
  }

  // Modern Input Helper to keep structure clean
  const ProfileInput = ({ label, icon: Icon, name, value, onChange, disabled, type = "text", placeholder }) => (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={16} />
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${disabled ? 'cursor-not-allowed bg-gray-50 dark:bg-gray-900/50 opacity-70' : 'hover:border-gray-300 dark:hover:border-gray-600'}`}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
        <div className='p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col items-start space-y-1 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 w-full'>
                <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>
                    Profile Settings
                </h2>
                <p className='text-gray-500 dark:text-gray-400 font-medium'>Manage your identity and reachability across the platform</p>
            </div>

            {/* ID Card section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full flex items-center gap-5 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20 rounded-[2rem] mb-10 p-6 text-white overflow-hidden relative'>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                    <Fingerprint size={40} className="text-white" />
                </div>
                <div className="relative z-10">
                    <h2 className='text-xl sm:text-2xl font-black tracking-tight uppercase'>
                        {user?.name || user?.username}
                    </h2>
                    <p className='text-blue-100 text-xs font-bold tracking-widest uppercase opacity-80'>
                        Support ID: #{user?._id.slice(-6).toUpperCase() || "------"}
                    </p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Information grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10'>
              
              {/* Personal Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className='bg-white dark:bg-gray-900/40 p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm'>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-gray-800 pb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                        <User size={20} />
                    </div>
                    <p className='text-lg font-black text-gray-800 dark:text-gray-100'>Personal Identity</p>
                </div>

                <div className='space-y-4'>
                  <ProfileInput label="Full Name" icon={User} name="name" value={personalData.name || ""} onChange={handlePersonalChange} placeholder="Enter full name" />
                  <ProfileInput label="Email Address" icon={Mail} name="email" value={personalData.email || ""} disabled />
                  <div className="grid grid-cols-2 gap-4">
                    <ProfileInput label="Designation" icon={Shield} name="role" value={personalData.role || ""} disabled />
                    <ProfileInput label="Profile Status" icon={Activity} name="status" value={personalData.status || ""} disabled />
                  </div>
                </div>
              </motion.div>

              {/* Contact Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-white dark:bg-gray-900/40 p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm'>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-gray-800 pb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                        <Phone size={20} />
                    </div>
                    <p className='text-lg font-black text-gray-800 dark:text-gray-100'>Contact Details</p>
                </div>

                <div className='space-y-4'>
                  <ProfileInput label="Physical Address" icon={MapPin} name="address" value={contactData.address || ""} onChange={handleContactChange} placeholder="123 IT Street, Tech City" />
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <ProfileInput label="Country" icon={Globe} name="country" value={contactData.country || ""} onChange={handleContactChange} />
                    <ProfileInput label="County / State" icon={MapPin} name="county" value={contactData.county || ""} onChange={handleContactChange} />
                  </div>
                  <ProfileInput label="Primary Phone" icon={Phone} name="telephoneNumber" value={contactData.telephoneNumber ?? ""} onChange={handleContactChange} placeholder="+254..." />
                </div>
              </motion.div>
            </div>

            {/* Action Button */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='flex justify-center md:justify-end'>
              <button
                type='button'
                onClick={handleSave}
                disabled={loading}
                className='group flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-blue-600 text-white font-black rounded-2xl transition-all hover:bg-black dark:hover:bg-blue-700 active:scale-[0.95] disabled:opacity-50 shadow-xl shadow-blue-500/10'>
                  {loading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                      <>
                        <Save size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Save Changes</span>
                      </>
                  )}
              </button>
            </motion.div>
        </div>
    </DashboardLayout>
  )
}

export default ItSupportProfile