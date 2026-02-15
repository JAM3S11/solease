import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronRight, Zap, Shield, Brain, ArrowRight, Check, Clock, Users, BarChart3, Building2, Lock, Database, HeadphonesIcon, Globe, Mail, MessageSquare, Bell, FileText, Settings, Workflow, Bot, Ticket, ShieldCheck, UserCheck, UserCog } from 'lucide-react'; 
import { Link } from 'react-router';

const services = [
  {
    id: "ticket-management",
    title: "Ticket Management",
    shortDesc: "Complete ticket lifecycle management with automated routing",
    description: "Our comprehensive ticket management system handles every aspect of support ticket workflows. From initial submission to final resolution, track, prioritize, and manage tickets with powerful automation rules and SLA tracking.",
    features: ["Automated Ticket Routing", "Priority Level Management", "SLA Tracking & Alerts", "Ticket Merging & Linking", "Custom Ticket Fields", "Email & API Integration"],
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1974&auto=format&fit=crop",
    tasks: ["SLA Tracking", "Priority Management", "Auto-Routing"]
  },
  {
    id: "ai-powered-triage",
    title: "AI-Powered Triage",
    shortDesc: "Smart ticket analysis using Natural Language Processing",
    description: "Revolutionize your support workflow with our AI-powered triage system. Our advanced NLP algorithms analyze ticket content to determine urgency, sentiment, and category—routing tickets to the right team instantly.",
    features: ["Natural Language Processing", "Sentiment Analysis", "Smart Category Assignment", "Automatic Priority Detection", "Intent Recognition", "AI-Suggested Responses"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    tasks: ["Smart Routing", "Sentiment Analysis", "Auto-Categorization"],
    isAI: true
  },
  {
    id: "analytics-dashboard",
    title: "Analytics & Reporting",
    shortDesc: "Real-time insights and comprehensive performance metrics",
    description: "Transform raw data into actionable insights with our advanced analytics dashboard. Monitor team performance, track resolution times, identify trends, and make data-driven decisions to improve your support operations.",
    features: ["Real-Time Dashboards", "Custom Report Builder", "Team Performance Metrics", "Trend Analysis", "Export to CSV/PDF", "Predictive Insights"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=870&auto=format&fit=crop",
    tasks: ["Real-Time Dashboard", "Custom Reports", "Performance Metrics"]
  },
  {
    id: "user-management",
    title: "User Management",
    shortDesc: "Comprehensive role-based access control system",
    description: "Manage users, roles, and permissions with our flexible user management system. Configure custom roles, set access levels, and maintain security with comprehensive audit logs and SSO integration.",
    features: ["Role-Based Access Control", "Custom Role Creation", "SSO Integration", "User Activity Logs", "Bulk User Import", "Department Management"],
    image: "https://images.unsplash.com/photo-1613347761493-4060c969cd28?q=80&w=774&auto=format&fit=crop",
    tasks: ["Role Management", "Access Control", "Custom Branding"]
  },
  {
    id: "automation-workflows",
    title: "Automation & Workflows",
    shortDesc: "Streamline operations with intelligent automation",
    description: "Eliminate manual tasks with powerful automation workflows. Create custom automation rules for ticket assignment, status updates, notifications, and escalation triggers based on your specific business requirements.",
    features: ["Visual Workflow Builder", "Automated Assignment", "SLA Escalation Rules", "Custom Triggers", "Notification Automation", "Auto-Response Templates"],
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop",
    tasks: ["Workflow Automation", "Escalation Rules", "Auto-Responses"]
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics",
    shortDesc: "AI-powered forecasting and anomaly detection",
    description: "Stay ahead of issues with predictive analytics. Our machine learning models analyze historical data to forecast support trends, detect anomalies, and alert you to potential problems before they impact your operations.",
    features: ["Anomaly Detection", "Trend Forecasting", "Capacity Planning", "Risk Assessment", "Historical Analysis", "Proactive Alerts"],
    image: "https://images.pexels.com/photos/5816299/pexels-photo-5816299.jpeg",
    tasks: ["Anomaly Detection", "Proactive Forecasts", "Risk Analysis"],
    isAI: true
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    shortDesc: "Enterprise-grade security and regulatory compliance",
    description: "Protect your data with our comprehensive security framework. From encryption to compliance certifications, we provide the tools and features needed to meet the most stringent security requirements.",
    features: ["AES-256 Encryption", "SOC 2 Compliance", "GDPR Ready", "Audit Logging", "Data Backup & Recovery", "Penetration Testing"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    tasks: ["Data Encryption", "Compliance", "Audit Logs"]
  },
  {
    id: "integrations",
    title: "Integrations & API",
    shortDesc: "Connect with your existing tools ecosystem",
    description: "Seamlessly integrate SOLEASE with your existing tools and workflows. Our extensive integration library and robust API allow you to connect with popular platforms and build custom integrations.",
    features: ["Slack Integration", "Microsoft Teams", "Jira & Zendesk", "Custom Webhooks", "RESTful API", "GraphQL API"],
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1000&auto=format&fit=crop",
    tasks: ["Third-Party Apps", "Custom API", "Webhooks"]
  },
  {
    id: "omnichannel-support",
    title: "Omnichannel Support",
    shortDesc: "Unified support across all communication channels",
    description: "Deliver consistent support experience across email, chat, web forms, and social media. All customer interactions are consolidated into a single, unified dashboard for seamless ticket management.",
    features: ["Email Ticketing", "Live Chat", "Web Forms", "Social Media Integration", "Phone Support", "Knowledge Base"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    tasks: ["Multi-Channel", "Unified Inbox", "Customer History"]
  }
];

const faqs = [
  { q: "How do I create a support ticket?", a: "Log in to your dashboard, click 'Create Ticket', enter your issue details, and submit. You'll receive a confirmation email and can track progress in real-time." },
  { q: "What user roles are available in SOLEASE?", a: "SOLEASE offers three main roles: Clients (submit and track tickets), Reviewers (assign, resolve, and escalate tickets), and Managers (oversee all operations, manage users, and generate reports)." },
  { q: "How does AI-powered triage work?", a: "Our AI analyzes incoming tickets using Natural Language Processing to understand content, detect sentiment, and determine urgency. It then automatically routes tickets to the most appropriate team member based on expertise and current workload." },
  { q: "Can I integrate SOLEASE with my existing tools?", a: "Yes! We offer native integrations with Slack, Microsoft Teams, Jira, Zendesk, and more. Our RESTful API and webhooks allow for unlimited custom integrations." },
  { q: "What analytics and reporting features are available?", a: "Our analytics dashboard provides real-time insights, custom report builders, team performance metrics, response time tracking, trend analysis, and export capabilities to CSV/PDF." },
  { q: "How secure is my data with SOLEASE?", a: "We use AES-256 encryption, maintain SOC 2 compliance, follow GDPR guidelines, provide comprehensive audit logging, and offer SSO integration for enterprise-grade security." },
  { q: "What SLA guarantees do you offer?", a: "Our Pro plan includes standard SLA guarantees, while Enterprise plans offer custom SLA configurations tailored to your specific business requirements." },
  { q: "Is there a free trial available?", a: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started." },
  { q: "What kind of support do you offer?", a: "We provide 24/7 enterprise support, comprehensive documentation, video tutorials, and dedicated account managers for Enterprise clients." },
  { q: "Can SOLEASE handle multiple communication channels?", a: "Absolutely! Our omnichannel support consolidates email, live chat, web forms, and social media into a single unified dashboard for seamless customer interactions." }
];

const processSteps = [
  { icon: Clock, title: "Quick Onboarding", desc: "Get started in minutes with our guided setup. Create your account, invite team members, and configure basic settings—all in a few clicks." },
  { icon: Users, title: "Team Configuration", desc: "Set up roles and permissions for your team. Define Managers, Reviewers, and Clients with custom access levels to match your organization." },
  { icon: Brain, title: "AI Training", desc: "Our AI analyzes your support patterns and learns from your team's responses. The more you use it, the smarter it becomes at routing tickets." },
  { icon: Zap, title: "Go Live", desc: "Launch your help desk and start receiving tickets from email, web, chat, or API. Everything is centralized in one powerful dashboard." }
];

const benefits = [
  { icon: Zap, title: "60% Faster Resolution", desc: "AI-powered routing analyzes ticket content and automatically assigns to the right specialist, reducing handling time significantly." },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade AES-256 encryption, SOC 2 compliance, GDPR readiness, and comprehensive audit logs protect your data." },
  { icon: BarChart3, title: "Real-Time Insights", desc: "Comprehensive dashboards show response times, resolution rates, team performance, and trends for data-driven decisions." },
  { icon: Users, title: "Seamless Collaboration", desc: "Internal notes, ticket linking, and team assignments keep everyone aligned. No more scattered conversations or lost context." }
];

const comparison = [
  { feature: "AI-Powered Routing", basic: false, pro: true, enterprise: true },
  { feature: "Predictive Analytics", basic: false, pro: true, enterprise: true },
  { feature: "Custom Integrations", basic: false, pro: "3", enterprise: "Unlimited" },
  { feature: "24/7 Support", basic: false, pro: false, enterprise: true },
  { feature: "Dedicated Account Manager", basic: false, pro: false, enterprise: true },
  { feature: "SLA Guarantees", basic: false, pro: "Standard", enterprise: "Custom" },
  { feature: "On-Premise Deployment", basic: false, pro: false, enterprise: true }
];

const ServicePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gray-300/10 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gray-400/10 rounded-full blur-[180px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gray-500/5 rounded-full blur-[250px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Services</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Powerful Support Solutions</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              Comprehensive platform designed to streamline your{" "}
              <span className="text-blue-600 font-semibold">IT support operations</span> and deliver exceptional user experiences. From AI-powered triage to enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Getting Started is Easy</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Follow these four simple steps to transform your support operations with SOLEASE</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-gray-50 rounded-3xl p-8 hover:bg-blue-50 transition-colors"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <step.icon size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-gray-50 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Why SOLEASE</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Benefits That Matter</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Discover why thousands of organizations trust SOLEASE for their support operations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <benefit.icon size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">{benefit.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Explore Our Services</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Comprehensive solutions tailored to transform your support operations</p>
          </motion.div>

          <div className="relative max-w-xl mx-auto mb-16 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a service..."
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredServices.map((service) => (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {service.isAI && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-full">
                        <Sparkles size={10} /> AI Powered
                      </span>
                    </div>
                  )}

                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.description}</p>
                    
                    {service.features && (
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Key Features</p>
                        <ul className="space-y-2">
                          {service.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                              <Check size={14} className="text-blue-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.tasks && (
                      <div className="mt-auto flex flex-wrap gap-2 mb-4">
                        {service.tasks.map((task, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase rounded-full">
                            {task}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Pricing/Comparison Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-gray-50 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Plans & Pricing</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Select the perfect plan for your team's needs. All plans include a 14-day free trial.</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-6 px-6 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-6 px-6 font-bold text-gray-600">Basic</th>
                  <th className="text-center py-6 px-6 font-bold text-blue-600 bg-blue-50 rounded-t-2xl">Pro</th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-5 px-6 text-gray-700 font-medium">{row.feature}</td>
                    <td className="py-5 px-6 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-gray-500">{row.basic}</span>}
                    </td>
                    <td className="py-5 px-6 text-center bg-blue-50/50">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-gray-700 font-medium">{row.pro}</span>}
                    </td>
                    <td className="py-5 px-6 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-gray-900 font-bold">{row.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden min-h-[60vh] flex items-center justify-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-white mx-auto mb-8">
                <Building2 size={48} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">Enterprise Solutions</h3>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                Need a custom solution? Our enterprise team specializes in tailored implementations for large organizations with complex requirements. Get dedicated support, custom integrations, on-premise deployment, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all"
                >
                  Contact Sales
                  <ArrowRight size={20} />
                </Link>
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold transition-all">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 min-h-[100vh] bg-gray-50 flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-4">Everything you need to know about SOLEASE</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="collapse collapse-plus bg-gray-50 rounded-xl border border-gray-100">
                  <input type="checkbox" />
                  <div className="collapse-title text-base font-semibold text-gray-900 flex items-center gap-3">
                    <span className="text-blue-600 text-sm font-bold">0{i + 1}</span>
                    {faq.q}
                  </div>
                  <div className="collapse-content text-gray-600 pl-8">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 min-h-[35vh] bg-white flex items-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg p-10 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join thousands of organizations already using SOLEASE to transform their support operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/signup"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/contact"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
