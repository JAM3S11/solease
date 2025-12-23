import React, { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { 
    ChevronsUpDown, 
    Check, 
    MapPin, 
    AlertCircle, 
    Type, 
    AlignLeft, 
    Send,
    User
} from 'lucide-react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const AdminNewTicketPage = () => {
    const { user } = useAuthenticationStore();
    const { createTicket, loading, error } = useTicketStore();

    const [ formData, setFormData ] = useState({
        location: "",
        issueType: "",
        subject: "",
        description: "",
        urgency: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.location || !formData.issueType || !formData.subject || !formData.description || !formData.urgency){
            toast.error("Please fill in all details...", { duration: 1500 });
            return;
        }

        const ticketData = { ...formData, raisedBy: user?._id };
        await createTicket(ticketData);
        
        toast.success("Ticket submitted successfully");
        navigate("/admin-dashboard/admin-tickets");
    }

    const issueOptions = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access"];
    const urgencyOptions = ["Low", "Medium", "High", "Critical"];

  return (
    <DashboardLayout>
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50/50 dark:bg-transparent">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-3xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Create Ticket
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Submit a new request to the IT team.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {user?.username || "Guest User"}
                    </span>
                </div>
            </motion.div>

            {/* Form Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
                <form className="p-8 md:p-12 space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Server Room"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-2xl transition-all outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                        </motion.div>

                        {/* Issue Type */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Issue Type</label>
                            <Listbox value={formData.issueType} onChange={(val) => handleSelectChange('issueType', val)}>
                                <div className="relative">
                                    <ListboxButton className="relative w-full pl-4 pr-10 py-3.5 text-left bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 outline-none transition-all">
                                        <span className={`block truncate ${!formData.issueType ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                            {formData.issueType || "Select Type"}
                                        </span>
                                        <ChevronsUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </ListboxButton>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <ListboxOptions className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden outline-none">
                                            {issueOptions.map((opt) => (
                                                <ListboxOption key={opt} value={opt} className={({ active }) => `relative cursor-pointer select-none py-4 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{opt}</span>
                                                            {selected && <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />}
                                                        </>
                                                    )}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Transition>
                                </div>
                            </Listbox>
                        </motion.div>
                    </div>

                    {/* Subject */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Subject</label>
                        <div className="relative group">
                            <Type className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <textarea 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                rows="1"
                                placeholder="Summary of the issue..."
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-2xl transition-all outline-none text-gray-900 dark:text-white resize-none"
                            />
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Detailed Description</label>
                        <div className="relative group">
                            <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Explain what happened..."
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-2xl transition-all outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </motion.div>

                    {/* Urgency */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                    >
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Urgency Level</label>
                        <div className="flex flex-wrap gap-3">
                            {urgencyOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSelectChange('urgency', opt)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                                        formData.urgency === opt 
                                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:border-gray-200'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-6"
                    >
                        <button 
                            disabled={loading}
                            className="group relative w-full py-4 bg-blue-500 dark:bg-blue-600 rounded-2xl font-bold text-white overflow-hidden transition-all hover:bg-blue-800 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Submit Request</span>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400"
                            >
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    </DashboardLayout>
  )
}

export default AdminNewTicketPage