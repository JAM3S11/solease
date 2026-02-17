import React, { useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { MapPin, Tag, Info, AlertTriangle, Send, ChevronDown, Check, Upload, X, File, Lightbulb, Clock, User, CheckCircle, MessageSquare, Eye } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/axios";

const NewTicketForm = ({ role = 'client', navigatePath = '/client-dashboard', tickets = [] }) => {
  const { user } = useAuthenticationStore();
  const { createTicket, loading, uploadLoading } = useTicketStore();
  
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
  
  const ISSUE_TYPE_INFO = {
    "Hardware issue": { desc: "Physical devices like computers, monitors, printers, keyboards, etc.", icon: "💻" },
    "Software issue": { desc: "Applications, programs, operating systems, or installation problems.", icon: "📀" },
    "Network Connectivity": { desc: "Internet, WiFi, VPN, or network access issues.", icon: "📶" },
    "Account Access": { desc: "Login problems, password resets, or permission issues.", icon: "🔐" },
    "Other": { desc: "Issues that don't fit the categories above.", icon: "📋" },
  };
  
  const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];
  
  const URGENCY_INFO = {
    "Low": { 
      desc: "Minor issue with no immediate impact", 
      example: "Cosmetic issues, feature requests, minor inconveniences",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
      icon: "🟢"
    },
    "Medium": { 
      desc: "Affects work but a workaround exists", 
      example: "Slow performance, non-critical features not working",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      icon: "🟡"
    },
    "High": { 
      desc: "Significant impact, needs quick resolution", 
      example: "Main feature broken, multiple users affected",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      icon: "🟠"
    },
    "Critical": { 
      desc: "Complete blockage, emergency situation", 
      example: "System down, security breach, data loss",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      icon: "🔴"
    },
  };

  const TIPS = [
    { icon: MessageSquare, title: "Be Specific", desc: "Include exact error messages and when the issue started" },
    { icon: User, title: "Mention Impact", desc: "Tell us if others are experiencing the same issue" },
    { icon: File, title: "Attach Screenshots", desc: "Visual evidence helps us understand faster" },
    { icon: Clock, title: "Include Timeline", desc: "When did it start? What were you doing at the time?" },
  ];

  const STEPS_AFTER_SUBMIT = [
    { icon: CheckCircle, title: "Confirmation", desc: "You'll receive a confirmation with your ticket ID" },
    { icon: Eye, title: "Review", desc: "Our team will review and assign priority to your ticket" },
    { icon: MessageSquare, title: "Response", desc: "You'll be notified once a reviewer starts working on it" },
  ];
  
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
  
  const FormField = ({ label, children, icon: IconComp, helper }) => (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        <IconComp size={14} className="text-blue-600 dark:text-blue-400" />
        {label}
      </label>
      {children}
      {helper && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</p>}
    </div>
  );

  const UrgencySelect = ({ label, value, options, onChange, placeholder, icon: IconComponent }) => {
    const selectedUrgency = URGENCY_INFO[value];
    
    return (
      <FormField label={label} icon={IconComponent}>
        <Listbox value={value} onChange={onChange}>
          <div className="relative">
            <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm">
              <span className={`flex items-center gap-2 ${!value ? "text-gray-400" : ""}`}>
                {value && <span>{URGENCY_INFO[value]?.icon}</span>}
                <span className={!value ? "" : "font-medium"}>{value || placeholder}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
              </span>
            </ListboxButton>
            
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl focus:outline-none sm:text-sm">
                {options.map((item) => (
                  <ListboxOption key={item} value={item} className={({ active }) => `relative cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                    {({ selected }) => (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span>{URGENCY_INFO[item].icon}</span>
                          <span className={`flex-1 font-medium ${selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>{item}</span>
                          {selected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">{URGENCY_INFO[item].desc}</span>
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
        {selectedUrgency && (
          <div className={`mt-2 p-3 rounded-lg border ${selectedUrgency.color}`}>
            <p className="text-xs font-medium">{selectedUrgency.desc}</p>
            <p className="text-xs opacity-80 mt-1">Example: {selectedUrgency.example}</p>
          </div>
        )}
      </FormField>
    );
  };

  const IssueTypeSelect = ({ label, value, options, onChange, placeholder, icon: IconComponent }) => (
    <FormField label={label} icon={IconComponent}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm">
            <span className={`flex items-center gap-2 ${!value ? "text-gray-400" : ""}`}>
              {value && <span>{ISSUE_TYPE_INFO[value]?.icon}</span>}
              <span className={!value ? "" : "font-medium"}>{value || placeholder}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
            </span>
          </ListboxButton>
          
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl focus:outline-none sm:text-sm">
              {options.map((item) => (
                <ListboxOption key={item} value={item} className={({ active }) => `relative cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                  {({ selected }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span>{ISSUE_TYPE_INFO[item].icon}</span>
                        <span className={`flex-1 font-medium ${selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>{item}</span>
                        {selected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">{ISSUE_TYPE_INFO[item].desc}</span>
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Submit New Ticket</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {showWelcome ? "Let's submit your first support request and get started!" : "Fill in the details below to request technical assistance."}
            </p>
          </motion.div>
          <Link to={
            role === 'client' ? '/client-dashboard/profile':
            role === 'reviewer' ? '/reviewer-dashboard/settings':
            '/admin-dashboard/admin-settings'
          }>
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "G"}
              </div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{user?.name || "Guest User"}</span>
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField 
                      label="Location" 
                      icon={MapPin}
                      helper="Where are you experiencing this issue? Building, floor, room number."
                    >
                      <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="e.g., Floor 4, Room 201 or Building A, Reception" 
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                      />
                    </FormField>
                    <IssueTypeSelect label="Issue Type" value={formData.issueType} options={ISSUE_TYPES} onChange={(val) => handleListboxChange("issueType", val)} placeholder="Select issue category" icon={Tag} />
                  </div>
                  
                  <FormField 
                    label="Subject" 
                    icon={Info}
                    helper="A short, clear summary of the problem."
                  >
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="e.g., Printer not working in Floor 3 conference room" 
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                    />
                  </FormField>
                  
                  <FormField 
                    label="Description" 
                    icon={AlertTriangle}
                    helper="Include: What happened? When did it start? What error messages did you see?"
                  >
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows="5" 
                      placeholder="e.g., The printer has been showing an error since 2pm today. Error message says 'Paper Jam'. I've tried turning it off and on but the issue persists. This is affecting our team's ability to print contracts."
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm resize-y"
                    />
                  </FormField>
                  
                  <div className="max-w-md">
                    <UrgencySelect label="Urgency Level" value={formData.urgency} options={URGENCY_LEVELS} onChange={(val) => handleListboxChange("urgency", val)} placeholder="Select urgency level" icon={AlertTriangle} />
                  </div>
                  
                  {role === 'client' && (
                    <FormField 
                      label="Attachments" 
                      icon={Upload}
                      helper="Screenshots, error messages, or documents that help explain the issue."
                    >
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
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Tips for Faster Resolution</h3>
              </div>
              <div className="space-y-3">
                {TIPS.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{tip.title}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">What Happens Next?</h3>
              </div>
              <div className="space-y-3">
                {STEPS_AFTER_SUBMIT.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{step.title}</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewTicketForm;
