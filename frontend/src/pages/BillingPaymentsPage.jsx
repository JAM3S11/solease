import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { 
  CreditCard, 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ArrowLeft,
  Clock,
  Mail,
  Ticket,
  Headphones,
  Bell,
  CheckCircle,
  AlertCircle,
  Shield,
  Download,
  Building,
  Wallet,
  PieChart,
  BarChart3,
  ChevronRight,
  Lock,
  RefreshCw,
  Star,
  Zap
} from "lucide-react";

const BillingPaymentsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("coming-soon");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "features", title: "Features" },
    { id: "timeline", title: "Timeline" },
    { id: "faq", title: "FAQ" },
  ];

  const upcomingFeatures = [
    {
      id: "invoices",
      title: "Invoices & Billing History",
      description: "View and download all your invoices, track payment history, and manage billing cycles.",
      icon: Receipt,
      color: "blue",
      comingDate: "Q2 2026",
      details: [
        "Download invoices in PDF format",
        "View payment history by date range",
        "Filter by payment status",
        "Export billing data for accounting"
      ]
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      description: "Add, update, or remove credit cards and other payment methods securely.",
      icon: CreditCard,
      color: "green",
      comingDate: "Q2 2026",
      details: [
        "Multiple card support",
        "Bank account connections",
        "Automatic payment updates",
        "Secure card storage"
      ]
    },
    {
      id: "usage",
      title: "Usage & Quotas",
      description: "Monitor your ticket usage, storage limits, and feature quotas in real-time.",
      icon: TrendingUp,
      color: "purple",
      comingDate: "Q3 2026",
      details: [
        "Real-time usage dashboard",
        "Storage consumption tracking",
        "API call limits monitoring",
        "Quota alert notifications"
      ]
    },
    {
      id: "subscriptions",
      title: "Subscription Management",
      description: "Upgrade, downgrade, or modify your subscription plan with ease.",
      icon: DollarSign,
      color: "amber",
      comingDate: "Q2 2026",
      details: [
        "One-click plan upgrades",
        "Prorated billing adjustments",
        "Plan comparison tools",
        "Trial period access"
      ]
    }
  ];

  const timelineEvents = [
    { phase: "Phase 1", title: "Core Billing", description: "Invoices, payment methods, and basic subscriptions", quarter: "Q2 2026", status: "in-progress" },
    { phase: "Phase 2", title: "Advanced Features", description: "Usage tracking, quotas, and analytics", quarter: "Q3 2026", status: "planned" },
    { phase: "Phase 3", title: "Enterprise", description: "Multi-seat billing, custom invoicing, and API access", quarter: "Q4 2026", status: "planned" }
  ];

  const faqs = [
    { question: "Will my current subscription be affected?", answer: "No, your current subscription will continue as normal. The new billing system will work alongside your existing plan seamlessly." },
    { question: "Will prices change with the new system?", answer: "We'll notify all users at least 30 days before any pricing changes. Current pricing will be honored for existing customers." },
    { question: "Can I export my billing history?", answer: "Yes, you'll be able to export your complete billing history including all invoices and payment records." },
    { question: "Is my payment information secure?", answer: "Absolutely. We use industry-standard encryption and are PCI DSS compliant. Your payment data is never stored on our servers." }
  ];

  const pricingTiers = [
    { name: "Starter", price: "$9.99/mo", features: ["50 tickets/month", "1 GB storage", "Email support"], current: false },
    { name: "Pro", price: "$29.99/mo", features: ["500 tickets/month", "10 GB storage", "Priority support", "Analytics"], current: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited tickets", "Unlimited storage", "24/7 support", "Custom integrations"], coming: true }
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

        {/* Section Navigation */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="hidden md:inline">{section.title}</span>
              <span className="md:hidden">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div id="overview" className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25 flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Billing & Payments</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] sm:text-xs font-bold rounded-full uppercase">Coming Soon</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Full billing management is on its way!</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              We're working hard to bring you a complete billing and payments experience. 
              Soon you'll be able to manage invoices, payment methods, subscriptions, and usage quotas all in one place.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-full">Invoices</span>
              <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full">Payment Methods</span>
              <span className="px-2.5 sm:px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">Usage Tracking</span>
              <span className="px-2.5 sm:px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold rounded-full">Subscriptions</span>
            </div>
          </div>
        </div>

        {/* Current Account Info (Placeholder) */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Current Subscription</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Basic plan information</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pro Plan</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] sm:text-xs font-medium rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">$29.99/month • Billed monthly</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next billing date</p>
                <p className="font-semibold text-gray-900 dark:text-white">April 15, 2026</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                For billing inquiries, please contact our support team or submit a ticket.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Preview */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-green-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Pricing Plans</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg ${tier.current ? 'ring-2 ring-green-500' : ''}`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{tier.name}</h5>
                    {tier.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] sm:text-xs font-medium rounded-full">Current</span>}
                    {tier.coming && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] sm:text-xs font-medium rounded-full">Coming</span>}
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{tier.price}</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Features with Details */}
        <div id="features" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-green-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Upcoming Features</h4>
          </div>
          
          <div className="space-y-4">
            {upcomingFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
              >
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      feature.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      feature.color === "green" ? "bg-green-500/10 text-green-500" :
                      feature.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{feature.title}</h5>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs font-medium rounded-full self-start">
                          {feature.comingDate}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">What's included:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div id="timeline" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Release Timeline</h4>
          </div>
          
          <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4 sm:space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.phase} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        event.status === "in-progress" ? "bg-green-500 text-white" :
                        event.status === "planned" ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" :
                        "bg-green-100 text-green-500"
                      }`}>
                        {event.status === "in-progress" ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4 sm:pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{event.phase}</span>
                        <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full self-start ${
                          event.status === "in-progress" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                          {event.status === "in-progress" ? "In Progress" : event.quarter}
                        </span>
                      </div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h5>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="border-0 rounded-xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">Your Payments Are Secure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We're committed to keeping your payment information safe and secure.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-lg">
                    <Lock className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">256-bit Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-lg">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-lg">
                    <Building className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Secure Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-green-500" />
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h4>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-5">
                  <h5 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h5>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify Me Section */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Get Notified</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Want to be the first to know when billing features launch? Let us know!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => navigate("/client-dashboard/new-ticket")}
                    className="px-4 sm:px-5 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Request Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Now */}
        <div className="border-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl mb-6 sm:mb-8">
          <div className="p-5 sm:p-6 lg:p-8 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Need Billing Help Now?</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto">
              Our support team can assist you with any billing questions while we work on the full billing experience.
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

export default BillingPaymentsPage;