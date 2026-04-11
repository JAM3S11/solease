import React, { useState } from "react";
import api from "../lib/axios.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 
import { MapPin, Phone, Mail, Clock, ShieldCheck, Activity, Send, MessageCircle, Twitter, Linkedin, Instagram, Facebook, HelpCircle, CheckCircle2, ArrowRight, Zap, Users, Calendar, LifeBuoy, Briefcase, CreditCard, Wrench } from "lucide-react"; 

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error("Please fill in all fields to submit the form!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      setIsSending(true);
      await api.post("/contact", formData);
      setFormData({ fullName: "", email: "", message: "" });
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! You're sending too many requests", { duration: 4000 });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const socialLinks = [
    { icon: Twitter, name: "Twitter", href: "https://x.com" },
    { icon: Linkedin, name: "LinkedIn", href: "https://www.linkedin.com" },
    { icon: Instagram, name: "Instagram", href: "https://www.instagram.com" },
    { icon: Facebook, name: "Facebook", href: "https://www.facebook.com" }
  ];

  const supportChannels = [
    { icon: MessageCircle, name: "WhatsApp", desc: "Quick chat support", available: "24/7" },
    { icon: Mail, name: "Email", desc: "Detailed inquiries", response: "< 24 hours" },
    { icon: Phone, name: "Phone", desc: "Voice support", available: "Business hours" },
    { icon: Calendar, name: "Book Demo", desc: "Schedule a call", response: "Same day" }
  ];

  const preSalesFAQs = [
    { q: "Do you offer a free trial?", a: "Yes! We offer a 14-day free trial with full access to all features. No credit card required." },
    { q: "Can I integrate with my existing tools?", a: "Absolutely. We offer integrations with Slack, Microsoft Teams, Jira, Zendesk, and more. Custom APIs are also available." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans." },
    { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time. Changes take effect on your next billing cycle." }
  ];

  const slaGuarantees = [
    { title: "Response Time", basic: "< 24 hours", pro: "< 4 hours", enterprise: "< 1 hour" },
    { title: "Resolution Time", basic: "48 hours", pro: "24 hours", enterprise: "4 hours" },
    { title: "Support Channel", basic: "Email", pro: "Email + Chat", enterprise: "24/7 Priority" },
    { title: "Dedicated Manager", basic: false, pro: false, enterprise: true }
  ];

  const contactDirectory = [
    {
      icon: LifeBuoy,
      team: "Technical Support",
      email: "support@solease.com",
      bestFor: "System issues, ticket workflow errors, access blockers",
      response: "< 4 hours",
      availability: "24/7 (Enterprise), business hours (Standard)"
    },
    {
      icon: Briefcase,
      team: "Sales & Demos",
      email: "sales@solease.com",
      bestFor: "Product walkthroughs, plan selection, enterprise onboarding",
      response: "Same business day",
      availability: "Mon-Fri, 8:00 AM - 6:00 PM"
    },
    {
      icon: CreditCard,
      team: "Billing & Plans",
      email: "billing@solease.com",
      bestFor: "Invoices, subscriptions, payment and renewal requests",
      response: "< 24 hours",
      availability: "Mon-Fri, 9:00 AM - 5:00 PM"
    },
    {
      icon: Wrench,
      team: "Integrations Desk",
      email: "integrations@solease.com",
      bestFor: "API setup, webhooks, migration and custom integrations",
      response: "< 8 hours",
      availability: "Mon-Fri, 8:00 AM - 6:00 PM"
    }
  ];

  const responseProcess = [
    { step: "1", title: "Request Logged", desc: "Your inquiry is captured and assigned a tracking reference immediately." },
    { step: "2", title: "Routing", desc: "SOLEASE routes your message to the right team based on issue type and urgency." },
    { step: "3", title: "First Reply", desc: "You receive an initial response with next steps and ownership confirmation." },
    { step: "4", title: "Resolution Follow-up", desc: "We close the loop with outcomes, action items, or escalation if needed." }
  ];

  return (
    <div className="w-full bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl text-center">
            <span className="text-blue-600 text-xs font-medium uppercase tracking-[0.2em] mb-3 block">Contact Us</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">We're Here to Help</h1>
            <p className="text-gray-600 text-sm md:text-base font-normal leading-relaxed max-w-2xl mx-auto">
              Have questions about SOLEASE? Need technical support? Want to schedule a demo? 
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 h-4/4"
            >
              <h2 className="text-sm sm:text-base font-medium text-gray-900 mb-2 flex items-center gap-3">
                Send us a Message
              </h2>
              <p className="text-gray-500 text-xs mb-6">Fill out the form below and we'll respond within 24 hours.</p>
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-medium text-blue-700 mb-2">To help us respond faster, include:</p>
                <ul className="space-y-1">
                  {[
                    "Your organization name and role",
                    "A clear issue summary or inquiry type",
                    "Relevant ticket IDs, screenshots, or error messages",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-blue-700">
                      <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 ml-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-normal text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-normal text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 ml-1">Your Message <span className="text-red-500">*</span></label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your needs... (e.g., pricing inquiry, technical support, demo request)"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-normal text-gray-900 h-40 resize-none placeholder:text-gray-400 text-sm"
                  ></textarea>
                  <p className="text-[10px] text-gray-400 ml-1">Be as detailed as possible so we can help you better.</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2" 
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Info Card */}
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.3 }}
                className="shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100"
              >
                <h2 className="text-sm md:text-base font-medium text-gray-900 mb-2 flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" /> Contact Information
                </h2>
                <p className="text-gray-500 text-xs mb-4">
                  Prefer to reach out directly? Here's how you can contact us.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: MapPin, label: "Visit Our Office", val: "GPO, Huduma Center, Nairobi", action: "Get Directions" },
                    { icon: Phone, label: "Call Us", val: "+254 700 123 456", action: "Call Now" },
                    { icon: Mail, label: "Email Us", val: "support@solease.com", action: "Send Email" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between group/item p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 block">{item.label}</span>
                          <span className="text-gray-900 text-sm font-normal">{item.val}</span>
                        </div>
                      </div>
                      <span className="text-blue-600 text-xs font-normal opacity-0 group-hover/item:opacity-100 transition-opacity">{item.action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Availability Card */}
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.4 }}
                className="bg-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 blur-[30px] rounded-full" />
                
                <p className="font-medium mb-4 text-blue-400 flex items-center gap-2 uppercase tracking-wider text-[10px]">
                  <Clock className="size-3" /> Service Status
                </p>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <p className="font-medium flex items-center gap-2 text-sm">
                      <Activity size={14} className="text-green-400 animate-pulse" /> System Status
                    </p>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-medium uppercase rounded-full">
                      All Systems Operational
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <p className="text-slate-300 text-sm">Average Response Time</p>
                    <p className="font-medium text-white text-sm">Under 4 hours</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-slate-300 text-sm">Support Availability</p>
                    <p className="text-blue-400 font-medium text-sm">24/7 for Enterprise</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Help Card */}
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 p-5 rounded-xl border border-blue-100"
              >
                <h3 className="font-medium text-gray-900 mb-1.5 text-sm">Need Immediate Help?</h3>
                <p className="text-gray-600 text-xs mb-3">Check our knowledge base or browse common topics.</p>
                <div className="flex gap-2">
                  <a href="#" className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                    Knowledge Base
                  </a>
                  <a href="#" className="flex-1 bg-white text-blue-600 border border-blue-200 text-center py-2 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                    Browse Topics
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Directory Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 text-xs font-medium uppercase tracking-[0.2em] mb-3 block">Contact Directory</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">Reach the Right Team Faster</h2>
            <p className="text-gray-600 text-sm md:text-base mt-3 max-w-3xl mx-auto">
              Choose the best contact path for your request type to get faster and more accurate support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {contactDirectory.map((item, index) => (
              <motion.div
                key={item.team}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <h3 className="text-sm md:text-base font-medium text-gray-900">{item.team}</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-medium">Email:</span> {item.email}
                </p>
                <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                  <span className="font-medium text-gray-700">Best for:</span> {item.bestFor}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium text-gray-700">Expected response:</span> {item.response}
                </p>
                <p className="text-gray-500 text-xs mt-2">{item.availability}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Process Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 text-xs font-medium uppercase tracking-[0.2em] mb-3 block">How We Handle Requests</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">What Happens After You Contact Us</h2>
            <p className="text-gray-600 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              Every inquiry follows a structured support process to ensure quick ownership and clear communication.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {responseProcess.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-xl p-5 border border-gray-100"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 text-xs font-medium uppercase tracking-[0.2em] mb-3 block">Multiple Ways to Reach Us</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">Choose Your Preferred Channel</h2>
            <p className="text-gray-600 text-sm md:text-base mt-3 max-w-2xl mx-auto">We're available through various channels to ensure you get the help you need, when you need it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-5 text-center hover:bg-blue-50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <channel.icon size={20} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{channel.name}</h4>
                <p className="text-gray-500 text-xs md:text-sm mb-2">{channel.desc}</p>
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {channel.available || channel.response}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Gallery Section */}
      {/* <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Visit Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Our Office Location</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We'd love to meet you in person. Stop by our office for a demo or consultation.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {officeImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden h-64 group"
              >
                <img src={img} alt={`Office ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>

          //Map
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-4 shadow-lg"
          >
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <MapPin size={48} className="text-blue-600 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold">GPO, Huduma Center, Nairobi</p>
                <p className="text-gray-500 text-sm mt-1">Click to open in Google Maps →</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* SLA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 text-xs font-medium uppercase tracking-[0.2em] mb-3 block">Our Commitments</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">Support Response Times</h2>
            <p className="text-gray-600 text-sm md:text-base mt-3 max-w-2xl mx-auto">We know quick response times are critical. Here's what you can expect with each plan.</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-900 text-sm">SLA Metric</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-600 text-sm">Basic</th>
                  <th className="text-center py-4 px-4 font-medium text-blue-600 bg-blue-50 rounded-t-xl text-sm">Pro</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-900 text-sm">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {slaGuarantees.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700 font-normal text-sm">{row.title}</td>
                    <td className="py-3 px-4 text-center text-gray-500 text-sm">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : row.basic}
                    </td>
                    <td className="py-3 px-4 text-center bg-blue-50/50">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-blue-600 font-normal text-sm">{row.pro}</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-gray-900 font-medium text-sm">{row.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pre-Sales FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="text-center mb-8">
              <HelpCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">Common Questions</h2>
              <p className="text-gray-600 text-sm md:text-base mt-2">Find quick answers to common questions before contacting us.</p>
            </div>

            <div className="space-y-3">
              {preSalesFAQs.map((faq, i) => (
                <div key={i} className="collapse collapse-plus border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-all">
                  <input type="checkbox" />
                  <div className="collapse-title font-normal text-gray-900 flex items-center gap-3 text-sm">
                    <span className="text-blue-600 text-xs font-medium">0{i + 1}</span>
                    {faq.q}
                  </div>
                  <div className="collapse-content text-gray-600 pl-8">
                    <p className="text-sm">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-gray-700 text-xs">Can't find what you're looking for?</p>
              <a href="#" className="text-blue-600 font-medium hover:underline text-xs">Browse all FAQs</a> or use the contact form above.
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl p-8 md:p-12 text-white"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm">
              Join thousands of organizations using SOLEASE to transform their support operations. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/auth/signup" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm">
                Start Free Trial
              </a>
              <a href="/services" className="bg-blue-500 text-white border border-blue-400 px-6 py-3 rounded-xl font-medium hover:bg-blue-400 transition-colors text-sm">
                View Pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 font-medium mb-6 text-sm">Follow us for product updates, release notes, and support tips</p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white hover:bg-blue-600 hover:text-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
