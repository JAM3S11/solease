import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const AdminSettingPage = () => {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto'
      >
        {/* Header */}
        <motion.div variants={itemVariants} className='flex flex-col items-start space-y-1 mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100'>
            Profile
          </h2>
          <p className='text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400'>
            Manage your personal information and account settings
          </p>
        </motion.div>

        {/* User Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className='w-full flex flex-col items-start bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl mb-8 p-6'
        >
          <h2 className='text-lg sm:text-xl font-black text-gray-800 dark:text-white tracking-tight uppercase'>
            {user?.name || user?.username}
          </h2>
          <p className='text-xs font-bold text-blue-500 mt-1 tracking-wider'>
            CLIENT ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
          </p>
        </motion.div>

        {/* Form Sections */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Personal Information */}
          <motion.div variants={itemVariants} className='space-y-6 bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-700'>
            <p className='text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3'>
              Personal Information
            </p>
            <div className='space-y-4'>
              {[
                { label: 'Full Name', name: 'name', type: 'text', value: personalData.name, disabled: false },
                { label: 'Email', name: 'email', type: 'email', value: personalData.email, disabled: true },
                { label: 'Role', name: 'role', type: 'text', value: personalData.role, disabled: true },
                { label: 'Status', name: 'status', type: 'text', value: personalData.status, disabled: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={field.value || ""}
                    onChange={handlePersonalChange}
                    disabled={field.disabled}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none
                      ${field.disabled 
                        ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 text-gray-400 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white'}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className='space-y-6 bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-700'>
            <p className='text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3'>
              Contact Information
            </p>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>Address</label>
                <input
                  name='address'
                  type='text'
                  value={contactData.address || ""}
                  onChange={handleContactChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>Country</label>
                  <input
                    name='country'
                    type='text'
                    value={contactData.country || ""}
                    onChange={handleContactChange}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                  />
                </div>
                <div>
                  <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>County</label>
                  <input
                    name='county'
                    type='text'
                    value={contactData.county || ""}
                    onChange={handleContactChange}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5'>Telephone Number</label>
                <input
                  name='telephoneNumber'
                  type='text'
                  value={contactData.telephoneNumber || ""}
                  onChange={handleContactChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Button */}
        <motion.div 
          variants={itemVariants}
          className='flex justify-end pt-4'
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type='button'
            onClick={handleSave}
            disabled={loading}
            className='px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:bg-gray-300 transition-all flex items-center gap-2'
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : "Save and Continue"}
          </motion.button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

export default AdminSettingPage