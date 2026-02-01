import React, { useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { MapPin, Tag, Info, AlertTriangle, Send, ChevronDown, Check, Upload, X, File } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/axios";

const NewTicketForm = ({ role = 'client', navigatePath = '/client-dashboard', tickets = [] }) => {
  const { user } = useAuthenticationStore();
  const { createTicket, loading, uploadLoading } = useTicketStore();
  
  // Determine if it's the user's first ticket for the welcome message
  const showWelcome = role === 'client' && (!tickets || tickets.length === 0);

  const [formData, setFormData] = useState({
    location: "",
    issueType: "",
    subject: "",
    description: "",
    urgency: "",
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  
  const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"];
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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location || !formData.issueType || !formData.subject || !formData.description || !formData.urgency) {
      toast.error("Please fill in all the details before submitting...", { duration: 1500 });
      return;
    }
    
    try {
      let response;
      
      if (selectedFile && role === 'client') {
        setUploadPercent(0);
        const formDataToSend = new FormData();
        formDataToSend.append("location", formData.location);
        formDataToSend.append("issueType", formData.issueType);
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("urgency", formData.urgency);
        formDataToSend.append("attachment", selectedFile);
        
        response = await api.post("/ticket/create-ticket", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(progress);
          }
        });
      } else {
        response = await createTicket(formData);
      }
      
      if (response) {
        toast.success("Ticket created successfully!");
        if (role === 'client') {
          setFormData({ location: "", issueType: "", subject: "", description: "", urgency: "" });
          setSelectedFile(null);
          setFilePreview(null);
          setTimeout(() => navigate(navigatePath), 500);
        } else {
          navigate(navigatePath);
        }
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create ticket.";
      toast.error(errorMessage);
      setUploadPercent(0);
    }
  };
  
  const FormField = ({ label, children, icon: IconComp }) => (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        <IconComp size={14} className="text-blue-600 dark:text-blue-400" />
        {label}
      </label>
      {children}
    </div>
  );

  const CustomSelect = ({ label, value, options, onChange, placeholder, icon: IconComponent, openUp = false }) => (
    <FormField label={label} icon={IconComponent}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm">
            <span className={`block truncate ${!value ? "text-gray-400" : ""}`}>
              {value || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
            </span>
          </ListboxButton>
          
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions className={`absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl focus:outline-none sm:text-sm ${openUp ? "bottom-full mb-2" : ""}`}>
              {options.map((item) => (
                <ListboxOption key={item} value={item} className={({ active }) => `relative cursor-pointer select-none px-4 py-2.5 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>
                  {({ selected }) => (
                    <div className="flex items-center gap-3">
                      <span className={`flex-1 truncate ${selected ? "font-semibold" : ""}`}>{item}</span>
                      {selected && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </FormField>
  );
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Submit New Ticket</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {showWelcome ? "Let's submit your first support request and get started!" : "Fill in the details below to request technical assistance."}
            </p>
          </motion.div>
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{user?.name || "Guest User"}</span>
          </div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Location" icon={MapPin}>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Floor 4, Room 201" 
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                  />
                </FormField>
                <CustomSelect label="Issue Type" value={formData.issueType} options={ISSUE_TYPES} onChange={(val) => handleListboxChange("issueType", val)} placeholder="Select issue category" icon={Tag} />
              </div>
              
              <FormField label="Subject" icon={Info}>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Brief summary of the issue" 
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                />
              </FormField>
              
              <FormField label="Description" icon={AlertTriangle}>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="5" 
                  placeholder="Please provide detailed information about the issue, including steps to reproduce, error messages, and any other relevant details..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm resize-y"
                />
              </FormField>
              
              <div className="max-w-md">
                <CustomSelect label="Urgency Level" value={formData.urgency} options={URGENCY_LEVELS} onChange={(val) => handleListboxChange("urgency", val)} placeholder="Select urgency level" icon={AlertTriangle} openUp={true} />
              </div>
              
              {role === 'client' && (
                <FormField label="Attachments" icon={Upload}>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    {selectedFile ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {filePreview ? <img src={filePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700" /> : <File size={20} className="text-blue-600" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{selectedFile.name}</p>
                            {uploadLoading && (
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                                <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${uploadPercent}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                        <button type="button" onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                          <Upload size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload files</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images, PDF, DOC (Max 10MB)</p>
                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                      </label>
                    )}
                  </div>
                </FormField>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <button disabled={loading || uploadLoading} className="w-full md:w-auto min-w-[200px] px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group">
                {loading || uploadLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
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

export default NewTicketForm;