import React, { useState, Fragment } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { ChevronDown, MapPin, AlertCircle, Layout, Send } from 'lucide-react';

const ServiceDeskNewTicket = () => {
    const { user } = useAuthenticationStore();
    const { createTicket, loading, error } = useTicketStore();

    const [ formData, setFormData ] = useState({
        location: "",
        issueType: "",
        subject: "",
        description: "",
        urgency: "",
    });

    const ISSUE_TYPES = [
        "Hardware issue",
        "Software issue",
        "Network Connectivity",
        "Account Access",
    ];
      
    const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];      

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleListboxChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]:value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.location || !formData.issueType || !formData.subject || !formData.description || !formData.urgency){
            toast.error("Please fill in all the details before submitting...", { duration: 2000 });
            return;
        }

        const ticketData = {
            ...formData,
            raisedBy: user?._id
        };

        await createTicket(ticketData);

        setFormData({
            location: "",
            issueType: "",
            subject: "",
            description: "",
            urgency: "",
        });

        toast.success("Thank you for raising your concern.");
        navigate("/servicedesk-dashboard");
    }

  return (
    <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Modern Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Submit New Ticket
                    </h1>
                    <p className="text-sm font-medium text-gray-500 italic">
                        Detailed descriptions help our team resolve issues 2x faster.
                    </p>
                </div>
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Requester</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {user?.username ? `@${user.username}` : "Guest User"}
                    </p>
                </div>
            </div>

            {/* Premium Form Container */}
            <div className="relative group">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                
                <div className="relative bg-white dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Location */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <MapPin size={14} /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Nairobi Office, Room 104"
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:font-medium"
                                />
                            </div>

                            {/* Issue Type Listbox */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <Layout size={14} /> Issue Category
                                </label>
                                <Listbox value={formData.issueType} onChange={(v) => handleListboxChange("issueType", v)}>
                                    <div className="relative">
                                        <ListboxButton className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-left text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all flex items-center justify-between">
                                            <span className={!formData.issueType ? "text-gray-400 font-medium" : "text-gray-900 dark:text-gray-100"}>
                                                {formData.issueType || "Select category"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </ListboxButton>
                                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                            <ListboxOptions className="absolute z-50 mt-2 w-full rounded-2xl bg-white dark:bg-gray-800 py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden border border-gray-100 dark:border-gray-700">
                                                {ISSUE_TYPES.map((type) => (
                                                    <ListboxOption key={type} value={type} className={({ active }) => `cursor-pointer px-5 py-3 text-sm font-bold transition-colors ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-gray-700 dark:text-gray-300"}`}>
                                                        {type}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                <AlertCircle size={14} /> Subject
                            </label>
                            <input 
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Briefly describe the emergency"
                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Provide as much detail as possible (errors, steps to reproduce, etc.)"
                                className="w-full px-5 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-gray-800/50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Urgency Listbox */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Priority Level</label>
                            <Listbox value={formData.urgency} onChange={(v) => handleListboxChange("urgency", v)}>
                                <div className="relative">
                                    <ListboxButton className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-left text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between">
                                        <span className={!formData.urgency ? "text-gray-400 font-medium" : "text-gray-900 dark:text-gray-100"}>
                                            {formData.urgency || "How urgent is this?"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </ListboxButton>
                                    <Transition as={Fragment} enter="transition duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100">
                                        <ListboxOptions className="absolute z-50 mt-2 w-full rounded-2xl bg-white dark:bg-gray-800 py-2 shadow-2xl border border-gray-100 dark:border-gray-700">
                                            {URGENCY_LEVELS.map((urgency) => (
                                                <ListboxOption key={urgency} value={urgency} className={({ active }) => `cursor-pointer px-5 py-3 text-sm font-bold ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "text-gray-700 dark:text-gray-300"}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            urgency === 'Critical' ? 'bg-red-700 motion-safe:animate-ping'
                                                            : urgency === 'High' ? 'bg-purple-700 animate-bounce'
                                                            : urgency === 'Medium' ? 'bg-orange-700 animate-pulse'
                                                            : 'bg-gray-500 animate-spin'}`} />
                                                        {urgency}
                                                    </div>
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4">
                            <button 
                                disabled={loading} 
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Submit Concern <Send size={18} /></>
                                )}
                            </button>
                            
                            {error && (
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-100">
                                    Error: {error}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default ServiceDeskNewTicket;