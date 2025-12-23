import React, { useState, Fragment } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore';
import { useNavigate } from 'react-router';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronDown, Check, MapPin, Type, MessageSquare, AlertCircle, Send } from "lucide-react";
import toast from 'react-hot-toast';

const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

const ItSupportNewTicket = () => {
    const { user } = useAuthenticationStore();
    const { createTicket, loading, error } = useTicketStore();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        location: "",
        issueType: "",
        subject: "",
        description: "",
        urgency: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.location || !formData.issueType || !formData.subject || !formData.description || !formData.urgency){
            toast.error("Please fill in all the details before submitting...", { duration: 1000 });
            return;
        }

        const ticketData = { ...formData, raisedBy: user?._id };
        await createTicket(ticketData);

        setFormData({ location: "", issueType: "", subject: "", description: "", urgency: "" });
        toast.success("Thank you raising your concern. We shall attend to it shortly");
        navigate("/itsupport-dashboard");
    }

    const CustomSelect = ({ label, value, options, onChange, placeholder, icon: Icon }) => (
        <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <ListboxButton className="relative w-full cursor-default rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 py-3 pl-11 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold shadow-sm">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <Icon size={18} />
                        </span>
                        <span className={`block truncate ${!value ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {value || placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </span>
                    </ListboxButton>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl ring-1 ring-black/5 z-50 backdrop-blur-xl">
                            {options.map((opt, idx) => (
                                <ListboxOption
                                    key={idx}
                                    className={({ active }) => `relative cursor-default select-none py-3 pl-10 pr-4 text-sm transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-200'}`}
                                    value={opt}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>{opt}</span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );

  return (
    <DashboardLayout>
        <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Submit New Ticket</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Complete the form below to reach our IT experts</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Agent: <span className="opacity-70 font-medium">{user?.username || "User"}</span>
                    </p>
                </div>
            </div>

            {/* Modern Form Card */}
            <div className="bg-white dark:bg-gray-900/40 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 p-8 sm:p-10 backdrop-blur-sm">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                                    placeholder="Office / Floor / Cubicle"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Issue Type */}
                        <CustomSelect 
                            label="Issue Category" 
                            value={formData.issueType} 
                            options={ISSUE_TYPES} 
                            icon={Type}
                            onChange={(val) => handleSelectChange('issueType', val)}
                            placeholder="Select Category" 
                        />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Brief Summary</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <textarea 
                                id='subject' name='subject' value={formData.subject} onChange={handleChange}
                                className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:font-normal' 
                                placeholder='High-level summary of the issue' rows="2"
                            ></textarea>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Detailed Breakdown</label>
                        <textarea 
                            id='description' name='description' value={formData.description} onChange={handleChange}
                            className='w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400' 
                            placeholder='Provide as much detail as possible to help us triage faster...' rows="5"
                        ></textarea>
                    </div>

                    {/* Urgency */}
                    <CustomSelect 
                        label="Priority Level" 
                        value={formData.urgency} 
                        options={URGENCY_LEVELS} 
                        icon={AlertCircle}
                        onChange={(val) => handleSelectChange('urgency', val)}
                        placeholder="Define Urgency" 
                    />

                    <div className="pt-4">
                        <button 
                            disabled={loading} 
                            className='group relative w-full overflow-hidden bg-blue-600 text-white py-4 rounded-2xl font-black text-lg transition-all hover:bg-blue-700 active:scale-[0.98] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3'
                        >
                            {loading ? (
                                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Deploy Ticket</span>
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                    {error && <p className='text-red-500 text-xs font-bold mt-2 text-center uppercase tracking-widest'>{error}</p>}
                </form>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default ItSupportNewTicket