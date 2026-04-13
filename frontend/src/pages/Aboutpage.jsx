import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  Layers,
  Lock,
  ShieldCheck,
  TicketCheck,
  UserCheck,
  UserCog,
  Users,
  Webhook,
} from "lucide-react";
import { Link } from "react-router";

const stats = [
  { value: "10,000+", label: "Daily Active Users" },
  { value: "500,000+", label: "Tickets Resolved" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Enterprise Support" },
];

const currentOperations = [
  {
    icon: TicketCheck,
    title: "Multi-channel ticket intake",
    description: "SOLEASE is currently receiving tickets through web forms, email pipelines, and API requests into one operational queue.",
  },
  {
    icon: Bot,
    title: "AI-driven triage",
    description: "Incoming requests are analyzed for category, urgency, and sentiment to speed up assignment and reduce manual sorting.",
  },
  {
    icon: Clock3,
    title: "SLA monitoring and escalation",
    description: "Live SLA timers track first-response and resolution targets, with escalation rules triggered automatically when thresholds are at risk.",
  },
  {
    icon: Layers,
    title: "Workflow automation",
    description: "Status transitions, queue movement, and ownership updates are automated with rules that keep ticket flow consistent.",
  },
  {
    icon: Webhook,
    title: "Integration sync",
    description: "Connected tools sync ticket events in real time, helping teams collaborate without losing context across platforms.",
  },
  {
    icon: Database,
    title: "Analytics and reporting",
    description: "Support leaders track backlog health, response speed, and resolution patterns through active operational dashboards.",
  },
];

const systemCoverage = [
  {
    title: "Ticket Management Lifecycle",
    items: [
      "Ticket creation from web, email, and API",
      "Priority and category assignment",
      "Status tracking from open to resolved",
      "Ownership handoff between teams",
      "Resolution notes and closure flow",
      "Client feedback capture after resolution",
    ],
  },
  {
    title: "AI Intelligence Layer",
    items: [
      "Intent and sentiment analysis on incoming tickets",
      "Urgency detection for smarter prioritization",
      "Suggested routing for faster assignment",
      "AI-assisted response and resolution support",
      "Pattern recognition for recurring issue types",
      "Decision support for high-risk ticket queues",
    ],
  },
  {
    title: "Workflow and Automation",
    items: [
      "Rule-based assignment and queue movement",
      "Automatic SLA tracking and breach detection",
      "Escalation triggers for delayed tickets",
      "Status transition automation by policy",
      "Notification workflows for key lifecycle events",
      "Repeatable process enforcement across teams",
    ],
  },
  {
    title: "Roles and Team Operations",
    items: [
      "Manager oversight of queues and team performance",
      "Reviewer execution of investigation and resolution",
      "Client self-service submission and ticket tracking",
      "Role-based visibility into ticket data",
      "Permission-based controls on actions",
      "Cross-team collaboration under one platform",
    ],
  },
  {
    title: "Analytics and Reporting",
    items: [
      "Real-time dashboards for ticket health",
      "Response and resolution time monitoring",
      "Backlog trend and workload analysis",
      "Team productivity and throughput metrics",
      "Service quality visibility for managers",
      "Operational insights for process optimization",
    ],
  },
  {
    title: "Security, Compliance, and Reliability",
    items: [
      "Role-based access and permission control",
      "Audit logs for ticket and user activity",
      "Data encryption and secure handling",
      "Operational continuity and backup safeguards",
      "Compliance-ready process controls",
      "Service availability monitoring and uptime focus",
    ],
  },
];

const operationalSnapshot = [
  { metric: "Average first response", value: "< 4 hours", note: "Measured against SLA rules and queue activity." },
  { metric: "Prioritization model", value: "AI-assisted", note: "Urgency and sentiment influence queue order." },
  { metric: "Assignment engine", value: "Rules + workload", note: "Routes by expertise, load, and SLA risk." },
  { metric: "Escalation behavior", value: "Automated", note: "High-risk or overdue tickets escalate by policy." },
];

const workflowStages = [
  { stage: "1. Intake", detail: "Clients submit issues through web, email, or API. Every request is logged with traceable metadata." },
  { stage: "2. Analyze", detail: "AI triage identifies ticket type, urgency, and sentiment to support fast and accurate handling." },
  { stage: "3. Route", detail: "Rules assign cases to reviewers based on specialization, queue load, and service commitments." },
  { stage: "4. Resolve", detail: "Reviewers investigate, update status, communicate with clients, and document final outcomes." },
  { stage: "5. Optimize", detail: "Managers review trends and feedback to improve workflow rules and reduce repeated incidents." },
];

const roleModel = [
  {
    icon: UserCog,
    title: "Managers",
    description: "Configure automations, monitor SLA performance, manage users and permissions, and review operational reports.",
  },
  {
    icon: UserCheck,
    title: "Reviewers",
    description: "Handle assigned queues, investigate incidents, apply solutions, escalate blockers, and close tickets with context.",
  },
  {
    icon: Users,
    title: "Clients",
    description: "Submit support requests, track progress in real time, receive updates, and provide resolution feedback.",
  },
];

const securityAndTrust = [
  "Role-based access control",
  "Audit logs for ticket actions",
  "Data protection and encryption",
  "Operational backup safeguards",
  "Compliance-ready controls",
  "Availability monitoring",
];

const Aboutpage = () => {
  return (
    <main className="w-full bg-[#060b18] font-sans">
      <section className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(6,182,212,0.1) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 20% 70%, rgba(139,92,246,0.1) 0%, transparent 60%)` }} />
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">About SOLEASE</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>Built for modern support operations</h1>
            <p className="text-base md:text-lg text-white/[0.48] leading-relaxed max-w-3xl mx-auto mb-8">
              SOLEASE combines AI triage, workflow automation, role-based collaboration, and analytics to run support operations with speed, control, and accountability across the full ticket lifecycle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_16px_48px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all text-sm">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-6 py-3 rounded-full font-medium transition-all text-sm">
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-[#080e1e] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="text-center py-6 px-4 bg-[#060b18]">
                <span className="text-2xl md:text-3xl font-medium text-white bg-gradient-to-b from-white to-white/[0.7] bg-clip-text text-transparent">{stat.value}</span>
                <p className="text-[11.5px] uppercase text-white/[0.35] mt-2 tracking-[0.08em]">{stat.label}</p>
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
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Current System Operations</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-4">What SOLEASE is currently doing</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-3xl mx-auto">The platform is actively handling production support workloads with AI assistance and policy-driven automation.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentOperations.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all duration-300">
                <div className="w-11 h-11 bg-blue-600/[0.12] rounded-xl flex items-center justify-center text-blue-400 mb-4"><item.icon size={20} /></div>
                <h3 className="text-sm md:text-base font-medium text-white mb-2">{item.title}</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">{item.description}</p>
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
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Operational Snapshot</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Live platform behavior</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {operationalSnapshot.map((row, index) => (
              <motion.div key={row.metric} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-white/[0.14] transition-all">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/[0.35] mb-2">{row.metric}</p>
                <h3 className="text-sm md:text-base font-medium text-white mb-2">{row.value}</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">{row.note}</p>
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
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Full System Scope</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Everything SOLEASE is currently doing</h2>
            <p className="text-white/[0.48] text-sm md:text-base mt-3 max-w-3xl mx-auto">This section details the complete operational coverage of the SOLEASE system across support execution, control, and service delivery.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {systemCoverage.map((area, index) => (
              <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 md:p-6 hover:border-white/[0.14] transition-all">
                <h3 className="text-sm md:text-base font-medium text-white mb-3">{area.title}</h3>
                <ul className="space-y-2">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/[0.48] text-sm leading-relaxed">
                      <CheckCircle2 size={14} className="text-blue-400 mt-0.5 flex-shrink-0" /><span>{item}</span>
                    </li>
                  ))}
                </ul>
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
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Live Workflow</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">End-to-end lifecycle in production</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {workflowStages.map((item, index) => (
              <motion.div key={item.stage} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 md:p-6 hover:border-white/[0.14] transition-all">
                <h3 className="text-sm font-medium text-blue-400 mb-2">{item.stage}</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">{item.detail}</p>
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
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Role Alignment</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-4">Responsibilities in the system</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">Each role operates from the same source of truth with clear accountability across every ticket stage.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {roleModel.map((role, index) => (
              <motion.div key={role.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-white/[0.14] transition-all">
                <div className="w-12 h-12 bg-blue-600/[0.12] rounded-xl flex items-center justify-center text-blue-400 mb-4"><role.icon size={22} /></div>
                <h3 className="text-sm md:text-base font-medium text-white mb-2">{role.title}</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-6 h-px bg-blue-600"></span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Security and Reliability</span>
                <span className="w-6 h-px bg-blue-600"></span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-4">Built for controlled operations</h2>
              <p className="text-white/[0.48] text-sm md:text-base leading-relaxed">Security and reliability controls are built into daily support execution to protect data and keep service delivery stable.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm md:text-base font-medium text-white">Control Measures</h3>
                <ShieldCheck size={18} className="text-green-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {securityAndTrust.map((item) => (
                  <div key={item} className="flex items-center gap-2 p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                    <Lock size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-white/[0.6]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#060b18] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-4">Ready to run support with more control?</h2>
            <p className="text-white/[0.48] text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">Start with SOLEASE to manage tickets, enforce SLAs, automate decisions, and keep your support teams aligned.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all text-sm">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-6 py-3 rounded-full font-medium hover:-translate-y-0.5 transition-all text-sm">
                Contact Sales
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {["No credit card required", "Quick onboarding", "Production-ready workflows"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-xs text-white/[0.38] bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
                  <CheckCircle2 size={12} className="text-green-500" />{item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Aboutpage;