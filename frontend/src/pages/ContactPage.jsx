import React, { useState } from "react";
import api from "../lib/axios.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 
import { MapPin, Phone, Mail, Clock, ShieldCheck, Activity, Send, MessageCircle, Twitter, Linkedin, Instagram, Facebook, HelpCircle, CheckCircle2, ArrowRight, Zap, Users, Calendar } from "lucide-react"; 

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

  const officeImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop"
  ];

  const socialLinks = [
    { icon: Twitter, name: "Twitter", href: "#" },
    { icon: Linkedin, name: "LinkedIn", href: "#" },
    { icon: Instagram, name: "Instagram", href: "#" },
    { icon: Facebook, name: "Facebook", href: "#" }
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

  return (
    <div className="w-full bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl text-center">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Contact Us</span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">We're Here to Help</h1>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
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
              className="bg-white shadow-lg rounded-[2.5rem] p-8 md:p-12 border border-gray-100"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                Send us a Message
              </h2>
              <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll respond within 24 hours.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Your Message <span className="text-red-500">*</span></label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your needs... (e.g., pricing inquiry, technical support, demo request)"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 h-48 resize-none placeholder:text-gray-400"
                  ></textarea>
                  <p className="text-xs text-gray-400 ml-1">Be as detailed as possible so we can help you better.</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2" 
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
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
                className="bg-white shadow-lg rounded-[2.5rem] p-8 md:p-10 border border-gray-100"
              >
                <h2 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" /> Contact Information
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Prefer to reach out directly? Here's how you can contact us.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: MapPin, label: "Visit Our Office", val: "GPO, Huduma Center, Nairobi", action: "Get Directions" },
                    { icon: Phone, label: "Call Us", val: "+254 700 123 456", action: "Call Now" },
                    { icon: Mail, label: "Email Us", val: "support@solease.com", action: "Send Email" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between group/item p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">{item.label}</span>
                          <span className="text-gray-900 font-semibold">{item.val}</span>
                        </div>
                      </div>
                      <span className="text-blue-600 text-sm font-medium opacity-0 group-hover/item:opacity-100 transition-opacity">{item.action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Availability Card */}
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.4 }}
                className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 blur-[30px] rounded-full" />
                
                <p className="font-bold mb-6 text-blue-400 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <Clock className="size-4" /> Service Status
                </p>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <p className="font-bold flex items-center gap-3">
                      <Activity size={18} className="text-green-400 animate-pulse" /> System Status
                    </p>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold uppercase rounded-full">
                      All Systems Operational
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <p className="text-slate-300">Average Response Time</p>
                    <p className="font-bold text-white">Under 4 hours</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-slate-300">Support Availability</p>
                    <p className="text-blue-400 font-bold">24/7 for Enterprise</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Help Card */}
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 p-6 rounded-2xl border border-blue-100"
              >
                <h3 className="font-bold text-gray-900 mb-2">Need Immediate Help?</h3>
                <p className="text-gray-600 text-sm mb-4">Check our knowledge base or browse common topics.</p>
                <div className="flex gap-3">
                  <a href="#" className="flex-1 bg-blue-600 text-white text-center py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    Knowledge Base
                  </a>
                  <a href="#" className="flex-1 bg-white text-blue-600 border border-blue-200 text-center py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
                    Browse Topics
                  </a>
                </div>
              </motion.div>
            </div>
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
            className="text-center mb-12"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Multiple Ways to Reach Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Choose Your Preferred Channel</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We're available through various channels to ensure you get the help you need, when you need it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <channel.icon size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{channel.name}</h4>
                <p className="text-gray-500 text-sm mb-3">{channel.desc}</p>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Commitments</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Support Response Times</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We know quick response times are critical. Here's what you can expect with each plan.</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-6 px-6 font-bold text-gray-900">SLA Metric</th>
                  <th className="text-center py-6 px-6 font-bold text-gray-600">Basic</th>
                  <th className="text-center py-6 px-6 font-bold text-blue-600 bg-blue-50 rounded-t-2xl">Pro</th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {slaGuarantees.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-5 px-6 text-gray-700 font-medium">{row.title}</td>
                    <td className="py-5 px-6 text-center text-gray-500">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : row.basic}
                    </td>
                    <td className="py-5 px-6 text-center bg-blue-50/50">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-blue-600 font-semibold">{row.pro}</span>}
                    </td>
                    <td className="py-5 px-6 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : <span className="text-gray-900 font-bold">{row.enterprise}</span>}
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
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-lg"
          >
            <div className="text-center mb-10">
              <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common Questions</h2>
              <p className="text-gray-600 mt-2">Find quick answers to common questions before contacting us.</p>
            </div>

            <div className="space-y-4">
              {preSalesFAQs.map((faq, i) => (
                <div key={i} className="collapse collapse-plus border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all">
                  <input type="checkbox" />
                  <div className="collapse-title font-semibold text-gray-900 flex items-center gap-3">
                    <span className="text-blue-600 text-sm font-bold">0{i + 1}</span>
                    {faq.q}
                  </div>
                  <div className="collapse-content text-gray-600 pl-8">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-gray-700 text-sm">Can't find what you're looking for?</p>
              <a href="#" className="text-blue-600 font-semibold hover:underline">Browse all FAQs</a> or use the contact form above.
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
            className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-[3rem] p-10 md:p-16 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Join thousands of organizations using SOLEASE to transform their support operations. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </a>
              <a href="/services" className="bg-blue-500 text-white border border-blue-400 px-8 py-4 rounded-xl font-bold hover:bg-blue-400 transition-colors">
                View Pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Links Section */}
      {/* <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 font-medium mb-6">Follow us on social media for updates and tips</p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                className="w-12 h-12 bg-white hover:bg-blue-600 hover:text-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default ContactPage;
