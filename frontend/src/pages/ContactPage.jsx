import React, { useState } from "react";
import api from "../lib/utils.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 
import { MapPin, Phone, Mail, Clock, ShieldCheck, Activity, Send } from "lucide-react"; 

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
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsSending(true);
      await api.post("/contact", formData);
      setFormData({ fullName: "", email: "", message: "" });
      toast.success("Thank you for reaching out to us! We shall get back to you!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! You're navigating too fast", { duration: 4000, icon: "💀" });
      } else {
        toast.error("Failed to fill contact form");
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

  return (
    <div id="contact" className="min-h-screen bg-[#fafbfc] flex flex-col items-center py-24 px-6 overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Heading Section */}
      <motion.div {...fadeInUp} className="max-w-3xl text-center mb-16">
        <span className="text-blue-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">Connect with us</span>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Get in Touch</h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
          Have questions or need support? Our team is here to help you bridge the gap between complexity and resolution.
        </p>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full">
        
        {/* Contact Form Container */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] p-10 md:p-12 rounded-[2.5rem] border border-slate-100 relative group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Send size={120} className="-rotate-12" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
            Send us a Message
          </h2>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="support@solease.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help your community today?"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 h-44 resize-none"
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 rounded-2xl bg-slate-950 text-white font-black tracking-tighter text-lg shadow-2xl shadow-slate-950/20 hover:bg-blue-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2" 
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
              {!isSending && <Send size={18} />}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Info Column */}
        <div className="space-y-8">
          {/* Info Card */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-xl shadow-slate-200/50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-colors duration-500"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
              <ShieldCheck className="text-blue-600" /> Information
            </h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Reach out via our official channels or visit us for a personalized consultation.
            </p>
            <ul className="space-y-6">
              {[
                { icon: MapPin, label: "Our Office", val: "GPO, Huduma Center, Nairobi" },
                { icon: Phone, label: "Phone Number", val: "+254 700 123 456" },
                { icon: Mail, label: "Email Support", val: "support@solease.com" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5 group/item">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.label}</span>
                    <span className="text-slate-900 font-bold text-lg">{item.val}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Availability Card */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="bg-slate-950 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full" />
            
            <p className="font-black mb-8 text-blue-400 flex items-center gap-2 uppercase tracking-widest text-xs">
              <Clock className="size-4" /> Service Availability
            </p>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <p className="font-bold flex items-center gap-3">
                  <Activity size={18} className="text-green-400 animate-pulse" /> Current Status
                </p>
                <span className="px-4 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                  Systems Operational
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <p className="font-bold text-slate-300">Demo Activity</p>
                <p className="text-white font-black">Same day scheduling</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-bold text-slate-300">Support Hours</p>
                <p className="text-blue-400 font-black">24/7 Enterprise</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;