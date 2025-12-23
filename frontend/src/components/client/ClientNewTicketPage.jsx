import React, { useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { MapPin, Tag, Info, AlertTriangle, Send, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";

const ClientNewTicketPage = () => {
  const { user } = useAuthenticationStore();
  const { createTicket, loading, error } = useTicketStore();

  const [formData, setFormData] = useState({
    location: "",
    issueType: "",
    subject: "",
    description: "",
    urgency: "",
  });

  const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access"];
  const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleListboxChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location || !formData.issueType || !formData.subject || !formData.description || !formData.urgency) {
      toast.error("Please fill in all the details before submitting...", { duration: 1500 });
      return;
    }

    const ticketData = {
      ...formData,
      raisedBy: user?._id,
    };

    await createTicket(ticketData);

    setFormData({
      location: "",
      issueType: "",
      subject: "",
      description: "",
      urgency: "",
    });

    toast.success("Thank you for raising your concern. We shall attend to it shortly");
    navigate("/client-dashboard");
  };

  // Improved CustomSelect with "Open Upwards" capability for Urgency
  const CustomSelect = ({ label, value, options, onChange, placeholder, icon: Icon, openUp = false }) => (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        <Icon size={16} className="text-blue-500" />
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-default rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm shadow-sm">
            <span className={`block truncate ${!value ? "text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
              {value || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions 
              // anchor="top start" is a Headless UI v2 feature, but we'll use CSS for compatibility
              className={`absolute z-[100] w-full min-w-[200px] overflow-auto rounded-xl bg-white dark:bg-gray-800 py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-100 dark:border-gray-700 ${
                openUp ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            >
              {options.map((item) => (
                <ListboxOption
                  key={item}
                  className={({ active }) =>
                    `relative cursor-default select-none py-3 pl-10 pr-4 ${
                      active ? "bg-blue-50 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100" : "text-gray-900 dark:text-gray-300"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                        {item}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Submit New Ticket
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Describe your issue in detail to help us solve it quickly
            </p>
          </motion.div>
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || "GU"}
            </div>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {user?.username || "Guest User"}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800/50 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-700"
        >
          <form className="p-6 md:p-10 space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={16} className="text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Floor 4, Room 201"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <CustomSelect
                label="Issue Type"
                value={formData.issueType}
                options={ISSUE_TYPES}
                onChange={(val) => handleListboxChange("issueType", val)}
                placeholder="Select issue category"
                icon={Tag}
              />
            </div>

            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Info size={16} className="text-blue-500" />
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Short summary of the problem"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <AlertTriangle size={16} className="text-blue-500" />
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Please explain the issue step-by-step..."
                rows="5"
              ></textarea>
            </div>

            {/* URGENCY: Set openUp={true} to fix the "Critical" visibility issue */}
            <div className="max-w-md">
              <CustomSelect
                label="Urgency Level"
                value={formData.urgency}
                options={URGENCY_LEVELS}
                onChange={(val) => handleListboxChange("urgency", val)}
                placeholder="How urgent is this?"
                icon={AlertTriangle}
                openUp={true} 
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <button
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ClientNewTicketPage;