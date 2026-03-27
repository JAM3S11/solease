import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  Rocket, 
  UserPlus, 
  LayoutDashboard, 
  Ticket, 
  Lock, 
  Zap, 
  CheckCircle,
  Headphones,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Play,
  Clock,
  Users,
  FileText,
  Bell,
  Settings,
  Star,
  ArrowDown,
  TrendingUp,
  Shield,
  BarChart3,
  Calendar,
  Mail,
  Building,
  ExternalLink,
  Video,
  BookOpen,
  Compass
} from "lucide-react";

const GettingStartedPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "signup", title: "Account" },
    { id: "dashboard", title: "Dashboard" },
    { id: "tickets", title: "Tickets" },
    { id: "security", title: "Security" },
  ];

  const features = [
    { icon: Ticket, title: "Ticket Management", description: "Create, track, and manage support tickets with ease", color: "purple" },
    { icon: BarChart3, title: "Analytics", description: "View real-time metrics and performance insights", color: "blue" },
    { icon: Users, title: "Team Collaboration", description: "Work together with your team on support cases", color: "amber" },
    { icon: Shield, title: "Secure Access", description: "Enterprise-grade security for your data", color: "green" },
    { icon: Bell, title: "Notifications", description: "Stay updated with real-time alerts", color: "red" },
    { icon: Clock, title: "SLA Tracking", description: "Never miss a deadline with SLA management", color: "primary" }
  ];

  const quickStartSteps = [
    { step: 1, title: "Create Account", description: "Sign up with your email", duration: "2 min" },
    { step: 2, title: "Verify Email", description: "Click the verification link", duration: "1 min" },
    { step: 3, title: "Complete Profile", description: "Add your details", duration: "3 min" },
    { step: 4, title: "Submit First Ticket", description: "Get help from our team", duration: "5 min" }
  ];

  const guides = [
    {
      id: "signup",
      title: "Create Your Account",
      description: "Sign up and get started with SOLEASE in minutes",
      icon: UserPlus,
      color: "primary",
      steps: [
        { title: "Visit the Registration Page", desc: "Navigate to our signup page by clicking the 'Sign Up' button on the login page. You'll find this button prominently displayed on the landing page." },
        { title: "Enter Your Information", desc: "Fill in your full name, a valid email address, and create a secure password. For optimal security, use a combination of uppercase letters, lowercase letters, numbers, and special characters (e.g., MyS3cur3P@ss!)." },
        { title: "Verify Your Email", desc: "Check your inbox (and spam folder, just in case) for a verification email from SOLEASE. Click the verification link to activate your account. The link expires after 24 hours." },
        { title: "Complete Your Profile", desc: "Add your company information, upload a profile picture, and set your notification preferences. A complete profile helps our team provide better support." }
      ]
    },
    {
      id: "dashboard",
      title: "Navigating the Dashboard",
      description: "Learn how to use the main dashboard features",
      icon: LayoutDashboard,
      color: "blue",
      steps: [
        { title: "Access the Dashboard", desc: "After logging in, you'll be automatically redirected to your personalized dashboard. The dashboard is your central hub for managing all support activities." },
        { title: "Understand the Layout", desc: "The dashboard consists of three main areas: the left sidebar for navigation, the main content area for tickets and information, and the right sidebar for quick actions and stats." },
        { title: "View Quick Stats", desc: "The top section displays key metrics including open tickets, resolved cases, average response times, and customer satisfaction scores. These update in real-time." },
        { title: "Use Quick Actions", desc: "The sidebar provides instant access to common tasks like creating new tickets, viewing your ticket history, accessing reports, and updating your profile settings." },
        { title: "Customize Your View", desc: "Click the settings icon on any widget to rearrange, resize, or hide specific metrics. Your preferences are automatically saved for future sessions." }
      ]
    },
    {
      id: "tickets",
      title: "Creating & Managing Tickets",
      description: "Step-by-step guide to ticket management",
      icon: Ticket,
      color: "purple",
      steps: [
        { title: "Create a New Ticket", desc: "Click the 'New Ticket' button (found in the sidebar or dashboard quick actions). Fill in the subject (be specific), description (include all relevant details), and select the appropriate priority level (Low, Medium, High, or Urgent)." },
        { title: "Categorize Your Ticket", desc: "Select a relevant category from the dropdown menu (e.g., Technical Issue, Billing Inquiry, Feature Request, General Question). This helps route your ticket to the right specialist faster." },
        { title: "Attach Files", desc: "Use the paperclip icon to attach screenshots, documents, or log files that help illustrate your issue. Maximum file size is 10MB. Supported formats: JPG, PNG, PDF, DOCX, TXT." },
        { title: "Submit and Track", desc: "Click 'Submit Ticket' to send your request. You'll receive a confirmation email with your ticket ID. Use this ID to track progress in the 'My Tickets' section." },
        { title: "Monitor Status Changes", desc: "Ticket statuses include: Open (submitted, awaiting review), In Progress (being worked on), Resolved (solution provided), and Closed (confirmed resolved). You'll receive email notifications for status changes." },
        { title: "Provide Feedback", desc: "Once your ticket is marked as resolved, you'll receive a feedback request. Rate your experience and provide comments to help us improve our service." }
      ]
    },
    {
      id: "security",
      title: "Account Security",
      description: "Keep your account safe and secure",
      icon: Lock,
      color: "green",
      steps: [
        { title: "Enable Two-Factor Authentication (2FA)", desc: "Go to Settings > Security and enable 2FA. We support authenticator apps (Google Authenticator, Authy) and SMS verification. This adds an essential layer of protection to your account." },
        { title: "Use Strong, Unique Passwords", desc: "Create a strong password that's at least 12 characters long with a mix of letters, numbers, and symbols. Never reuse passwords across different services. Consider using a password manager." },
        { title: "Review Active Sessions", desc: "Regularly check Settings > Security > Active Sessions to see all devices currently logged into your account. If you notice any unfamiliar devices, click 'Sign Out' to terminate that session." },
        { title: "Keep Email Secure", desc: "Ensure the email associated with your SOLEASE account has proper security settings. Enable 2FA on your email provider and regularly monitor for suspicious activity." },
        { title: "Log Out on Shared Devices", desc: "Always click your profile icon and select 'Sign Out' when using shared or public computers. Never leave your account logged in on unattended devices." }
      ]
    }
  ];

  const whatNext = [
    { icon: BookOpen, title: "Explore Help Center", description: "Browse more guides and tutorials", link: "/help-support" },
    { icon: Video, title: "Watch Tutorials", description: "Video guides for common tasks", link: "#" },
    { icon: Star, title: "Rate Your Experience", description: "Help us improve our service", link: "#" },
    { icon: Users, title: "Invite Your Team", description: "Collaborate with colleagues", link: "#" }
  ];

  const currentGuide = guides.find(g => g.id === activeSection) || guides[0];
  const currentIndex = guides.findIndex(g => g.id === activeSection);

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

        {/* Introduction / Overview */}
        <div id="overview" className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Welcome to SOLEASE</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Your complete guide to getting started</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              This comprehensive guide will walk you through everything you need to know about using SOLEASE effectively. 
              From creating your account to managing tickets and securing your profile, we've covered every step to ensure you get the most out of our platform.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full">Account Setup</span>
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Dashboard</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Tickets</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">Security</span>
            </div>
          </div>
        </div>

        {/* Quick Start Timeline */}
        <div className="mb-6 sm:mb-8">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Get Started in Minutes
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickStartSteps.map((item, index) => (
              <div key={item.step} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg text-center p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 text-xs sm:text-sm font-bold">
                  {item.step}
                </div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h5>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">{item.description}</p>
                <span className="text-[10px] text-primary font-medium">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-6 sm:mb-8">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            What You Can Do with SOLEASE
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    feature.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                    feature.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                    feature.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                    feature.color === "green" ? "bg-green-500/10 text-green-500" :
                    feature.color === "red" ? "bg-red-500/10 text-red-500" :
                    "bg-primary/10 text-primary"
                  }`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
                  ? section.id === "overview" ? "bg-primary text-white shadow-lg shadow-primary/25" :
                    section.id === "signup" ? "bg-primary text-white shadow-lg shadow-primary/25" :
                    section.id === "dashboard" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" :
                    section.id === "tickets" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" :
                    "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="hidden md:inline">{section.title}</span>
              <span className="md:hidden">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Guide Sections */}
        <div className="space-y-6 sm:space-y-8">
          {guides.map((guide, guideIndex) => (
            <div 
              id={guide.id}
              key={guide.id}
              className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50"
            >
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                    guide.color === "primary" ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-primary/25" :
                    guide.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25" :
                    guide.color === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/25" :
                    "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25"
                  }`}>
                    <guide.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Section {guideIndex + 1}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{guide.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">{guide.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-800">
                <div className="space-y-4 sm:space-y-6">
                  {guide.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                          index === 0 
                            ? guide.color === "primary" ? "bg-primary text-white" :
                              guide.color === "blue" ? "bg-blue-500 text-white" :
                              guide.color === "purple" ? "bg-purple-500 text-white" :
                              "bg-green-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          {index + 1}
                        </div>
                        {index < guide.steps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 mt-1.5 sm:mt-2" style={{ minHeight: '16px' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-3 sm:pb-4">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's Next Section */}
        <div className="mt-6 sm:mt-8">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            What's Next?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {whatNext.map((item) => (
              <button
                key={item.title}
                onClick={() => item.link && navigate(item.link)}
                className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg p-4 text-left hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.title.includes("Help") ? "bg-primary/10 text-primary" :
                    item.title.includes("Video") ? "bg-red-500/10 text-red-500" :
                    item.title.includes("Rate") ? "bg-amber-500/10 text-amber-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg mt-6 sm:mt-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Pro Tips for Success</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Use specific ticket subjects for faster resolution</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Attach screenshots when reporting issues</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Enable 2FA for enhanced account security</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Check the FAQ section before submitting tickets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl mt-6 sm:mt-8 mb-6 sm:mb-8">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Still Need Help?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              If you can't find what you're looking for in this guide, our support team is here to assist you 24/7.
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
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GettingStartedPage;