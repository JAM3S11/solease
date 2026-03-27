import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowDown,
  FileText,
  Paperclip,
  MessageSquare,
  Star,
  User,
  Users,
  Calendar,
  ArrowLeft,
  Headphones,
  Zap,
  Send,
  Eye,
  Bell
} from "lucide-react";

const TicketManagementPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("lifecycle");

  const sections = [
    { id: "lifecycle", title: "Ticket Lifecycle" },
    { id: "creating", title: "Creating Tickets" },
    { id: "tracking", title: "Tracking Tickets" },
    { id: "priority", title: "Priority Levels" },
    { id: "attachments", title: "Attachments" },
    { id: "communication", title: "Communication" },
  ];

  const lifecycleSteps = [
    { status: "Open", description: "Ticket submitted, awaiting review", color: "blue", icon: AlertCircle },
    { status: "In Progress", description: "Support team actively working on it", color: "amber", icon: Clock },
    { status: "Resolved", description: "Solution provided, awaiting confirmation", color: "green", icon: CheckCircle },
    { status: "Closed", description: "Issue fully resolved and confirmed", color: "gray", icon: XCircle },
  ];

  const flowchartNodes = [
    {
      id: "submit",
      label: "Submit Ticket",
      description: "Client creates ticket",
      type: "action",
      color: "purple",
      icon: Plus
    },
    {
      id: "open",
      label: "Open",
      description: "Ticket received & queued",
      type: "status",
      color: "blue"
    },
    {
      id: "review",
      label: "Review",
      description: "Support reviews ticket",
      type: "process",
      color: "indigo"
    },
    {
      id: "assigned",
      label: "Assigned",
      description: "Reviewer working on it",
      type: "status",
      color: "amber"
    },
    {
      id: "resolved",
      label: "Resolved",
      description: "Solution provided",
      type: "status",
      color: "green"
    },
    {
      id: "feedback",
      label: "Feedback",
      description: "Client confirms resolution",
      type: "decision",
      color: "cyan"
    },
    {
      id: "closed",
      label: "Closed",
      description: "Ticket archived",
      type: "status",
      color: "gray"
    }
  ];

  const priorityLevels = [
    { 
      level: "Low", 
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      bgColor: "bg-gray-500",
      description: "Minor issues, questions, or feature requests. Response within 48 hours.",
      examples: ["Password reset request", "General inquiry", "Minor UI issue"]
    },
    { 
      level: "Medium", 
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      bgColor: "bg-blue-500",
      description: "Standard issues affecting work but not critical. Response within 24 hours.",
      examples: ["Login issues", "Feature not working", "Performance problems"]
    },
    { 
      level: "High", 
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      bgColor: "bg-orange-500",
      description: "Significant impact on operations. Response within 8 hours.",
      examples: ["System outage", "Data sync issues", "Security concerns"]
    },
    { 
      level: "Urgent", 
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      bgColor: "bg-red-500",
      description: "Critical system failure or security breach. Response within 1 hour.",
      examples: ["Complete system down", "Data breach", "Security attack"]
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(sectionId);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/help-support")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Help</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>

        {/* Introduction */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Ticket Management</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Complete guide to managing your support tickets</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Learn how to create, track, and manage support tickets effectively. From submission to resolution, 
              this guide covers the entire ticket lifecycle and best practices for getting faster support.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Lifecycle</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Creating</span>
              <span className="px-2.5 sm:px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold rounded-full">Priority</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">Tracking</span>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="hidden md:inline">{section.title}</span>
              <span className="md:hidden">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Ticket Lifecycle Flow - System Architecture Style */}
        <div id="lifecycle" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Ticket Lifecycle Flow</h4>
          </div>
          
          {/* Architecture Flow Chart - Desktop */}
          <div className="hidden lg:block">
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    <span>Action</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                    <span>Status</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
                    <span>Process</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-cyan-500"></div>
                    <span>Decision</span>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 overflow-x-auto">
                <div className="flex items-center justify-center min-w-max">
                  {/* Row 1: Submit -> Open */}
                  <div className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-lg flex items-center justify-center mb-2 shadow-md ${
                        flowchartNodes[0].color === "purple" ? "bg-purple-500" : "bg-purple-500"
                      }`}>
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Submit</span>
                      <span className="text-[10px] text-gray-500">Client creates</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-sm flex items-center justify-center mb-2 shadow-md ${
                        flowchartNodes[1].color === "blue" ? "bg-blue-500" : "bg-blue-500"
                      }`}>
                        <span className="text-white text-xs font-bold">OPEN</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Open</span>
                      <span className="text-[10px] text-gray-500">Received & queued</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    {/* Review Process */}
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-sm flex items-center justify-center mb-2 shadow-md border-2 border-indigo-500 ${
                        flowchartNodes[2].color === "indigo" ? "bg-indigo-500" : "bg-indigo-500"
                      }`}>
                        <span className="text-white text-xs font-bold">REVIEW</span>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Review</span>
                      <span className="text-[10px] text-gray-500">Support reviews</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    {/* Assigned */}
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-sm flex items-center justify-center mb-2 shadow-md ${
                        flowchartNodes[3].color === "amber" ? "bg-amber-500" : "bg-amber-500"
                      }`}>
                        <span className="text-white text-xs font-bold">ASSIGNED</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Assigned</span>
                      <span className="text-[10px] text-gray-500">Working on it</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    {/* Resolved */}
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-sm flex items-center justify-center mb-2 shadow-md ${
                        flowchartNodes[4].color === "green" ? "bg-green-500" : "bg-green-500"
                      }`}>
                        <span className="text-white text-xs font-bold">RESOLVED</span>
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">Resolved</span>
                      <span className="text-[10px] text-gray-500">Solution provided</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    {/* Decision Diamond */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rotate-45 flex items-center justify-center mb-6 shadow-md bg-cyan-500">
                        <span className="-rotate-45 text-white text-[8px] font-bold">FEEDBACK</span>
                      </div>
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Feedback</span>
                      <span className="text-[10px] text-gray-500">Client confirms</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    {/* Closed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-14 rounded-sm flex items-center justify-center mb-2 shadow-md ${
                        flowchartNodes[6].color === "gray" ? "bg-gray-500" : "bg-gray-500"
                      }`}>
                        <span className="text-white text-xs font-bold">CLOSED</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Closed</span>
                      <span className="text-[10px] text-gray-500">Archived</span>
                    </div>
                  </div>
                </div>
                {/* Connector lines for feedback loop */}
                <div className="mt-6 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] text-amber-500 font-medium mb-1">Not Satisfied</div>
                    <div className="w-0.5 h-6 bg-amber-400"></div>
                    <div className="w-16 h-0.5 bg-amber-400"></div>
                    <div className="w-0.5 h-8 bg-amber-400"></div>
                    <div className="text-[10px] text-amber-500 font-medium">Back to Review</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Chart - Tablet */}
          <div className="hidden sm:block lg:hidden">
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Understanding the ticket lifecycle helps you know what to expect at each stage.
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between overflow-x-auto pb-2">
                  {lifecycleSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 ${
                          step.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" :
                          step.color === "amber" ? "bg-amber-100 dark:bg-amber-900/30" :
                          step.color === "green" ? "bg-green-100 dark:bg-green-900/30" :
                          "bg-gray-100 dark:bg-gray-700"
                        }`}>
                          <step.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${
                            step.color === "blue" ? "text-blue-500" :
                            step.color === "amber" ? "text-amber-500" :
                            step.color === "green" ? "text-green-500" :
                            "text-gray-500"
                          }`} />
                        </div>
                        <h5 className={`text-xs sm:text-sm font-bold mb-0.5 ${
                          step.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                          step.color === "amber" ? "text-amber-600 dark:text-amber-400" :
                          step.color === "green" ? "text-green-600 dark:text-green-400" :
                          "text-gray-600 dark:text-gray-400"
                        }`}>{step.status}</h5>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center max-w-[80px]">{step.description}</p>
                      </div>
                      {index < lifecycleSteps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1 sm:mx-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flow Chart - Mobile */}
          <div className="sm:hidden">
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4">
                {lifecycleSteps.map((step, index) => (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" :
                        step.color === "amber" ? "bg-amber-100 dark:bg-amber-900/30" :
                        step.color === "green" ? "bg-green-100 dark:bg-green-900/30" :
                        "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        <step.icon className={`w-6 h-6 ${
                          step.color === "blue" ? "text-blue-500" :
                          step.color === "amber" ? "text-amber-500" :
                          step.color === "green" ? "text-green-500" :
                          "text-gray-500"
                        }`} />
                      </div>
                      {index < lifecycleSteps.length - 1 && (
                        <ArrowDown className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h5 className={`text-sm font-bold mb-1 ${
                        step.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                        step.color === "amber" ? "text-amber-600 dark:text-amber-400" :
                        step.color === "green" ? "text-green-600 dark:text-green-400" :
                        "text-gray-600 dark:text-gray-400"
                      }`}>{step.status}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Creating Tickets */}
        <div id="creating" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Plus className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Creating Tickets</h4>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="w-6 h-6 sm:w-7 sm:w-7 sm:h-8 md:w-8 md:h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">Click New Ticket</h5>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Navigate to 'New Ticket' from the sidebar or use the quick action button on your dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="w-6 h-6 sm:w-7 sm:w-7 sm:h-8 md:w-8 md:h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">Fill in Details</h5>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Enter a clear, specific subject (e.g., "Cannot login to dashboard" not "Help me"). Provide a detailed description.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="w-6 h-6 sm:w-7 sm:w-7 sm:h-8 md:w-8 md:h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">3</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">Select Priority</h5>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Choose the appropriate priority level based on the impact and urgency of your issue.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="w-6 h-6 sm:w-7 sm:w-7 sm:h-8 md:w-8 md:h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">4</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">Submit</h5>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click Submit to send your ticket. You'll receive a confirmation email with your ticket ID.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Levels */}
        <div id="priority" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Priority Levels Explained</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {priorityLevels.map((priority) => (
              <div key={priority.level} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${priority.bgColor} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{priority.level[0]}</span>
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{priority.level}</h5>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Response: {priority.description.split('.')[0]}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{priority.description}</p>
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {priority.examples.map((ex) => (
                        <span key={ex} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs rounded-full">{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Tickets */}
        <div id="tracking" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Tracking Your Tickets</h4>
          </div>
          
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">My Tickets Section</h5>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">View all your submitted tickets in the 'My Tickets' section. Each ticket shows its current status, subject, and last update time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Email Notifications</h5>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">You'll receive email notifications whenever your ticket status changes. Check your inbox for updates on progress.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Conversation Thread</h5>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Use the conversation section to communicate directly with support. All messages are stored with your ticket for reference.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div id="attachments" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Adding Attachments</h4>
          </div>
          
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Supported Files</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["JPG", "PNG", "PDF", "DOCX", "TXT"].map((ext) => (
                      <span key={ext} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg">{ext}</span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Maximum file size: 10MB per attachment</p>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Best Practices</h5>
                  <ul className="space-y-2">
                    {["Take screenshots of error messages", "Include steps to reproduce the issue", "Attach log files for technical problems", "Use clear, descriptive filenames"].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div id="communication" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Communication & Feedback</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                  </div>
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Direct Communication</h5>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Use the conversation feature in your ticket to communicate directly with the support team. Provide additional information when asked.
                </p>
                <ul className="space-y-1.5">
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Respond promptly to questions</li>
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Provide requested information quickly</li>
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Test solutions and confirm if resolved</li>
                </ul>
              </div>
            </div>
            <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Providing Feedback</h5>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Once your ticket is resolved, you'll receive a feedback request. Your input helps us improve our service.
                </p>
                <ul className="space-y-1.5">
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Rate your experience (1-5 stars)</li>
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Leave comments on resolution</li>
                  <li className="text-xs text-gray-500 dark:text-gray-400">• Suggest improvements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">Quick Tips for Faster Resolution</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
              <div className="flex items-start gap-2 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Use specific ticket subjects</span>
              </div>
              <div className="flex items-start gap-2 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Include screenshots of errors</span>
              </div>
              <div className="flex items-start gap-2 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Select correct priority level</span>
              </div>
              <div className="flex items-start gap-2 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Respond promptly to questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl mb-6 sm:mb-8">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Need More Help?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              If you can't find what you're looking for, our support team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => navigate("/client-dashboard/new-ticket")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit a Ticket
              </button>
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketManagementPage;