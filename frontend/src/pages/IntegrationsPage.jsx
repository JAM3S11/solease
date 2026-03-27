import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  Code, 
  ArrowLeft,
  Plug,
  ArrowRight,
  CheckCircle,
  Globe,
  Mail,
  MessageSquare,
  Slack,
  Calendar,
  FileText,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Server,
  Workflow,
  Webhook,
  Settings,
  ExternalLink,
  Star,
  Users,
  Bell,
  RefreshCw,
  Shield,
  Loader,
  Headphones,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiZapier } from "react-icons/si";

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "popular", title: "Popular" },
    { id: "upcoming", title: "Upcoming" },
    { id: "api", title: "API Access" },
  ];

  const popularIntegrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Get ticket notifications and respond directly from Slack channels.",
      icon: Slack,
      color: "bg-[#4A154B]",
      category: "Communication",
      status: "coming-soon",
      releaseDate: "Q3 2026"
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect with 5,000+ apps and automate workflows without coding.",
      icon: SiZapier,
      color: "bg-[#FF4A00]",
      category: "Automation",
      status: "coming-soon",
      releaseDate: "Q3 2026"
    },
    {
      id: "github",
      name: "GitHub",
      description: "Link tickets to GitHub issues and track bug fixes end-to-end.",
      icon: FaGithub,
      color: "bg-[#181717]",
      category: "Development",
      status: "coming-soon",
      releaseDate: "Q4 2026"
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync customer data and ticket history with your CRM.",
      icon: Cloud,
      color: "bg-[#00A1E0]",
      category: "CRM",
      status: "coming-soon",
      releaseDate: "Q4 2026"
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Seamless integration with HubSpot CRM for unified customer view.",
      icon: Database,
      color: "bg-[#FF7A59]",
      category: "CRM",
      status: "coming-soon",
      releaseDate: "Q4 2026"
    },
    {
      id: "jira",
      name: "Jira",
      description: "Create Jira issues from support tickets and track development progress.",
      icon: Workflow,
      color: "bg-[#0052CC]",
      category: "Project Management",
      status: "coming-soon",
      releaseDate: "Q4 2026"
    }
  ];

  const upcomingIntegrations = [
    { name: "Microsoft Teams", category: "Communication", icon: Users },
    { name: "Discord", category: "Community", icon: MessageSquare },
    { name: "Twilio", category: "SMS/Voice", icon: Smartphone },
    { name: "Intercom", category: "Chat", icon: MessageSquare },
    { name: "Freshdesk", category: "Support", icon: Headphones },
    { name: "Zendesk", category: "Support", icon: Headphones },
    { name: "Shopify", category: "E-commerce", icon: Globe },
    { name: "WordPress", category: "CMS", icon: Globe },
    { name: "Notion", category: "Documentation", icon: FileText },
    { name: "Trello", category: "Project Management", icon: Workflow },
    { name: "Asana", category: "Project Management", icon: CheckCircle },
    { name: "Google Calendar", category: "Scheduling", icon: Calendar }
  ];

  const integrationCategories = [
    { name: "Communication", icon: MessageSquare, count: 4 },
    { name: "CRM", icon: Database, count: 3 },
    { name: "Project Management", icon: Workflow, count: 3 },
    { name: "Automation", icon: SiZapier, count: 2 },
    { name: "Development", icon: FaGithub, count: 2 },
    { name: "E-commerce", icon: Globe, count: 2 }
  ];

  const apiFeatures = [
    {
      title: "RESTful API",
      description: "Full REST API access with JSON responses",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Webhooks",
      description: "Real-time event notifications to your endpoints",
      icon: Webhook,
      color: "purple"
    },
    {
      title: "SDK Libraries",
      description: "Official SDKs for Node.js, Python, and more",
      icon: Code,
      color: "green"
    },
    {
      title: "GraphQL",
      description: "Flexible query language for precise data fetching",
      icon: Database,
      color: "amber"
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

        {/* Coming Soon Banner */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/25 flex-shrink-0">
                <Plug className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Integrations</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 text-[10px] sm:text-xs font-bold rounded-full uppercase">Coming Soon</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Connect with your favorite tools and extend functionality</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Our upcoming integrations marketplace will let you connect SOLEASE with the tools you already use. 
              From communication platforms to CRM systems, build a unified workflow that works for your team.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Slack</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Zapier</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">GitHub</span>
              <span className="px-2.5 sm:px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold rounded-full">CRM</span>
              <span className="px-2.5 sm:px-3 py-1 bg-slate-500/10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold rounded-full">API</span>
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
                  ? "bg-slate-500 text-white shadow-lg shadow-slate-500/25"
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
            <Code className="w-5 h-5 text-slate-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Integration Categories</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {integrationCategories.map((category) => (
              <div key={category.name} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg p-3 sm:p-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1">{category.name}</h5>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{category.count} integrations</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Integrations Section */}
        <div id="popular" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-slate-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Popular Integrations</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularIntegrations.map((integration) => (
              <div key={integration.id} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${integration.color}`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{integration.name}</h5>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs font-medium rounded-full flex-shrink-0">
                          {integration.releaseDate}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{integration.category}</span>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                      Learn more <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Integrations Section */}
        <div id="upcoming" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-slate-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">More Coming Soon</h4>
          </div>
          
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {upcomingIntegrations.map((integration) => (
                  <div key={integration.name} className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center flex-shrink-0">
                      <integration.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{integration.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{integration.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API Access Section */}
        <div id="api" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-slate-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Developer API</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
            {apiFeatures.map((feature) => (
              <div key={feature.title} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      feature.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      feature.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                      feature.color === "green" ? "bg-green-500/10 text-green-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h5>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API Code Example */}
          <div className="border-0 rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-lg">
            <div className="p-3 sm:p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">API Example</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 overflow-x-auto">
              <pre className="text-xs sm:text-sm text-gray-300 font-mono">
{`// Get all tickets
const tickets = await solease.api.tickets.list({
  status: 'open',
  priority: 'high',
  limit: 10
});

// Create a new ticket
const ticket = await solease.api.tickets.create({
  subject: 'Help needed',
  description: 'Issue details...',
  priority: 'high'
});

// Webhook setup
await solease.webhooks.create({
  url: 'https://your-app.com/webhook',
  events: ['ticket.created', 'ticket.resolved']
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* Request Integration Section */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Plug className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">Don't See What You Need?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Request a new integration and we'll work with you to make it happen.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => navigate("/client-dashboard/new-ticket")}
                    className="px-4 sm:px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Request Integration
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
              Our team is happy to discuss integration options for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => navigate("/client-dashboard/new-ticket")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" />
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

export default IntegrationsPage;
