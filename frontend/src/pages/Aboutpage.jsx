import React, { useState } from 'react'
import { Users, LayoutDashboard, ShieldCheck, Users2, TicketCheck, BarChart3, Bot, Sparkles, ArrowRight, Loader, Lock, Server, CheckCircle2, TrendingUp, Zap, Globe, Award, Star, FileText, Settings, Clock, Layers, Workflow, Smartphone, Database, Webhook, UserCheck, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';

const Aboutpage = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  
  const handleJoinMovement = async () => {
    setButtonLoading(true);
    setTimeout(() => {
      navigate('/signup');
      setButtonLoading(false);
    }, 300);
  };

  const capabilities = [
    { icon: TicketCheck, title: "Smart Ticketing", desc: "AI-powered ticket creation, categorization, and routing with NLP" },
    { icon: Bot, title: "Intelligent Automation", desc: "Auto-assignment, SLA tracking, and escalation rules" },
    { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time dashboards, custom reports, and predictive insights" },
    { icon: Users, title: "Role Management", desc: "Flexible roles: Clients, Reviewers, Managers with permissions" },
    { icon: ShieldCheck, title: "Enterprise Security", desc: "AES-256 encryption, SOC 2, GDPR, and audit logs" },
    { icon: Webhook, title: "Integrations", desc: "Connect with Slack, Teams, Jira, Zendesk, and custom APIs" }
  ];

  const roles = [
    { icon: UserCog, title: "Managers", desc: "Oversee all tickets, manage users, generate reports, configure system settings" },
    { icon: UserCheck, title: "Reviewers", desc: "Assign, resolve, and escalate tickets; provide feedback on resolutions" },
    { icon: Users, title: "Clients", desc: "Submit tickets, track progress, rate support experience, view history" }
  ];

  const features = [
    { title: "Ticket Lifecycle", items: ["Create via web/email/API", "Auto-categorization", "Priority levels & SLA", "Status tracking", "Resolution workflow", "Feedback collection"] },
    { title: "AI & Automation", items: ["NLP ticket analysis", "Smart routing", "Sentiment detection", "Auto-responses", "Escalation rules", "Predictive insights"] },
    { title: "Analytics", items: ["Real-time dashboards", "Response time metrics", "Team performance", "Trend analysis", "Custom reports", "Export to CSV/PDF"] },
    { title: "Security", items: ["End-to-end encryption", "Role-based access", "Audit logging", "GDPR compliance", "SSO integration", "Data backup"] }
  ];

  const integrations = [
    { name: "Slack", icon: "S", desc: "Team notifications" },
    { name: "Microsoft Teams", icon: "T", desc: "Enterprise chat" },
    { name: "Jira", icon: "J", desc: "Issue tracking" },
    { name: "Zendesk", icon: "Z", desc: "Support migration" },
    { name: "Webhook", icon: "W", desc: "Custom integrations" },
    { name: "API", icon: "A", desc: "Full access" }
  ];

  const stats = [
    { value: "10,000", suffix: "+", label: "Daily Active Users" },
    { value: "500,000", suffix: "+", label: "Tickets Resolved" },
    { value: "99", suffix: "%", label: "Uptime SLA" },
    { value: "24/7", label: "Support" }
  ];

  const testimonials = [
    { name: "Sarah Mitchell", role: "IT Director", company: "TechCorp", avatar: "SM", content: "SOLEASE transformed our support workflow. Response times improved by 60% within the first month.", rating: 5 },
    { name: "James Rodriguez", role: "Operations Manager", company: "Global Systems", avatar: "JR", content: "The analytics dashboard gives us insights we never had before. Data-driven decisions saved us thousands.", rating: 5 },
    { name: "Emily Chen", role: "Support Lead", company: "InnovateTech", avatar: "EC", content: "Our team loves the intuitive interface. We focus on solving problems, not managing tickets.", rating: 5 }
  ];
  
  return (
    <main className="w-full bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gray-300/10 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gray-400/10 rounded-full blur-[180px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gray-500/5 rounded-full blur-[250px]" />
        </div>
        
        <div className="relative z-10 px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium px-4 py-2 rounded-full mb-8"
            >
              <Sparkles size={14} />
              About SOLEASE
            </motion.span>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
              The intelligent<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                support platform
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              SOLEASE is an AI-powered ticketing platform that streamlines support operations—from ticket creation to resolution—with intelligent automation and actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                View Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl md:text-5xl font-black text-gray-900">
                  {stat.value}{stat.suffix}
                </span>
                <p className="text-gray-500 font-medium mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-24 md:py-32 bg-white">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Platform</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">A complete ticketing solution built for modern support teams</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4">
                  <cap.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cap.title}</h3>
                <p className="text-gray-600">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">User Roles</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for every team</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Three distinct roles tailored to your organization structure</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <role.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 text-sm">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Platform capabilities</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 size={14} className="text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Integrations</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Connect your tools</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white px-6 py-4 rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 md:py-32 bg-white">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Security</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Enterprise-grade protection</h2>
              <p className="text-gray-600 mb-8">
                Your data security is our top priority. SOLEASE implements industry-leading security measures to protect your information.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Lock, label: "AES-256 Encryption" },
                  { icon: ShieldCheck, label: "SOC 2 Compliant" },
                  { icon: Database, label: "GDPR Ready" },
                  { icon: Server, label: "99.9% Uptime" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <item.icon className="text-blue-600" size={20} />
                    <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[3rem] p-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-900">Security Features</span>
                  <ShieldCheck className="text-green-500" size={20} />
                </div>
                <div className="space-y-3">
                  {["End-to-end encryption", "Role-based access control", "Audit logging", "SSO integration", "Data backup & recovery", "Penetration testing"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 size={14} className="text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by teams</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-white">
        <div className="px-6 md:px-12 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to transform<br />
              <span className="text-blue-600">your support?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of organizations delivering exceptional support with SOLEASE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold transition-all">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Aboutpage;
