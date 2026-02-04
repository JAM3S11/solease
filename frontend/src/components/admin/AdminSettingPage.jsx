import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import ProfileSettings from '../ui/ProfileSettings'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
    // Only update if fields are empty to avoid overwriting user input
    if(personal) {
      setPersonalData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(personal).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }));
    }
    if(contact) {
      setContactData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(contact).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }));
    }
  }, [personal, contact]);

  const handlePersonalChange = (e) => 
    setPersonalData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleContactChange = (e) => 
    setContactData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

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
        {/* Header
        <motion.div variants={itemVariants} className='flex flex-col items-start space-y-1 mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100'>
            Profile
          </h2>
          <p className='text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400'>
            Manage your personal information and account settings
          </p>
        </motion.div>

        /// User Card
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
        </motion.div> */}

        {/* Profile Settings */}
        <ProfileSettings
          role="admin"
          user={user}
          personalData={personalData}
          contactData={contactData}
          onPersonalChange={handlePersonalChange}
          onContactChange={handleContactChange}
          onSave={handleSave}
          loading={loading}
        />
      </motion.div>
    </DashboardLayout>
  )
}

export default AdminSettingPage