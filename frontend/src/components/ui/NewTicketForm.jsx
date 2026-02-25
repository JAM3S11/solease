import React, { useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { MapPin, Tag, Info, AlertTriangle, Send, ChevronDown, Check, Upload, X, File, Lightbulb, Clock, User, CheckCircle, MessageSquare, Eye, ArrowLeft, FileText, Zap } from "lucide-react";
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
  const [focusedField, setFocusedField] = useState(null);
  
  const ISSUE_TYPES = ["Hardware issue", "Software issue", "Network Connectivity", "Account Access", "Other"];
  
  const ISSUE_TYPE_INFO = {
    "Hardware issue": { desc: "Physical devices like computers, monitors, printers, keyboards, etc.", icon: "💻", color: "from-blue-500 to-indigo-600" },
    "Software issue": { desc: "Applications, programs, operating systems, or installation problems.", icon: "📀", color: "from-purple-500 to-pink-600" },
    "Network Connectivity": { desc: "Internet, WiFi, VPN, or network access issues.", icon: "📶", color: "from-green-500 to-emerald-600" },
    "Account Access": { desc: "Login problems, password resets, or permission issues.", icon: "🔐", color: "from-orange-500 to-red-600" },
    "Other": { desc: "Issues that don't fit the categories above.", icon: "📋", color: "from-gray-500 to-slate-600" },
  };
  
  const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];
  
  const URGENCY_INFO = {
    "Low": { 
      desc: "Minor issue with no immediate impact", 
      fullDesc: "Issues that don't affect your work significantly",
      example: "Cosmetic issues, feature requests, minor inconveniences",
      responseTime: "Response within 48 hours",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
      selectedColor: "bg-green-500 text-white",
      bgGradient: "from-green-50 to-transparent dark:from-green-900/20",
      borderColor: "border-green-300 dark:border-green-700",
      icon: "🟢",
      bgColor: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400"
    },
    "Medium": { 
      desc: "Affects work but a workaround exists", 
      fullDesc: "Problems that impact productivity but have a temporary solution",
      example: "Slow performance, non-critical features not working",
      responseTime: "Response within 24 hours",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      selectedColor: "bg-yellow-500 text-white",
      bgGradient: "from-yellow-50 to-transparent dark:from-yellow-900/20",
      borderColor: "border-yellow-300 dark:border-yellow-700",
      icon: "🟡",
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    "High": { 
      desc: "Significant impact, needs quick resolution", 
      fullDesc: "Serious issues affecting multiple users or critical functions",
      example: "Main feature broken, multiple users affected",
      responseTime: "Response within 8 hours",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      selectedColor: "bg-orange-500 text-white",
      bgGradient: "from-orange-50 to-transparent dark:from-orange-900/20",
      borderColor: "border-orange-300 dark:border-orange-700",
      icon: "🟠",
      bgColor: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    "Critical": { 
      desc: "Complete blockage, emergency situation", 
      fullDesc: "Emergency issues blocking all work with no workaround available",
      example: "System down, security breach, data loss",
      responseTime: "Response within 2 hours",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      selectedColor: "bg-red-500 text-white",
      bgGradient: "from-red-50 to-transparent dark:from-red-900/20",
      borderColor: "border-red-300 dark:border-red-700",
      icon: "🔴",
      bgColor: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400"
    },
  };

  const TIPS = [
    { icon: MessageSquare, title: "Be Specific", desc: "Include exact error messages and when the issue started" },
    { icon: User, title: "Mention Impact", desc: "Tell us if others are experiencing the same issue" },
    { icon: File, title: "Attach Screenshots", desc: "Visual evidence helps us understand faster" },
    { icon: Clock, title: "Include Timeline", desc: "When did it start? What were you doing at the time?" },
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
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
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

  const InputField = ({ name, label, icon: IconComp, placeholder, type = "text", as = "input", rows, helper, required = false }) => {
    const isFocused = focusedField === name;
    const hasValue = formData[name]?.length > 0;
    const issueTypeInfo = name === "issueType" ? ISSUE_TYPE_INFO[formData.issueType] : null;
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <IconComp size={16} className="text-blue-600 dark:text-blue-400" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        {as === "textarea" ? (
          <textarea 
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            rows={rows}
            placeholder={placeholder}
            className={`w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none ${
              isFocused 
                ? "border-blue-500 ring-4 ring-blue-500/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          />
        ) : (
          <input 
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            className={`w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none ${
              isFocused 
                ? "border-blue-500 ring-4 ring-blue-500/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          />
        )}
        
        {helper && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
        )}
        
        {issueTypeInfo && formData.issueType && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl bg-gradient-to-r ${issueTypeInfo.bgGradient || 'from-gray-50 to-transparent dark:from-gray-800/50'} border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{issueTypeInfo.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.issueType}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{issueTypeInfo.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const UrgencySelect = ({ label, value, options, onChange, placeholder }) => {
    const selectedUrgency = URGENCY_INFO[value];
    
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <AlertTriangle size={16} className="text-blue-600 dark:text-blue-400" />
          {label}
          <span className="text-red-500">*</span>
          <span className="text-xs font-normal text-gray-400 ml-2">(See guide on right for details)</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {options.map((option) => {
            const info = URGENCY_INFO[option];
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md ${
                  isSelected 
                    ? `${info.selectedColor} border-transparent shadow-lg` 
                    : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750`
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${!isSelected && info.textColor}`}>{info.icon}</span>
                  <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {option}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {value && selectedUrgency && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${selectedUrgency.borderColor} bg-gradient-to-r ${selectedUrgency.bgGradient}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${selectedUrgency.bgColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-xl">{selectedUrgency.icon}</span>
              </div>
              <div>
                <p className={`text-sm font-bold ${selectedUrgency.textColor}`}>
                  {value} Priority Selected
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedUrgency.responseTime}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const IssueTypeSelect = ({ label, value, options, onChange, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Tag size={16} className="text-blue-600 dark:text-blue-400" />
        {label}
        <span className="text-red-500">*</span>
      </label>
      
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300 dark:hover:border-gray-600">
            <span className={`flex items-center gap-2 ${!value ? "text-gray-400" : ""}`}>
              {value && <span className="text-xl">{ISSUE_TYPE_INFO[value]?.icon}</span>}
              <span className={!value ? "" : "font-medium"}>{value || placeholder}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
            </span>
          </ListboxButton>
          
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl focus:outline-none">
              {options.map((item) => (
                <ListboxOption key={item} value={item} className={({ active }) => `relative cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                  {({ selected }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ISSUE_TYPE_INFO[item]?.icon}</span>
                        <span className={`flex-1 font-medium ${selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>{item}</span>
                        {selected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
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
  );
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to={navigatePath} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Submit New Ticket</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {showWelcome 
                    ? "Let's submit your first support request!" 
                    : "Fill in the details below to request technical assistance."}
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
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText size={20} />
                  Ticket Details
                </h2>
                <p className="text-blue-100 text-sm">Provide information about your issue</p>
              </div>
              
              <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    name="location"
                    label="Location"
                    icon={MapPin}
                    placeholder="e.g., Floor 4, Room 201"
                    helper="Where are you experiencing this issue?"
                    required
                  />
                  <IssueTypeSelect 
                    label="Issue Type" 
                    value={formData.issueType} 
                    options={ISSUE_TYPES} 
                    onChange={(val) => handleListboxChange("issueType", val)} 
                    placeholder="Select issue category" 
                  />
                </div>
                
                <InputField 
                  name="subject"
                  label="Subject"
                  icon={Info}
                  placeholder="e.g., Printer not working in Floor 3"
                  helper="A short, clear summary of the problem"
                  required
                />
                
                <InputField 
                  name="description"
                  label="Description"
                  icon={AlertTriangle}
                  as="textarea"
                  rows={5}
                  placeholder="Describe your issue in detail. Include what happened, when it started, and any error messages..."
                  helper="Be as detailed as possible to help us resolve faster"
                  required
                />
                
                <UrgencySelect 
                  label="Urgency Level" 
                  value={formData.urgency} 
                  options={URGENCY_LEVELS} 
                  onChange={(val) => handleListboxChange("urgency", val)} 
                />
                
                {role === 'client' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Upload size={16} className="text-blue-600 dark:text-blue-400" />
                      Attachments
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
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
                          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            <Upload size={24} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Click to upload files
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images, PDF, DOC (Max 10MB)</p>
                          <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    disabled={loading || uploadLoading} 
                    className="w-full md:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading || uploadLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={18} className="group-hover:scale-110 transition-transform" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
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

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">What Happens Next?</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Confirmation</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">You'll receive a ticket ID</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Review</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Team reviews and assigns priority</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Resolution</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Get notified when addressed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/30 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Understanding Urgency Levels</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(URGENCY_INFO).map(([level, info]) => (
                  <div key={level} className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${info.bgColor} flex items-center justify-center flex-shrink-0 text-white text-sm`}>
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{level}</p>
                        <span className={`text-xs font-medium ${info.textColor}`}>{info.responseTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{info.fullDesc}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        <span className="font-medium">Ex:</span> {info.example}
                      </p>
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
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewTicketForm;
