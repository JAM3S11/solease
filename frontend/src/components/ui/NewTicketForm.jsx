import React, { useState } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { MapPin, Tag, Info, AlertTriangle, ChevronDown, Check, Upload, X, File, Lightbulb, Clock, User, CheckCircle, MessageSquare, ArrowLeft, FileText, Zap } from "lucide-react";
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
    "Hardware issue": { 
      desc: "Physical devices like computers, monitors, printers, keyboards, etc.", 
      icon: "💻",
      subjectPlaceholder: "e.g., Printer not working on Floor 3",
      descriptionPlaceholder: "Describe the hardware issue in detail. Include: What device is affected? What happens when you try to use it? When did it start? Any error messages?"
    },
    "Software issue": { 
      desc: "Applications, programs, operating systems, or installation problems.", 
      icon: "📀",
      subjectPlaceholder: "e.g., Excel application crashes when opening files",
      descriptionPlaceholder: "Describe the software issue. Include: Which application/program is affected? What version are you using? What happens when the error occurs? Any error messages or codes?"
    },
    "Network Connectivity": { 
      desc: "Internet, WiFi, VPN, or network access issues.", 
      icon: "📶",
      subjectPlaceholder: "e.g., Cannot connect to WiFi in Conference Room B",
      descriptionPlaceholder: "Describe the network issue. Include: Are you using WiFi or Ethernet? Can you access other websites? What happens when you try to connect? Is it affecting other devices?"
    },
    "Account Access": { 
      desc: "Login problems, password resets, or permission issues.", 
      icon: "🔐",
      subjectPlaceholder: "e.g., Cannot login to my account - password not working",
      descriptionPlaceholder: "Describe the account issue. Include: Are you getting any error message? When did you last successfully login? Have you tried resetting your password? Which system/application?"
    },
    "Other": { 
      desc: "Issues that don't fit the categories above.", 
      icon: "📋",
      subjectPlaceholder: "e.g., Need help with...",
      descriptionPlaceholder: "Describe your issue in as much detail as possible. Include: What happened? When did it start? What have you already tried? Any relevant information that might help us assist you."
    },
  };
  
  const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];
  
  const URGENCY_INFO = {
    "Low": { 
      color: "bg-green-500", 
      textColor: "text-green-600 dark:text-green-400", 
      responseTime: "Response within 48 hours",
      desc: "Minor issue with no immediate impact",
      example: "Cosmetic issues, minor inconveniences"
    },
    "Medium": { 
      color: "bg-yellow-500", 
      textColor: "text-yellow-600 dark:text-yellow-400", 
      responseTime: "Response within 24 hours",
      desc: "Affects work but a workaround exists",
      example: "Slow performance, non-critical features not working"
    },
    "High": { 
      color: "bg-orange-500", 
      textColor: "text-orange-600 dark:text-orange-400", 
      responseTime: "Response within 8 hours",
      desc: "Significant impact, needs quick resolution",
      example: "Main feature broken, multiple users affected"
    },
    "Critical": { 
      color: "bg-red-500", 
      textColor: "text-red-600 dark:text-red-400", 
      responseTime: "Response within 2 hours",
      desc: "Complete blockage, emergency situation",
      example: "System down, security breach, data loss"
    },
  };

  const TIPS = [
    { icon: MessageSquare, title: "Be Specific", desc: "Include exact error messages" },
    { icon: User, title: "Mention Impact", desc: "Tell us if others have the same issue" },
    { icon: File, title: "Attach Screenshots", desc: "Visual evidence helps us understand" },
    { icon: Clock, title: "Include Timeline", desc: "When did it start?" },
  ];
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleListboxChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
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
    
    const missingFields = [];
    if (!formData.location) missingFields.push("Location");
    if (!formData.issueType) missingFields.push("Issue Type");
    if (!formData.subject) missingFields.push("Subject");
    if (!formData.description) missingFields.push("Description");
    if (!formData.urgency) missingFields.push("Urgency Level");
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`, { duration: 2000 });
      return;
    }
    
    if (formData.description.length < 20) {
      toast.error("Please provide more details (at least 20 characters)", { duration: 2000 });
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to={navigatePath} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Submit New Ticket</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {showWelcome ? "Let's submit your first support request!" : "Fill in the details below to request technical assistance."}
                </p>
              </div>
              <Link 
                to={role === 'client' ? '/client-dashboard/profile' : role === 'reviewer' ? '/reviewer-dashboard/settings' : '/admin-dashboard/admin-settings'}
                className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "G"}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-blue-700 dark:text-blue-300">{user?.name || "Guest User"}</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText size={20} />
                  Ticket Details
                </h2>
                <p className="text-blue-100 text-sm">Provide information about your issue</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Floor 4, Room 201"
                      className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                      Issue Type <span className="text-red-500">*</span>
                    </label>
                    <Listbox value={formData.issueType} onChange={(val) => handleListboxChange("issueType", val)}>
                      <div className="relative">
                        <ListboxButton className="relative w-full cursor-pointer rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                          <span className="flex items-center gap-2">
                            {formData.issueType && <span className="text-xl">{ISSUE_TYPE_INFO[formData.issueType]?.icon}</span>}
                            <span className={formData.issueType ? "font-medium" : "text-gray-400"}>{formData.issueType || "Select issue category"}</span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </span>
                        </ListboxButton>
                        <Transition as="div" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl">
                            {ISSUE_TYPES.map((item) => (
                              <ListboxOption key={item} value={item} className={({ active }) => `relative cursor-pointer select-none px-4 py-3 text-sm ${active ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                                {({ selected }) => (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">{ISSUE_TYPE_INFO[item]?.icon}</span>
                                      <span className={`flex-1 font-medium ${selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>{item}</span>
                                      {selected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-8">{ISSUE_TYPE_INFO[item]?.desc}</span>
                                  </div>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Info size={16} className="text-blue-600 dark:text-blue-400" />
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={formData.issueType ? ISSUE_TYPE_INFO[formData.issueType]?.subjectPlaceholder : "e.g., Printer not working in Floor 3"}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <AlertTriangle size={16} className="text-blue-600 dark:text-blue-400" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder={formData.issueType ? ISSUE_TYPE_INFO[formData.issueType]?.descriptionPlaceholder : "Describe your issue in detail. Include what happened, when it started, and any error messages..."}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <AlertTriangle size={16} className="text-blue-600 dark:text-blue-400" />
                    Urgency Level <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-400 ml-2">(Select based on impact)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {URGENCY_LEVELS.map((option) => {
                      const info = URGENCY_INFO[option];
                      const isSelected = formData.urgency === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleListboxChange("urgency", option)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected 
                              ? `${info.color} text-white border-transparent` 
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                          }`}
                        >
                          <span className={`text-sm font-bold block ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                            {option}
                          </span>
                          <span className={`text-xs block mt-1 ${isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                            {info.responseTime.replace("Response within ", "")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {formData.urgency && URGENCY_INFO[formData.urgency] && (
                    <div className={`p-4 rounded-xl border-2 ${
                      formData.urgency === "Low" ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20" :
                      formData.urgency === "Medium" ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20" :
                      formData.urgency === "High" ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20" :
                      "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          formData.urgency === "Low" ? "bg-green-500" :
                          formData.urgency === "Medium" ? "bg-yellow-500" :
                          formData.urgency === "High" ? "bg-orange-500" :
                          "bg-red-500"
                        }`}>
                          <span className="text-lg text-white">
                            {formData.urgency === "Low" ? "🟢" :
                             formData.urgency === "Medium" ? "🟡" :
                             formData.urgency === "High" ? "🟠" : "🔴"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${
                            formData.urgency === "Low" ? "text-green-700 dark:text-green-300" :
                            formData.urgency === "Medium" ? "text-yellow-700 dark:text-yellow-300" :
                            formData.urgency === "High" ? "text-orange-700 dark:text-orange-300" :
                            "text-red-700 dark:text-red-300"
                          }`}>
                            {formData.urgency} Priority Selected
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {URGENCY_INFO[formData.urgency].desc}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            <span className="font-medium">Example:</span> {URGENCY_INFO[formData.urgency].example}
                          </p>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                            {URGENCY_INFO[formData.urgency].responseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {role === 'client' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Upload size={16} className="text-blue-600 dark:text-blue-400" />
                      Attachments <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50">
                      {selectedFile ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {filePreview ? (
                              <img src={filePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <File size={20} className="text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button type="button" onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                            <Upload size={24} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload files</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images, PDF, DOC (Max 10MB)</p>
                          <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    type="submit"
                    disabled={loading || uploadLoading} 
                    className="w-full md:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading || uploadLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={18} />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800">
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

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/30 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Urgency Guide</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(URGENCY_INFO).map(([level, info]) => (
                  <div key={level} className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center flex-shrink-0 text-white text-sm`}>
                      {level === "Low" ? "🟢" : level === "Medium" ? "🟡" : level === "High" ? "🟠" : "🔴"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{level}</p>
                        <span className={`text-xs font-medium ${info.textColor}`}>{info.responseTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Average response time: 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewTicketForm;
