import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronRight, Zap, Shield, Brain, ArrowRight, Check, CheckCircle2, Clock, Users, BarChart3, Building2, Lock, Database, HeadphonesIcon, Globe, Mail, MessageSquare, Bell, FileText, Settings, Workflow, Bot, Ticket, ShieldCheck, UserCheck, UserCog } from 'lucide-react'; 
import { Link } from 'react-router';

const services = [
  { id: "ticket-management", title: "Ticket Management", shortDesc: "Complete ticket lifecycle management with automated routing", description: "Our comprehensive ticket management system handles every aspect of support ticket workflows. From initial submission to final resolution, track, prioritize, and manage tickets with powerful automation rules and SLA tracking.", features: ["Automated Ticket Routing", "Priority Level Management", "SLA Tracking & Alerts", "Ticket Merging & Linking", "Custom Ticket Fields", "Email & API Integration"], tasks: ["SLA Tracking", "Priority Management", "Auto-Routing"] },
  { id: "ai-powered-triage", title: "AI-Powered Triage", shortDesc: "Smart ticket analysis using Natural Language Processing", description: "Revolutionize your support workflow with our AI-powered triage system. Our advanced NLP algorithms analyze ticket content to determine urgency, sentiment, and category—routing tickets to the right team instantly.", features: ["Natural Language Processing", "Sentiment Analysis", "Smart Category Assignment", "Automatic Priority Detection", "Intent Recognition", "AI-Suggested Responses"], tasks: ["Smart Routing", "Sentiment Analysis", "Auto-Categorization"], isAI: true },
  { id: "analytics-dashboard", title: "Analytics & Reporting", shortDesc: "Real-time insights and comprehensive performance metrics", description: "Transform raw data into actionable insights with our advanced analytics dashboard. Monitor team performance, track resolution times, identify trends, and make data-driven decisions to improve your support operations.", features: ["Real-Time Dashboards", "Custom Report Builder", "Team Performance Metrics", "Trend Analysis", "Export to CSV/PDF", "Predictive Insights"], tasks: ["Real-Time Dashboard", "Custom Reports", "Performance Metrics"] },
  { id: "user-management", title: "User Management", shortDesc: "Comprehensive role-based access control system", description: "Manage users, roles, and permissions with our flexible user management system. Configure custom roles, set access levels, and maintain security with comprehensive audit logs and SSO integration.", features: ["Role-Based Access Control", "Custom Role Creation", "SSO Integration", "User Activity Logs", "Bulk User Import", "Department Management"], tasks: ["Role Management", "Access Control", "Custom Branding"] },
  { id: "automation-workflows", title: "Automation & Workflows", shortDesc: "Streamline operations with intelligent automation", description: "Eliminate manual tasks with powerful automation workflows. Create custom automation rules for ticket assignment, status updates, notifications, and escalation triggers based on your specific business requirements.", features: ["Visual Workflow Builder", "Automated Assignment", "SLA Escalation Rules", "Custom Triggers", "Notification Automation", "Auto-Response Templates"], tasks: ["Workflow Automation", "Escalation Rules", "Auto-Responses"] },
  { id: "security-compliance", title: "Security & Compliance", shortDesc: "Enterprise-grade security and regulatory compliance", description: "Protect your data with our comprehensive security framework. From encryption to compliance certifications, we provide the tools and features needed to meet the most stringent security requirements.", features: ["AES-256 Encryption", "SOC 2 Compliance", "GDPR Ready", "Audit Logging", "Data Backup & Recovery", "Penetration Testing"], tasks: ["Data Encryption", "Compliance", "Audit Logs"] },
  { id: "integrations", title: "Integrations & API", shortDesc: "Connect with your existing tools ecosystem", description: "Seamlessly integrate SOLEASE with your existing tools and workflows. Our extensive integration library and robust API allow you to connect with popular platforms and build custom integrations.", features: ["Slack Integration", "Microsoft Teams", "Jira & Zendesk", "Custom Webhooks", "RESTful API", "GraphQL API"], tasks: ["Third-Party Apps", "Custom API", "Webhooks"] },
  { id: "omnichannel-support", title: "Omnichannel Support", shortDesc: "Unified support across all communication channels", description: "Deliver consistent support experience across email, chat, web forms, and social media. All customer interactions are consolidated into a single, unified dashboard for seamless ticket management.", features: ["Email Ticketing", "Live Chat", "Web Forms", "Social Media Integration", "Phone Support", "Knowledge Base"], tasks: ["Multi-Channel", "Unified Inbox", "Customer History"] }
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
  const filteredServices = services.filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full bg-[#060b18] font-sans">
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(6,182,212,0.1) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 20% 70%, rgba(139,92,246,0.1) 0%, transparent 60%)` }} />
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Our Services</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight">Powerful Support Solutions</h1>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto mb-6">Comprehensive platform designed to streamline your <span className="text-blue-400 font-medium">IT support operations</span> and deliver exceptional user experiences. From AI-powered triage to enterprise-grade security.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all text-sm">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-6 py-3 rounded-full font-medium transition-all text-sm">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">How It Works</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Getting Started is Easy</h2>
            <p className="text-white/[0.48] text-sm md:text-base mt-3 max-w-2xl mx-auto">Follow these four simple steps to transform your support operations with SOLEASE</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all">
                <div className="w-14 h-14 bg-blue-600/[0.12] rounded-full flex items-center justify-center text-blue-400 mx-auto mb-4"><step.icon size={24} /></div>
                <h4 className="font-medium text-white mb-2 text-xs md:text-sm">{step.title}</h4>
                <p className="text-white/[0.48] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Why SOLEASE</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Benefits That Matter</h2>
            <p className="text-white/[0.48] text-sm md:text-base mt-3 max-w-2xl mx-auto">Discover why thousands of organizations trust SOLEASE for their support operations</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all">
                <div className="w-12 h-12 bg-blue-600/[0.12] rounded-xl flex items-center justify-center text-blue-400 mb-4"><benefit.icon size={24} /></div>
                <h4 className="font-medium text-white mb-2 text-xs md:text-sm">{benefit.title}</h4>
                <p className="text-white/[0.48] text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">What We Offer</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Explore Our Services</h2>
            <p className="text-white/[0.48] text-sm md:text-base mt-3 max-w-2xl mx-auto">Comprehensive solutions tailored to transform your support operations</p>
          </motion.div>
          <div className="relative max-w-xl mx-auto mb-12 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-white/[0.38]" /></div>
            <input type="text" placeholder="Search for a service..." className="block w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.12] focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-normal text-white placeholder:text-white/[0.38] text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredServices.map((service) => (
                <motion.div layout key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -8 }} className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-300 flex flex-col">
                  {service.isAI && (<div className="absolute top-4 right-4 z-20"><span className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-[10px] font-medium uppercase rounded-full"><Sparkles size={10} /> AI Powered</span></div>)}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="w-12 h-12 bg-blue-600/[0.12] rounded-xl flex items-center justify-center text-blue-400 mb-4"><Ticket size={22} /></div>
                    <h3 className="text-base font-medium text-white mb-2">{service.title}</h3>
                    <p className="text-white/[0.48] text-sm mb-4 leading-relaxed">{service.description}</p>
                    {service.features && (<div className="mb-4"><p className="text-[10px] font-medium text-white/[0.35] uppercase mb-2">Key Features</p><ul className="space-y-1.5">{service.features.slice(0, 4).map((feature, i) => (<li key={i} className="flex items-center gap-2 text-white/[0.48] text-xs"><Check size={12} className="text-blue-400 flex-shrink-0" />{feature}</li>))}</ul></div>)}
                    {service.tasks && (<div className="mt-auto flex flex-wrap gap-2">{service.tasks.map((task, i) => (<span key={i} className="px-2 py-0.5 bg-blue-600/[0.12] text-blue-400 text-[10px] font-medium uppercase rounded-full">{task}</span>))}</div>)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Plans & Pricing</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Choose Your Plan</h2>
            <p className="text-white/[0.48] text-sm md:text-base mt-3 max-w-2xl mx-auto">Select the perfect plan for your team's needs. All plans include a 14-day free trial.</p>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead><tr className="border-b border-white/[0.06]"><th className="text-left py-4 px-4 font-medium text-white text-sm">Feature</th><th className="text-center py-4 px-4 font-medium text-white/[0.6] text-sm">Basic</th><th className="text-center py-4 px-4 font-medium text-blue-400 bg-blue-600/[0.1] rounded-t-xl text-sm">Pro</th><th className="text-center py-4 px-4 font-medium text-white text-sm">Enterprise</th></tr></thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-white/[0.06] hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white/[0.6] font-normal text-sm">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{typeof row.basic === 'boolean' ? (row.basic ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-white/[0.2]">—</span>) : <span className="text-white/[0.38] text-sm">{row.basic}</span>}</td>
                    <td className="py-3 px-4 text-center bg-blue-600/[0.05]">{typeof row.pro === 'boolean' ? (row.pro ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-white/[0.2]">—</span>) : <span className="text-blue-400 font-normal text-sm">{row.pro}</span>}</td>
                    <td className="py-3 px-4 text-center">{typeof row.enterprise === 'boolean' ? (row.enterprise ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-white/[0.2]">—</span>) : <span className="text-white font-medium text-sm">{row.enterprise}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mx-auto mb-6"><Building2 size={32} /></div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-4">Enterprise Solutions</h3>
              <p className="text-white/[0.48] max-w-2xl mx-auto mb-6 text-sm md:text-base leading-relaxed">Need a custom solution? Our enterprise team specializes in tailored implementations for large organizations with complex requirements.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all text-sm">
                  Contact Sales <ArrowRight size={16} />
                </Link>
                <button className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-6 py-3 rounded-full font-medium transition-all text-sm">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#060b18]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-6 h-px bg-blue-600"></span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">FAQ</span>
                <span className="w-6 h-px bg-blue-600"></span>
              </div>
              <h2 className="text-xl font-medium text-white">Frequently Asked Questions</h2>
              <p className="text-white/[0.48] mt-2 text-sm">Everything you need to know about SOLEASE</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="collapse collapse-plus bg-white/[0.03] rounded-lg border border-white/[0.07]">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-normal text-white flex items-center gap-3">
                    <span className="text-blue-400 text-xs font-medium">0{i + 1}</span>{faq.q}
                  </div>
                  <div className="collapse-content text-white/[0.48] pl-8"><p className="text-sm">{faq.a}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#080e1e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 md:p-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-3">Ready to Get Started?</h2>
            <p className="text-white/[0.48] mb-6 max-w-xl mx-auto text-sm">Join thousands of organizations already using SOLEASE to transform their support operations.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all text-sm">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-6 py-3 rounded-full font-medium transition-all text-sm">
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