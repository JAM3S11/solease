import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { User, Mail, MapPin, Phone, Globe, ShieldCheck, Fingerprint, Save } from "lucide-react";

const ClientProfilePage = () => {
  const { user } = useAuthenticationStore();
  const { personal, contact, getProfile, putProfile, loading, setUser } = useProfileStore();

  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  })

  const [contactData, setContactData] = useState({
    address: "",
    country: "",
    county: "",
    telephoneNumber: "",
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (personal) setPersonalData((prev) => ({ ...prev, ...personal }));
    if (contact) setContactData((prev) => ({ ...prev, ...contact }));
  }, [personal, contact]);

  const handlePersonalChange = (e) =>
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value,
    });

  const handleContactChange = (e) =>
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });

  const handleSave = async () => {
    const res = await putProfile({
      personal: personalData,
      contact: contactData
    });
    if (res?.success) {
      toast.success("Profile updated successfully!", { duration: 2000 });
      if (res?.user) {
        setUser(res.user);
      }
    }
  }

  // Input Field Component for consistency
  const ProfileInput = ({ label, icon: Icon, disabled, ...props }) => (
    <div className="w-full">
      <label className='flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1'>
        {Icon && <Icon size={14} />}
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 
          ${disabled 
            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm text-gray-700 dark:text-gray-200'
          }`}
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className='p-6 lg:p-10 max-w-6xl mx-auto space-y-8'>
        
        {/* Header */}
        <header className='flex flex-col items-start space-y-2'>
          <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>
            Account Settings
          </h2>
          <p className='text-gray-500 dark:text-gray-400 font-medium'>
            Manage your personal identity, contact details, and account security.
          </p>
        </header>

        {/* User Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative overflow-hidden w-full flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl rounded-[2rem] p-8 text-white group'>
          
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
                <span className="text-sm font-bold tracking-tighter">Client ID: #{user?._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-6'>
            
            <div className="border-b border-gray-50 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <User size={20} className="text-blue-500" /> Personal Info
              </h3>
            </div>

            <div className='space-y-4'>
              <ProfileInput 
                label="Full Name" 
                icon={User}
                name="name"
                value={personalData.name || ""}
                onChange={handlePersonalChange}
              />
              <ProfileInput 
                label="Email Address" 
                icon={Mail}
                disabled
                value={personalData.email || ""}
              />
              <div className="grid grid-cols-2 gap-4">
                <ProfileInput label="Account Role" disabled value={personalData.role || ""} />
                <ProfileInput label="Account Status" disabled value={personalData.status || ""} />
              </div>
            </div>
          </motion.div>

          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-6'>
            
            <div className="border-b border-gray-50 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MapPin size={20} className="text-indigo-500" /> Contact Details
              </h3>
            </div>

            <div className='space-y-4'>
              <ProfileInput 
                label="Physical Address" 
                icon={MapPin}
                name="address"
                value={contactData.address || ""}
                onChange={handleContactChange}
              />
              <div className='flex gap-4'>
                <ProfileInput 
                  label="Country" 
                  icon={Globe}
                  name="country"
                  value={contactData.country || ""}
                  onChange={handleContactChange}
                />
                <ProfileInput 
                  label="County" 
                  name="county"
                  value={contactData.county || ""}
                  onChange={handleContactChange}
                />
              </div>
              <ProfileInput 
                label="Telephone Number" 
                icon={Phone}
                name="telephoneNumber"
                value={contactData.telephoneNumber ?? ""}
                onChange={handleContactChange}
              />
            </div>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex justify-center md:justify-end pt-4'>
          <button
            onClick={handleSave}
            disabled={loading}
            className='group flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95'>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            )}
            {loading ? "Syncing..." : "Save and Continue"}
          </button>
        </motion.div>

      </div>
    </DashboardLayout>
  )
}

export default ClientProfilePage;