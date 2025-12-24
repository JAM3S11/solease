import React, { useState } from "react";
import api from "../lib/utils.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 
import { MapPin, Phone, Mail, Clock, ShieldCheck, Activity } from "lucide-react"; 

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

  // Motion variants for consistent entry
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div id="contact" className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 overflow-hidden">
      {/* Heading */}
      <motion.div {...fadeInUp} className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-lg">
          Have questions or need support? Our team is here to help. 
          Reach out to us and we’ll respond as soon as possible.
        </p>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
        
        {/* Contact Form */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="card bg-white shadow-2xl shadow-blue-500/5 p-8 mx-2 md:mx-0 rounded-2xl border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
            <Mail className="size-6" /> Send us a Message
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text font-medium text-gray-700">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered focus:input-primary w-full bg-gray-50/50"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="support@solease.com"
                className="input input-bordered focus:input-primary w-full bg-gray-50/50"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-gray-700">Message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="textarea textarea-bordered focus:textarea-primary w-full h-36 bg-gray-50/50"
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-md rounded-xl w-full text-white font-bold tracking-wide" 
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Info & Availability Column */}
        <div className="space-y-8">
          {/* Contact Info */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="card bg-white shadow-lg p-8 mx-2 md:mx-0 rounded-2xl border border-gray-100"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <ShieldCheck className="size-5" /> Contact Information
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Feel free to reach out via phone, email, or visit our office for direct consultations.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPin size={20} /></div>
                <div><span className="font-bold block text-sm">Our Office</span>GPO, Huduma Center, Nairobi</div>
              </li>
              <li className="flex items-start gap-4 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Phone size={20} /></div>
                <div><span className="font-bold block text-sm">Phone Number</span>+254 700 123 456</div>
              </li>
              <li className="flex items-start gap-4 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail size={20} /></div>
                <div><span className="font-bold block text-sm">Email Support</span>support@solease.com</div>
              </li>
            </ul>
          </motion.div>

          {/* Availability Card */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-white to-blue-50/30 shadow-lg p-8 mx-2 md:mx-0 rounded-2xl border border-blue-100/50"
          >
            <p className="font-bold mb-6 text-blue-600 flex items-center gap-2 italic">
              <Clock className="size-5" /> Service Availability
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Activity size={16} className="text-green-500" /> Current Status
                </p>
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-sm">
                  Free Trial Active
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <p className="text-sm font-semibold text-gray-700">Demo Activity</p>
                <p className="text-gray-500 text-sm font-medium">Same day scheduling</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">Support Hours</p>
                <p className="text-blue-600 text-sm font-bold">24/7 Enterprise Solution</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;