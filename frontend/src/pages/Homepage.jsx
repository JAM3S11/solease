import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Users,
  Zap,
  Shield,
  BarChart3,
  Target,
  Lock,
  HeadphonesIcon,
  Activity,
  Gauge,
  MessageSquare,
} from "lucide-react";

const AnimatedBackground = () => {
  return (
    <>
      <div className="absolute inset-0 z-0" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 20% 70%, rgba(139,92,246,0.12) 0%, transparent 60%)`,
      }} />
      <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 80%)'
      }} />
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 50%, #060b18 100%)',
        opacity: 0.5
      }} />
    </>
  );
};

const FloatingElement = ({ delay, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

const Homepage = () => {
  const stats = [
    { value: "10,000+", label: "Daily Active Users", icon: Users },
    { value: "500K+", label: "Tickets Resolved", icon: Ticket },
    { value: "99.9%", label: "Uptime SLA", icon: Shield },
    { value: "24/7", label: "Support Available", icon: HeadphonesIcon }
  ];

  const problems = [
    { icon: Zap, title: "Slow Response Times", desc: "End endless wait times with AI-powered instant routing" },
    { icon: Target, title: "Fragmented Support", desc: "Unified platform connecting all your support channels" },
    { icon: TrendingUp, title: "Lack of Insights", desc: "Real-time analytics to make data-driven decisions" },
    { icon: Lock, title: "Security Concerns", desc: "Enterprise-grade encryption and compliance built-in" }
  ];

  const solutions = [
    {
      icon: Bot,
      title: "AI-Powered Intelligence",
      description: "Smart triage analyzes ticket urgency and sentiment, routing to the right expert instantly.",
      highlight: "40% faster resolution"
    },
    {
      icon: Ticket,
      title: "Complete Ticket Lifecycle",
      description: "From submission to resolution, track every ticket with automated workflows and SLA tracking.",
      highlight: "End-to-end visibility"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards reveal patterns, predict issues, and optimize team performance.",
      highlight: "Data-driven insights"
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure user management with customizable roles for clients, reviewers, and administrators.",
      highlight: "Full accountability"
    }
  ];

  const process = [
    { step: "1", title: "Submit", desc: "Create tickets via web, email, or API" },
    { step: "2", title: "AI Analysis", desc: "Intelligent categorization & urgency detection" },
    { step: "3", title: "Route", desc: "Auto-assign to best-fit team member" },
    { step: "4", title: "Resolve", desc: "Track progress and provide feedback" }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "IT Director",
      company: "TechCorp Solutions",
      avatar: "SM",
      content: "SOLEASE transformed our support workflow. Response times improved by 60% within the first month.",
      rating: 5
    },
    {
      name: "James Rodriguez",
      role: "Operations Manager",
      company: "Global Systems Inc.",
      avatar: "JR",
      content: "The analytics dashboard gives us insights we never had before. Data-driven decisions saved us thousands.",
      rating: 5
    },
    {
      name: "Emily Chen",
      role: "Support Lead",
      company: "InnovateTech",
      avatar: "EC",
      content: "Our team loves the intuitive interface. We focus on solving problems, not managing tickets.",
      rating: 5
    }
  ];

  const guarantees = [
    { icon: CheckCircle2, text: "14-day free trial" },
    { icon: Clock3, text: "No credit card required" },
    { icon: Zap, text: "Setup in minutes" },
    { icon: Shield, text: "Cancel anytime" }
  ];

  return (
    <div className="w-full font-sans bg-[#060b18]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-7xl w-full px-6 lg:px-10 py-20 sm:py-28 flex flex-col items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }} 
              >
                <span className="inline-flex items-center gap-2 bg-blue-600/[0.12] backdrop-blur-sm text-blue-400 text-xs font-medium px-4 py-2 rounded-full uppercase tracking-[0.15em] mb-6 border border-blue-500/[0.2]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Next-Gen Support Intelligence
                </span>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                  Support that<br />
                  <span className="bg-gradient-to-b from-white to-white/[0.45] bg-clip-text text-transparent">
                    Actually Works.
                  </span>
                </h1>
                
                <p className="text-sm md:text-base text-white/[0.48] mb-8 max-w-lg leading-relaxed" style={{ lineHeight: 1.65 }}>
                  Experience a service desk that thinks. SOLEASE uses <span className="text-white font-medium">AI intelligence</span> to route tickets instantly, 
                  automate workflows, and empower your team to focus on resolving issues faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                  <Link to="/auth/signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_16px_48px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2">
                      Start Free Trial 
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  
                  <Link to="/about" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-7 py-3.5 rounded-full backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2">
                      Learn How It Works
                    </button>
                  </Link>
                </div>

                {/* Social Proof Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060b18] bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/[0.5] text-sm ml-2">Trusted by <span className="text-white font-medium">10,000+</span> teams</span>
                </div>
              </motion.div>
            </div>

            {/* Right - Advanced Dashboard Mockup */}
            <div className="lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                {/* Glowing orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px]" />
                
                {/* Main Dashboard Card */}
                <div className="relative bg-[#080e1e]/90 backdrop-blur-xl rounded-2xl border border-white/[0.1] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                  {/* Header */}
                  <div className="h-12 bg-white/[0.03] border-b border-white/[0.06] flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/80 text-xs font-medium">SOLEASE</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/[0.15]" />
                      <div className="w-2 h-2 rounded-full bg-white/[0.15]" />
                      <div className="w-2 h-2 rounded-full bg-white/[0.15]" />
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-4 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <FloatingElement delay={0.5} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <Gauge className="w-4 h-4 text-blue-400 mb-1" />
                        <span className="text-white text-lg font-bold">98%</span>
                        <span className="text-white/[0.4] text-[10px] block">SLA Met</span>
                      </FloatingElement>
                      <FloatingElement delay={0.6} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <Activity className="w-4 h-4 text-green-400 mb-1" />
                        <span className="text-white text-lg font-bold">1.2k</span>
                        <span className="text-white/[0.4] text-[10px] block">Active</span>
                      </FloatingElement>
                      <FloatingElement delay={0.7} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <Clock3 className="w-4 h-4 text-purple-400 mb-1" />
                        <span className="text-white text-lg font-bold">&lt;2h</span>
                        <span className="text-white/[0.4] text-[10px] block">Response</span>
                      </FloatingElement>
                    </div>

                    {/* AI Suggestion Card */}
                    <FloatingElement delay={0.8} className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-xl p-4 border border-blue-500/[0.15]">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-xs font-medium">AI Suggestion</span>
                      </div>
                      <p className="text-white/[0.7] text-xs leading-relaxed">
                        Auto-routing ticket #4829 to IT Security team based on keyword analysis. 
                        <span className="text-blue-400"> 94% confidence</span>
                      </p>
                    </FloatingElement>

                    {/* Live Ticket Feed */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-white/[0.4] uppercase tracking-wider px-1">
                        <span>Live Tickets</span>
                        <span>Priority</span>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                          className="flex items-center justify-between bg-white/[0.02] rounded-lg p-3 border border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-white/[0.3]" />
                            <span className="text-white text-xs">Ticket #{4800 + i}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${i === 1 ? 'bg-red-500/20 text-red-400' : i === 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {i === 1 ? 'High' : i === 2 ? 'Medium' : 'Low'}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Scanning line effect */}
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
                  />
                </div>

                {/* Floating badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -right-4 top-8 bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-xl border border-white/[0.08] shadow-lg hidden md:block"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white/[0.6] text-xs font-medium">AI Active</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <button 
            onClick={() => document.getElementById('what-is')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-white/[0.4] hover:text-blue-400 transition-colors duration-300"
          >
            <span className="text-xs uppercase tracking-widest">Learn More</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-[#080e1e] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center py-6 px-4 bg-[#060b18]"
              >
                <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-3" />
                <span className="text-2xl md:text-3xl font-medium text-white bg-gradient-to-b from-white to-white/[0.7] bg-clip-text text-transparent">{stat.value}</span>
                <p className="text-[11.5px] uppercase text-white/[0.35] mt-2 tracking-[0.08em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is SOLEASE? */}
      <section id="what-is" className="py-20 md:py-28 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">What is SOLEASE?</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              The Modern Support Platform
            </h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
              SOLEASE combines <span className="text-white font-medium">artificial intelligence</span> with 
              <span className="text-white font-medium"> intuitive design</span> to transform how organizations 
              handle support tickets—from submission to resolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-600/[0.12] rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <problem.icon size={24} />
                </div>
                <h3 className="font-medium text-white mb-2 text-sm">{problem.title}</h3>
                <p className="text-white/[0.48] text-sm">{problem.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/[0.025] border border-white/[0.06] rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-white/[0.6] text-sm font-medium">Trusted by 10,000+ users worldwide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Solutions */}
      <section className="py-20 md:py-28 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">What We Offer</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Powerful Features</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Everything you need to deliver exceptional support experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:translate-y-[-3px] hover:border-white/[0.14] transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600/[0.12] rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <solution.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">{solution.title}</h3>
                      <span className="text-[10.5px] font-medium text-blue-400 bg-blue-600/[0.12] px-2.5 py-0.5 rounded-full uppercase tracking-[0.07em]">
                        {solution.highlight}
                      </span>
                    </div>
                    <p className="text-white/[0.48] text-sm leading-relaxed">{solution.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-blue-400 font-medium hover:gap-3 transition-all text-sm">
              View All Features <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">How It Works</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Simple Process</h2>
            <p className="text-white/[0.48] text-sm md:text-base max-w-2xl mx-auto">
              Get started in minutes, resolve issues in seconds
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-base mx-auto mb-4 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_8px_24px_rgba(37,99,235,0.25)]">
                  {item.step}
                </div>
                <h3 className="font-medium text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-white/[0.48] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-[#080e1e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-6 h-px bg-blue-600"></span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-blue-400">Testimonials</span>
              <span className="w-6 h-px bg-blue-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">Trusted by Teams</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.14] transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/[0.48] text-sm mb-5">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{testimonial.name}</h4>
                    <p className="text-white/[0.38] text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[#060b18] relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 70%)`,
          }} 
        />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">
              Ready to Transform Your <span className="text-blue-400">Support?</span>
            </h2>
            <p className="text-white/[0.48] text-base md:text-lg mb-10 max-w-xl mx-auto">
              Join thousands of organizations delivering exceptional support with SOLEASE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_16px_48px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link 
                to="/about"
                className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] px-7 py-3.5 rounded-full font-medium hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Learn More
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/[0.38]">
              {guarantees.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <item.icon size={16} className="text-green-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
