import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronRight, HelpCircle } from 'lucide-react'; 

const services = [
  // ... (Your services data remains exactly the same)
  {
    title: "Ticket Management",
    description: "Complete ticket lifecycle management with automated routing, priority assignment, and SLA tracking. Streamline your support workflow from submission to resolution.",
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1974&auto=format&fit=crop",
    task: { 1: "SLA Tracking", 2: "Priority Management" }
  },
  {
    title: "Analytics and Reporting",
    description: "Gain insights with advanced reporting dashboards and performance analytics to improve decision-making.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=870&auto=format&fit=crop",
    task: { 1: "Real Time Dashboard", 2: "Customer Reports" }
  },
  {
    title: "User Management",
    description: "Simplify onboarding, access control, and user role assignments with secure management tools.",
    image: "https://images.unsplash.com/photo-1613347761493-4060c969cd28?q=80&w=774&auto=format&fit=crop",
    task: { 1: "Role Management", 2: "Custom Branding" }
  },
  {
    title: "Tickets Progress",
    description: "See the progress of your tickets with a real-time dashboard.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop",
    task: { 1: "Real Time Updates", 2: "Progress Visualization" }
  },
  {
    title: "Support & Maintenance",
    description: "Ongoing support to keep your digital assets secure, updated, and reliable.",
    image: "https://images.pexels.com/photos/8867474/pexels-photo-8867474.jpeg",
    task: { 1: "System Monitoring", 2: "Regular Updates" }
  },
  {
    title: "AI-Powered Ticket Management",
    description: "Experience smart triaging. Our system uses NLP to understand ticket urgency and sentiment, routing issues to the right expert instantly.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    task: { 1: "AI Smart Routing", 2: "Sentiment Analysis" },
    isAI: true 
  },
  {
    title: "Predictive Analytics",
    description: "Move beyond history. Gain foresight into IT bottlenecks and system health before issues arise using machine learning models.",
    image: "https://images.pexels.com/photos/5816299/pexels-photo-5816299.jpeg",
    task: { 1: "Anomaly Detection", 2: "Proactive Forecasts" },
    isAI: true
  }
];

const faqs = [
  { q: "How do I create a support ticket?", a: "Log in, click 'Create Ticket', enter your issue details, and submit. You’ll get a confirmation and can monitor progress in your dashboard." },
  { q: "Who can access and manage tickets?", a: "Access is based on user roles. Staff can view their own tickets, while IT teams and managers oversee tickets relevant to their responsibilities." },
  { q: "How does the AI improve ticket resolution?", a: "The AI instantly routes tickets to the correct department by analyzing keywords and urgency, reducing manual wait times by 40%." },
  { q: "Can the system predict system failures?", a: "Yes, our Predictive Analytics service uses machine learning to alert IT staff about potential hardware or network issues before they occur." }
];

const ServicePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id='services' className="min-h-screen w-full bg-[#fafbfc] flex flex-col items-center pt-24 pb-24 font-sans">
      <div className="max-w-7xl w-full px-6">
        
        {/* Header Section - Modernized with better tracking */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Expert Solutions</span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">IT Support Services</h2>
           <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover our comprehensive suite of services designed to streamline your{" "}
            <span className="text-blue-600 border-b-2 border-blue-100 pb-0.5">IT operations</span>.
          </p>
        </motion.div>

        {/* Search Bar - Enhanced Focus States */}
        <div className="relative max-w-xl mx-auto mb-20 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for a specialized service..."
            className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-[2rem] bg-white shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder:text-gray-600"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Service Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24"
        >
          <AnimatePresence mode='popLayout'>
            {filteredServices.map((service) => (
              <motion.div
                layout
                key={service.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -10 }}
                className="group bg-white/40 rounded-[2.5rem] overflow-hidden border border-gray-300/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.15)] transition-all duration-500 flex flex-col relative"
              >
                {service.isAI && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-xl border border-white/20">
                      <Sparkles size={12} className="text-blue-400" /> AI Enhanced
                    </span>
                  </div>
                )}

                <div className="relative h-60 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-10 flex flex-col flex-grow">
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{service.title}</h3>
                   <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">
                    {service.description}
                  </p>
                  
                  {service.task && (
                    <div className="mt-auto flex flex-wrap gap-2">
                       <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-extrabold uppercase rounded-full border border-blue-100 shadow-sm">
                         {service.task[1]}
                       </span>
                       <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-extrabold uppercase rounded-full border border-gray-300/5">
                        {service.task[2]}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* FAQ Section - Clean & Geometric */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/40 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-gray-300/5 p-12 md:p-20 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <HelpCircle className="absolute -bottom-10 -right-10 size-64 text-slate-50 opacity-[0.03] rotate-12" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4 tracking-tight">Support Made Simple</h2>
            <p className="text-gray-600 text-center mb-16 text-lg font-medium">
              Explore common queries about our digital ticketing platform.
            </p>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="collapse collapse-arrow border border-gray-300/5 rounded-3xl bg-gray-100/5 hover:bg-white/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-bold text-gray-900 flex items-center gap-4">
                    <span className="text-blue-600/30 text-2xl font-black">0{i + 1}</span>
                    {faq.q}
                  </div>
                  <div className="collapse-content text-gray-600 px-14">
                    <p className="text-base leading-relaxed font-medium pt-2 pb-4">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ServicePage;