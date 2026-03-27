import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  Zap, 
  ArrowLeft,
  Workflow,
  GitBranch,
  Clock,
  Bell,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Timer,
  BarChart3,
  Target,
  Layers,
  ArrowRight,
  ArrowDown,
  Square,
  ChevronRight,
  Bolt,
  Cog,
  RefreshCw,
  Gauge,
  Activity,
  Tag,
  MessageCircle,
  User,
  Mail
} from "lucide-react";

const WorkflowToolsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "automation", title: "Automation" },
    { id: "triggers", title: "Triggers" },
    { id: "scheduling", title: "Scheduling" },
    { id: "analytics", title: "Analytics" },
  ];

  const workflowFeatures = [
    {
      id: "auto-routing",
      title: "Automatic Ticket Routing",
      description: "Intelligently route tickets to the right team members based on skills, availability, and workload.",
      icon: GitBranch,
      color: "blue",
      status: "coming-soon",
      releaseDate: "Q3 2026"
    },
    {
      id: "sla-management",
      title: "SLA Management",
      description: "Set up Service Level Agreements with automatic escalation and notification rules.",
      icon: Timer,
      color: "amber",
      status: "coming-soon",
      releaseDate: "Q3 2026"
    },
    {
      id: "auto-responses",
      title: "Smart Auto-Responses",
      description: "Send personalized automated responses based on ticket category and customer history.",
      icon: MessageCircle,
      color: "green",
      status: "beta",
      releaseDate: "Beta Soon"
    },
    {
      id: "bulk-actions",
      title: "Bulk Operations",
      description: "Perform batch operations on multiple tickets - assign, close, tag, or update status at once.",
      icon: Layers,
      color: "purple",
      status: "coming-soon",
      releaseDate: "Q4 2026"
    }
  ];

  const triggerTypes = [
    {
      category: "Ticket Events",
      triggers: [
        { name: "On Ticket Created", description: "When a new ticket is submitted" },
        { name: "On Status Changed", description: "When ticket status updates" },
        { name: "On Priority Changed", description: "When priority level changes" },
        { name: "On Assigned", description: "When a ticket is assigned to someone" }
      ]
    },
    {
      category: "Time-Based",
      triggers: [
        { name: "SLA Warning", description: "When ticket is approaching SLA deadline" },
        { name: "SLA Breached", description: "When SLA deadline is exceeded" },
        { name: "Idle Timeout", description: "When ticket has no activity for X hours" },
        { name: "Scheduled Report", description: "Send reports on a schedule" }
      ]
    },
    {
      category: "Customer Events",
      triggers: [
        { name: "New Customer", description: "First ticket from a customer" },
        { name: "Returning Customer", description: "Customer submits another ticket" },
        { name: "VIP Customer", description: "Ticket from high-value account" }
      ]
    }
  ];

  const automationActions = [
    { icon: CheckCircle, label: "Update Status", color: "bg-blue-500" },
    { icon: Bell, label: "Send Notification", color: "bg-amber-500" },
    { icon: Settings, label: "Change Priority", color: "bg-purple-500" },
    { icon: User, label: "Assign Agent", color: "bg-green-500" },
    { icon: Tag, label: "Add Tags", color: "bg-cyan-500" },
    { icon: Mail, label: "Send Email", color: "bg-pink-500" }
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

        {/* Coming Soon Banner */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
                <Bolt className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Workflow Tools</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] sm:text-xs font-bold rounded-full uppercase">Coming Soon</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Supercharge your support operations with automation</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Workflow Tools is our next-generation automation platform designed to streamline your support operations. 
              Create powerful automated workflows, set up intelligent triggers, and never miss an important ticket again.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Automation</span>
              <span className="px-2.5 sm:px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold rounded-full">Smart Routing</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">SLA Management</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Analytics</span>
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
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="hidden md:inline">{section.title}</span>
              <span className="md:hidden">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Overview Section */}
        <div id="overview" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Workflow className="w-5 h-5 text-amber-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">What's Coming</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workflowFeatures.map((feature) => (
              <div key={feature.id} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      feature.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      feature.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                      feature.color === "green" ? "bg-green-500/10 text-green-500" :
                      "bg-purple-500/10 text-purple-500"
                    }`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{feature.title}</h5>
                        <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full flex-shrink-0 ${
                          feature.status === "beta" 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                          {feature.status === "beta" ? "Beta" : feature.releaseDate}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Section */}
        <div id="automation" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Cog className="w-5 h-5 text-amber-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">How Automation Works</h4>
          </div>
          
          {/* Introduction */}
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 lg:p-6">
              <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">The Automation Framework</h5>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our automation system works on a simple <strong>Trigger → Condition → Action</strong> framework. 
                When an event occurs (trigger), the system checks if certain conditions are met, then executes 
                one or more actions automatically.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2">
                    <Play className="w-5 h-5" />
                  </div>
                  <h6 className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">TRIGGER</h6>
                  <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400">An event that starts the workflow</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-2">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h6 className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">CONDITION</h6>
                  <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">Rules that determine if action runs</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
                    <Bolt className="w-5 h-5" />
                  </div>
                  <h6 className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 mb-1">ACTION</h6>
                  <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400">What happens when triggered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Actions */}
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 lg:p-6">
              <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">Available Actions</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {automationActions.map((action, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Flow Example - Desktop */}
          <div className="hidden lg:block border-0 rounded-xl overflow-hidden bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg mb-4 sm:mb-6">
            <div className="p-6">
              <h5 className="text-base font-semibold text-gray-900 dark:text-white mb-6 text-center">Example: SLA Warning Workflow</h5>
              <div className="flex items-center justify-center gap-0">
                {/* Trigger */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-20 rounded-lg bg-blue-500 flex flex-col items-center justify-center shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white mb-1" />
                    <span className="text-white text-xs font-semibold">TRIGGER</span>
                    <span className="text-white/80 text-[10px]">SLA Warning</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Ticket approaches SLA</span>
                </div>
                
                {/* Arrow */}
                <div className="flex flex-col items-center mx-2">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
                
                {/* Condition */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-20 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center">
                    <GitBranch className="w-6 h-6 text-amber-500 mb-1" />
                    <span className="text-amber-700 dark:text-amber-300 text-xs font-semibold">CONDITION</span>
                    <span className="text-amber-600 dark:text-amber-400 text-[10px]">Priority = High</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Check priority level</span>
                </div>
                
                {/* Arrow */}
                <div className="flex flex-col items-center mx-2">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
                
                {/* Actions */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-2">
                    <div className="w-20 h-16 rounded-lg bg-amber-500 flex flex-col items-center justify-center shadow-md">
                      <Bell className="w-4 h-4 text-white mb-1" />
                      <span className="text-white text-[10px] font-medium">Notify</span>
                    </div>
                    <div className="w-20 h-16 rounded-lg bg-purple-500 flex flex-col items-center justify-center shadow-md">
                      <Settings className="w-4 h-4 text-white mb-1" />
                      <span className="text-white text-[10px] font-medium">Escalate</span>
                    </div>
                    <div className="w-20 h-16 rounded-lg bg-green-500 flex flex-col items-center justify-center shadow-md">
                      <CheckCircle className="w-4 h-4 text-white mb-1" />
                      <span className="text-white text-[10px] font-medium">Log</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Execute multiple actions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Flow Example - Mobile/Tablet */}
          <div className="lg:hidden border-0 rounded-xl overflow-hidden bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg mb-4 sm:mb-6">
            <div className="p-4 sm:p-5">
              <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">Example: SLA Warning Workflow</h5>
              <div className="space-y-3">
                {/* Trigger */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">TRIGGER</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">SLA Warning - Ticket approaches deadline</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-gray-400" />
                </div>
                {/* Condition */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">CONDITION</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Priority = High or Urgent</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-gray-400" />
                </div>
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Bolt className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300">ACTIONS</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] rounded">Notify Team</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] rounded">Escalate</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-300 text-[10px] rounded">Log</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="border-0 rounded-xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">Why Automate?</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Save Time</h6>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Reduce manual tasks by up to 70%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Consistency</h6>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Ensure consistent responses every time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Never Miss</h6>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Automatic escalation prevents SLA breaches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Scale Operations</h6>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Handle more tickets with same team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Triggers Section */}
        <div id="triggers" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-amber-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Trigger Types</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {triggerTypes.map((category) => (
              <div key={category.category} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{category.category}</h5>
                </div>
                <div className="p-3 sm:p-4 space-y-3">
                  {category.triggers.map((trigger) => (
                    <div key={trigger.name} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{trigger.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{trigger.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduling Section */}
        <div id="scheduling" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Scheduling & SLA</h4>
          </div>
          
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">SLA Rules</h5>
                  <ul className="space-y-2">
                    {["First response time by priority", "Resolution time targets", "Business hours configuration", "Holiday calendars", "Multiple SLA policies"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">Escalation Rules</h5>
                  <ul className="space-y-2">
                    {["Auto-escalate on SLA breach", "Manager notification on critical", "Customer notification delays", "Escalation history logging", "Skip weekends option"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div id="analytics" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Workflow Analytics</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Automation Stats", metric: "1,247", label: "Actions automated/month", icon: Gauge, color: "blue" },
              { title: "Time Saved", metric: "48h", label: "Per team per month", icon: Timer, color: "green" },
              { title: "SLA Compliance", metric: "94%", label: "Tickets on time", icon: Target, color: "amber" }
            ].map((stat) => (
              <div key={stat.title} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      stat.color === "green" ? "bg-green-500/10 text-green-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.title}</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{stat.metric}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beta Signup Section */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <Bolt className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">Be the First to Know</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sign up for early access to Workflow Tools and get notified when new features launch.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => navigate("/client-dashboard/new-ticket")}
                    className="px-4 sm:px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Request Early Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl mb-6 sm:mb-8">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Want to Learn More?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              Our team is happy to discuss how Workflow Tools can help your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => navigate("/client-dashboard/new-ticket")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit a Ticket
              </button>
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowToolsPage;
