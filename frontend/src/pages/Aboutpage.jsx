import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Command,
  Database,
  Globe,
  Layers,
  Lock,
  Mic,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TicketCheck,
  Users,
  Webhook,
  Workflow,
  Zap,
  Eye,
  Rocket,
} from "lucide-react";
import { Link } from "react-router";

const coreCapabilities = [
  {
    icon: TicketCheck,
    title: "Intelligent Helpdesk",
    description: "Multi-channel ticket intake with AI-powered triage, categorization, and routing for seamless support operations.",
  },
  {
    icon: Command,
    title: "MCP Protocol Engine",
    description: "Model Context Protocol integration enabling AI agents to execute complex workflows, query data, and automate decisions autonomously.",
  },
  {
    icon: Bot,
    title: "AI Autonomous Agents",
    description: "Self-learning agents that handle repetitive tasks, suggest solutions, and escalate only when human intervention is needed.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Drag-and-drop automation builder to create custom pipelines, escalation rules, and business logic without coding.",
  },
  {
    icon: Mic,
    title: "Voice-to-Text Ready",
    description: "Natural language processing pipeline for voice inputs. Dictate tickets, commands, and queries hands-free. (Coming Soon)",
  },
  {
    icon: Globe,
    iconColor: "text-cyan-400",
    title: "Enterprise Scale",
    description: "Built for organizations handling thousands of tickets daily with multi-tenant architecture and role-based access.",
  },
];

const mcpFeatures = [
  {
    title: "Context-Aware Execution",
    description: "AI agents understand conversation context and can execute multi-step operations across your entire helpdesk system.",
  },
  {
    title: "Tool Calling Protocol",
    description: "MCP-compatible tool definitions allow any AI client to invoke ticket creation, status updates, and data retrieval.",
  },
  {
    title: "Streaming Responses",
    description: "Real-time token-by-token responses for interactive troubleshooting and step-by-step resolution guidance.",
  },
  {
    title: "Persistent Sessions",
    description: "Maintain conversation state across interactions, enabling complex investigations that span multiple sessions.",
  },
];

const enterpriseFeatures = [
  { icon: Globe, title: "Multi-tenant Architecture", description: "Isolated data environments for different departments, regions, or client organizations." },
  { icon: Lock, title: "Enterprise Security", description: "SOC 2 compliant with role-based access, SSO/SAML, and comprehensive audit logging." },
  { icon: Database, title: "Data Sovereignty", description: "Regional data residency options with encrypted storage and secure backup protocols." },
  { icon: Zap, title: "High Availability", description: "99.9% SLA with auto-failover, load balancing, and zero-downtime deployments." },
];

const integrationOptions = [
  { name: "Slack", description: "Create and update tickets directly from Slack channels" },
  { name: "Microsoft Teams", description: "Seamless integration with Teams for enterprise workflows" },
  { name: "Webhooks", description: "Connect any external system with custom webhook triggers" },
  { name: "REST API", description: "Full CRUD operations withGraphQL support for custom integrations" },
  { name: "Email Pipelines", description: "Convert emails to tickets automatically with AI parsing" },
  { name: "CRM Sync", description: "Two-way sync with Salesforce, HubSpot, and other CRMs" },
];

const workflowStages = [
  { stage: "1. Submit", detail: "Create tickets via web, mobile, email, API, or voice input. AI auto-categorizes and extracts key details." },
  { stage: "2. Analyze", detail: "MCP agents analyze intent, sentiment, and urgency. Pattern matching identifies recurring issues." },
  { stage: "3. Execute", detail: "Autonomous agents apply AI-suggested solutions, update statuses, or escalate with full context preserved." },
  { stage: "4. Resolve", detail: "Human reviewers handle complex cases while AI assists with knowledge base suggestions and automation." },
  { stage: "5. Learn", detail: "Continuous feedback loop trains models on resolution patterns, improving auto-resolution rates over time." },
];

const voiceFeatures = [
  { title: "Dictate Tickets", description: "Speak your issue naturally and have it converted to a structured ticket with auto-categorization." },
  { title: "Voice Commands", description: "Use voice to check ticket status, assign to team members, or trigger workflow automations." },
  { title: "Transcript History", description: "All voice interactions are transcribed and searchable for compliance and training purposes." },
  { title: "Multi-language", description: "Support for 20+ languages with real-time translation for global enterprise teams." },
];

const Aboutpage = () => {
  return (
    <main className="w-full bg-[#060b18] font-sans">
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(6,182,212,0.1) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 20% 70%, rgba(139,92,246,0.1) 0%, transparent 60%)` }} />
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 80%)' }} />
        
        <div className="relative z-10 max-w-5xl w-full px-4 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 bg-blue-600/[0.12] backdrop-blur-sm text-blue-400 text-xs font-medium px-4 py-2 rounded-full uppercase tracking-[0.15em] mb-6 border border-blue-500/[0.2]">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Enterprise Platform
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
              Enterprise Helpdesk.<br />
              <span className="bg-gradient-to-b from-white to-white/[0.45] bg-clip-text text-transparent">
                Autonomous Agents.
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-white/[0.48] mb-10 max-w-2xl leading-relaxed" style={{ lineHeight: 1.65 }}>
              SOLEASE is an <span className="text-white font-medium">AI-native helpdesk platform</span> with native MCP (Model Context Protocol) integration—empowering autonomous agents to resolve tickets, execute workflows, and collaborate with your team like Opencode or Claude Code.
            </p>

            {/* Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full max-w-4xl mx-auto mb-12"
            >
              <div className="bg-[#0a1428] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/[0.08]">
                {/* Mockup Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-white/[0.03] text-white/[0.3] text-[10px] font-mono">
                      solease.dashboard
                    </div>
                  </div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-4 grid grid-cols-4 gap-4">
                  {/* Stats Panel */}
                  <div className="col-span-1 space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] text-white/[0.3] uppercase tracking-wider mb-2">Open Tickets</div>
                      <div className="text-2xl font-bold text-white">24</div>
                      <div className="text-[9px] text-green-400 mt-1">-12% from yesterday</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] text-white/[0.3] uppercase tracking-wider mb-2">Avg Resolution</div>
                      <div className="text-2xl font-bold text-white">2.4h</div>
                      <div className="text-[9px] text-cyan-400 mt-1">AI assisted</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] text-white/[0.3] uppercase tracking-wider mb-2">Satisfaction</div>
                      <div className="text-2xl font-bold text-white">4.8★</div>
                      <div className="text-[9px] text-white/[0.4] mt-1">92% rating</div>
                    </div>
                  </div>

                  {/* Tickets List */}
                  <div className="col-span-3 space-y-2">
                    {/* Ticket Row Header */}
                    <div className="flex items-center gap-2 px-3 py-2 text-[9px] text-white/[0.3] uppercase tracking-wider">
                      <span className="w-12">ID</span>
                      <span className="w-24">Subject</span>
                      <span className="w-16">Status</span>
                      <span className="w-16">Priority</span>
                      <span className="w-20">AI Action</span>
                      <span className="w-16">Assigned</span>
                    </div>

                    {/* AI-Triaged Ticket */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/[0.05] border border-green-500/20">
                      <span className="w-12 text-green-400 text-xs font-mono">#1247</span>
                      <span className="w-24 text-white text-xs truncate">VPN not connecting</span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[8px] font-medium">Resolved</span></span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[8px] font-medium">High</span></span>
                      <span className="w-20"><span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[8px] font-medium flex items-center gap-1"><Bot size={10} /> Auto-fixed</span></span>
                      <span className="w-16 text-white/[0.3] text-[10px]">AI Agent</span>
                    </div>

                    {/* Ticket in Progress */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/[0.05] border border-yellow-500/20">
                      <span className="w-12 text-yellow-400 text-xs font-mono">#1248</span>
                      <span className="w-24 text-white text-xs truncate">Password reset fail</span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-[8px] font-medium">Pending</span></span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[8px] font-medium">Medium</span></span>
                      <span className="w-20"><span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[8px] font-medium flex items-center gap-1"><Zap size={10} /> Analyzing</span></span>
                      <span className="w-16 text-white/[0.3] text-[10px]">Reviewer</span>
                    </div>

                    {/* New Ticket */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <span className="w-12 text-white/[0.4] text-xs font-mono">#1249</span>
                      <span className="w-24 text-white text-xs truncate">Software install request</span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[8px] font-medium">New</span></span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[8px] font-medium">Low</span></span>
                      <span className="w-20"><span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-[8px] font-medium flex items-center gap-1"><Target size={10} /> Categorized</span></span>
                      <span className="w-16 text-white/[0.3] text-[10px]">—</span>
                    </div>

                    {/* Eskalated Ticket */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/[0.05] border border-red-500/20">
                      <span className="w-12 text-red-400 text-xs font-mono">#1250</span>
                      <span className="w-24 text-white text-xs truncate">Server access denied</span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[8px] font-medium">Escalated</span></span>
                      <span className="w-16"><span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[8px] font-medium">Critical</span></span>
                      <span className="w-20"><span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[8px] font-medium flex items-center gap-1"><Users size={10} /> Human handoff</span></span>
                      <span className="w-16 text-white text-[10px]">IT Admin</span>
                    </div>
                  </div>
                </div>

                {/* AI Agent Status Bar */}
                <div className="px-4 py-2 bg-blue-600/[0.1] border-t border-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-white/50">AI Agents Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      <span className="text-[10px] text-white/50">Processing 3 tickets</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 font-mono">
                    MCP: connected
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link to="/auth/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_16px_48px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2">
                  Start Free Trial 
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-7 py-3.5 rounded-full backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2">
                  Talk to Sales
                </button>
              </Link>
            </div>
</motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Our Story</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Why We Built SOLEASE</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              From frustration to innovation—the story behind the platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600/[0.12] rounded-lg flex items-center justify-center">
                    <Target size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Our Mission</h3>
                </div>
                <p className="text-white/[0.48] text-sm leading-relaxed">
                  To eliminate the frustration of traditional helpdesk systems by creating an AI-native support platform where autonomous agents work alongside human experts—reducing response times, improving resolution quality, and empowering teams to focus on meaningful work instead of repetitive tasks.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-600/[0.12] rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Our Vision</h3>
                </div>
                <p className="text-white/[0.48] text-sm leading-relaxed">
                  We envision a future where every organization—regardless of size—has access to enterprise-grade AI support infrastructure. A world where AI agents handle routine inquiries instantly, human agents tackle complex challenges with AI-powered insights, and customers receive faster, smarter, more personalized support than ever before.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600/[0.12] rounded-lg flex items-center justify-center">
                    <Rocket size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Our Journey</h3>
                </div>
                <p className="text-white/[0.48] text-sm leading-relaxed mb-4">
                  SOLEASE was born from a simple observation: enterprise support teams were drowning in repetitive tickets while their most talented agents burned out on mundane tasks. We knew there had to be a better way.
                </p>
                <p className="text-white/[0.48] text-sm leading-relaxed">
                  By combining cutting-edge AI research with deep enterprise expertise, we built a platform that doesn't just automate—but genuinely augments human capabilities. Today, we're proud to serve forward-thinking organizations across East Africa and beyond.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/[0.08] to-cyan-600/[0.08] border border-blue-500/[0.15] rounded-2xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Our Core Values</h3>
                <ul className="space-y-3">
                  {[
                    "AI as a collaborator, not a replacement",
                    "Security first—always",
                    "Continuous learning and improvement",
                    "Transparent, honest partnerships",
                  ].map((value, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/[0.6] text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="platform-capabilities" className="py-20 md:py-28 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Platform Capabilities</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">One Platform, Infinite Possibilities</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
              SOLEASE combines the simplicity of a modern helpdesk with the power of autonomous AI agents—connected through the Model Context Protocol for enterprise-grade automation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreCapabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-blue-600/[0.12] rounded-xl flex items-center justify-center mb-4 ${cap.iconColor || 'text-blue-400'} group-hover:bg-blue-600 group-hover:text-white transition-all duration-300`}>
                  <cap.icon size={24} />
                </div>
                <h3 className="font-medium text-white mb-2 text-sm">{cap.title}</h3>
                <p className="text-white/[0.48] text-sm">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Model Context Protocol</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">AI That Actually Works</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Unlike basic chatbots, SOLEASE's MCP integration lets AI agents execute real operations—query databases, update tickets, trigger workflows, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {mcpFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-white/[0.14] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-cyan-600/[0.15] rounded-lg flex items-center justify-center">
                    <Terminal size={16} className="text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                </div>
                <p className="text-white/[0.48] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/[0.15] rounded-2xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">Like Claude Code, But for Support</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">
                  Just as Opencode lets you agentically modify code, SOLEASE lets AI agents autonomously handle support tickets—applying fixes, updating statuses, and escalating only when needed.
                </p>
              </div>
              <div className="flex-shrink-0">
                <code className="text-xs md:text-sm text-cyan-300 bg-black/[0.3] px-4 py-2 rounded-lg font-mono">
                  MCP: resolve_ticket(id, solution)
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Enterprise Ready</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Built for the Enterprise</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Security, scalability, and compliance baked into every layer of the platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.14] transition-all"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-sm font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/[0.48] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Integrations</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Connect Everything</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Seamlessly integrate with your existing enterprise tools and workflows.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationOptions.map((item, index) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:border-white/[0.14] transition-all">
                <div className="w-10 h-10 bg-blue-600/[0.12] rounded-lg flex items-center justify-center">
                  <Webhook size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{item.name}</h3>
                  <p className="text-white/[0.48] text-xs">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">How It Works</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">From Ticket to Resolution</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              AI-powered workflow that learns and improves with every interaction.
            </p>
          </motion.div>

          {/* AI Workflow Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 p-6 bg-[#0a1428] border border-white/[0.06] rounded-2xl"
          >
            <div className="text-center mb-6">
              <h3 className="text-sm font-medium text-white">AI Triage Pipeline in Action</h3>
              <p className="text-[10px] text-white/[0.4] mt-1">See how a ticket flows through the system</p>
            </div>
            
            <div className="space-y-3">
              {/* Step 1: Submit */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">1</div>
                <div className="flex-1 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TicketCheck size={16} className="text-blue-400" />
                    <span className="text-white text-sm">Ticket Submitted</span>
                  </div>
                  <span className="text-[10px] text-white/[0.4]">via email, web, API</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronDown className="w-4 h-4 text-white/[0.15]" />
              </div>

              {/* Step 2: AI Analysis */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">2</div>
                <div className="flex-1 p-3 rounded-lg bg-cyan-500/[0.05] border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot size={16} className="text-cyan-400" />
                    <span className="text-white text-sm">AI Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">Intent: VPN_issue</span>
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">Confidence: 94%</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronDown className="w-4 h-4 text-white/[0.15]" />
              </div>

              {/* Step 3: Auto-Route or Auto-Resolve */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-xs font-bold shrink-0">3</div>
                <div className="flex-1 p-3 rounded-lg bg-green-500/[0.05] border border-green-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-green-400" />
                    <span className="text-white text-sm">Auto-Resolution</span>
                  </div>
                  <span className="text-[10px] text-green-400">AI applied known fix pattern</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronDown className="w-4 h-4 text-white/[0.15]" />
              </div>

              {/* Step 4: Resolve */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">4</div>
                <div className="flex-1 p-3 rounded-lg bg-purple-500/[0.05] border border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-purple-400" />
                    <span className="text-white text-sm">Ticket Resolved</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">Time: 12 seconds</span>
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">SLA: ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowStages.map((item, index) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 h-full hover:border-white/[0.14] transition-all">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-sm font-medium text-white mb-2">{item.stage}</h3>
                  <p className="text-white/[0.48] text-xs leading-relaxed">{item.detail}</p>
                </div>
                {index < workflowStages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-white/[0.2]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#080e1e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-cyan-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-400">Coming Soon</span>
              <span className="w-6 h-px bg-cyan-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Voice-First Support</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Speak naturally to create tickets, query status, and control your helpdesk—hands-free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {voiceFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-cyan-500/[0.3] transition-all group"
              >
                <div className="w-10 h-10 bg-cyan-600/[0.12] rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <Mic size={20} className="text-cyan-400 group-hover:text-white" />
                </div>
                <h3 className="text-sm font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/[0.48] text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-600/[0.1] border border-cyan-500/[0.2] text-cyan-400 px-4 py-2 rounded-full text-sm">
              <Phone size={16} />
              <span>Join waitlist for voice features</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#060b18] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">
              Ready to Transform Your <span className="text-blue-400">Support?</span>
            </h2>
            <p className="text-white/[0.48] text-base md:text-lg mb-10 max-w-xl mx-auto">
              Join forward-thinking enterprises using SOLEASE to automate support with AI agents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_16px_48px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link 
                to="/contact"
                className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-7 py-3.5 rounded-full font-medium hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Contact Sales
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/[0.38]">
              {[
                { icon: CheckCircle2, text: "14-day free trial" },
                { icon: Zap, text: "No credit card required" },
                { icon: Users, text: "Setup in minutes" },
                { icon: ShieldCheck, text: "Enterprise security" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <item.icon size={16} className="text-green-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Aboutpage;
