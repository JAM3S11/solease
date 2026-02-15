import React, { useEffect, useState } from "react";
import { ArrowRight, Mail, Sparkles, ChevronDown, Ticket, Users, BarChart3, Zap, CheckCircle2, Star, Shield, Clock, Bot, Target, TrendingUp, Lock, HeadphonesIcon, Globe, Calendar } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    { icon: Calendar, text: "14-day free trial" },
    { icon: CheckCircle2, text: "No credit card required" },
    { icon: Clock, text: "Setup in minutes" },
    { icon: Shield, text: "Cancel anytime" }
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div 
          className="absolute inset-0 z-0 opacity-60"
          style={{
            background: "linear-gradient(120deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 58, 138, 0.7) 100%), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat",
            backgroundAttachment: "fixed",
          }}
        />

        <div className="relative z-10 max-w-5xl w-full px-4 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-32 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-md text-blue-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-[0.15em] mb-8 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Support Platform
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Intelligent Support.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Simplified Resolution.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              SOLEASE is an <span className="text-white font-semibold">AI-powered ticketing platform</span> that automates support workflows, 
              provides real-time insights, and connects users with the right support teams—faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link to="/auth/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 font-semibold text-base flex items-center justify-center gap-2">
                  Start Free Trial 
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 font-semibold text-base flex items-center justify-center gap-2">
                  Talk to Sales
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <button 
            onClick={() => document.getElementById('what-is')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-300"
          >
            <span className="text-xs uppercase tracking-widest">Learn More</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </motion.div>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <span className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</span>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is SOLEASE? */}
      <section id="what-is" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">What is SOLEASE?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              The Modern Support Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              SOLEASE combines <span className="text-gray-900 font-semibold">artificial intelligence</span> with 
              <span className="text-gray-900 font-semibold"> intuitive design</span> to transform how organizations 
              handle support tickets—from submission to resolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <problem.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm">{problem.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-blue-700 text-sm font-medium">Trusted by 10,000+ users worldwide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Solutions */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Powerful Features</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to deliver exceptional support experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <solution.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{solution.title}</h3>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {solution.highlight}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{solution.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
              View All Features <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Simple Process</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Trusted by Teams</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all"
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

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to Transform Your <span className="text-blue-600">Support?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of organizations delivering exceptional support with SOLEASE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/auth/signup"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link 
                to="/about"
                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-500">
              {guarantees.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <item.icon size={16} className="text-green-600" />
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
