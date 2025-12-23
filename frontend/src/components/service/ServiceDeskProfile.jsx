import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { User, Mail, Shield, Activity, MapPin, Globe, Phone, Save } from 'lucide-react';

const ServiceDeskProfile = () => {
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

  return (
    <DashboardLayout>
        <div className='p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6'>
                <div className='space-y-1'>
                    <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>
                        Profile Settings
                    </h2>
                    <p className='text-sm font-medium text-gray-500'>Update your identity and digital workspace preferences</p>
                </div>
                
                {/* User Identity Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <div className='h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl'>
                        {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className='text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wide'>
                            {user?.name || user?.username}
                        </h2>
                        <p className='text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full inline-block mt-1'>
                            ID: #{user?._id?.slice(-6).toUpperCase()}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Information Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
              
              {/* Personal Information Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none'>
                
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-50 dark:border-gray-800'>
                    <User className='text-blue-600' size={20} />
                    <h3 className='text-lg font-black text-gray-800 dark:text-gray-200'>Personal Details</h3>
                </div>

                <div className='space-y-5'>
                  <div className="space-y-1.5">
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Full Name</label>
                    <input
                      name='name'
                      type='text'
                      value={personalData.name || ""}
                      onChange={handlePersonalChange}
                      placeholder="Enter your name"
                      className='w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all' />
                  </div>

                  <div className="space-y-1.5">
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Email Address</label>
                    <div className='relative'>
                        <input
                            name='email'
                            type='email'
                            value={personalData.email || ""}
                            className='w-full px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border-none text-sm font-bold text-gray-500 cursor-not-allowed outline-none'
                            disabled />
                        <Mail className='absolute right-4 top-3 text-gray-400' size={16} />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className="space-y-1.5">
                        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Role</label>
                        <div className='relative'>
                            <input
                                value={personalData.role || ""}
                                className='w-full px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border-none text-sm font-bold text-gray-500 cursor-not-allowed outline-none'
                                disabled />
                            <Shield className='absolute right-4 top-3 text-gray-400' size={16} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Account Status</label>
                        <div className='relative'>
                            <input
                                value={personalData.status || ""}
                                className='w-full px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border-none text-sm font-bold text-gray-500 cursor-not-allowed outline-none'
                                disabled />
                            <Activity className='absolute right-4 top-3 text-gray-400' size={16} />
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='bg-white dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none'>
                
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-50 dark:border-gray-800'>
                    <MapPin className='text-blue-600' size={20} />
                    <h3 className='text-lg font-black text-gray-800 dark:text-gray-200'>Contact Info</h3>
                </div>

                <div className='space-y-5'>
                  <div className="space-y-1.5">
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Physical Address</label>
                    <input
                      name='address'
                      type='text'
                      value={contactData.address || ""}
                      onChange={handleContactChange}
                      placeholder="e.g. 123 Tech Lane"
                      className='w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all' />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className="space-y-1.5">
                        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Country</label>
                        <div className='relative'>
                            <input
                                name='country'
                                type='text'
                                value={contactData.country || ""}
                                onChange={handleContactChange}
                                className='w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all' />
                            <Globe className='absolute right-4 top-3 text-gray-300' size={16} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>County/State</label>
                        <input
                            name='county'
                            type='text'
                            value={contactData.county || ""}
                            onChange={handleContactChange}
                            className='w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all' />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1'>Telephone Number</label>
                    <div className='relative'>
                        <input
                            name='telephoneNumber'
                            type='text'
                            value={contactData.telephoneNumber ?? ""}
                            onChange={handleContactChange}
                            placeholder="+254..."
                            className='w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all' />
                        <Phone className='absolute right-4 top-3 text-gray-300' size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Save Button */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex justify-end'>
              <button
                type='button'
                onClick={handleSave}
                disabled={loading}
                className='flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all'>
                  {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                      <><Save size={20} /> Save Changes</>
                  )}
              </button>
            </motion.div>
        </div>
    </DashboardLayout>
  )
}

export default ServiceDeskProfile