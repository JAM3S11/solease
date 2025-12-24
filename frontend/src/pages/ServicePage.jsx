import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const services = [
  {
    title: "Ticket Management",
    description: "Complete ticket lifecycle management with automated routing, priority assignment, and SLA tracking. Streamline your support workflow from submission to resolution.",
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: { 1: "SLA Tracking", 2: "Priority Management" }
  },
  {
    title: "Analytics and Reporting",
    description: "Gain insights with advanced reporting dashboards and performance analytics to improve decision-making.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: { 1: "Real Time Dashboard", 2: "Customer Reports" }
  },
  {
    title: "User Management",
    description: "Simplify onboarding, access control, and user role assignments with secure management tools.",
    image: "https://images.unsplash.com/photo-1613347761493-4060c969cd28?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: { 1: "Role Management", 2: "Custom Branding" }
  },
  {
    title: "Tickets Progress",
    description: "See the progress of your tickets with a real-time dashboard.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    task: { 1: "Real Time Updates", 2: "Progress Visualization" }
  },
  {
    title: "Support & Maintenance",
    description: "Ongoing support to keep your digital assets secure, updated, and reliable.",
    image: "https://images.pexels.com/photos/8867474/pexels-photo-8867474.jpeg",
    task: { 1: "System Monitoring", 2: "Regular Updates" }
  },
];

const faqs = [
  { q: "How do I create a support ticket?", a: "Log in, click 'Create Ticket', enter your issue details, and submit. You’ll get a confirmation and can monitor progress in your dashboard." },
  { q: "Who can access and manage tickets?", a: "Access is based on user roles. Staff can view their own tickets, while IT teams and managers oversee tickets relevant to their responsibilities." },
  { q: "How are tickets assigned and prioritized?", a: "Tickets are sorted and assigned automatically by issue type, urgency, and available IT staff to ensure prompt handling." },
  { q: "Can I monitor my ticket status?", a: "Yes, you’ll receive real-time updates and notifications as your ticket moves through each stage until it’s resolved." }
];

const ServicePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id='services' className="min-h-screen w-full bg-gray-50 flex flex-col items-center pt-24 pb-20">
      <div className="max-w-6xl w-full px-4">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-extrabold text-blue-600 mb-4">IT Support Services</h2>
          <p className="text-lg text-gray-700">
            Discover our comprehensive suite of services designed to streamline your{" "}
            <br className="hidden md:block" />
            <span className="text-blue-600">IT operations and enhance support efficiency</span>.
          </p>
        </motion.div>

        {/* Search Bar Integration */}
        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a service..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 mx-2 md:mx-0"
        >
          <AnimatePresence mode='popLayout'>
            {filteredServices.map((service, idx) => (
              <motion.div
                layout
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group bg-white shadow-sm hover:shadow-xl 
                transition-all duration-300 flex flex-col rounded-2xl 
                overflow-hidden border border-gray-100"
              >
                <div className="overflow-hidden h-48">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-110 
                    transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-blue-600 mb-2">{service.title}</h2>
                  <p className="line-clamp-3 text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  {service.task && (
                    <div className="mt-auto flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-lg border border-blue-100">
                        {service.task[1]}
                      </span>
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-lg border border-gray-100">
                        {service.task[2]}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mx-2 mb-8 md:mx-0"
        >
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-3">FAQ: Digital support made easy</h2>
          <p className="text-gray-600 text-center mb-8">
            Explore common queries about our digital ticketing platform.
          </p>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="collapse collapse-arrow border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium text-blue-600">
                  {faq.q}
                </div>
                <div className="collapse-content text-gray-600">
                  <p className="text-sm">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ServicePage;