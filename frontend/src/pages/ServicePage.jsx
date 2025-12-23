import React from 'react'

const services = [
  {
    title: "Ticket Management",
    description: "Complete ticket lifecycle management with automated routing, priority assignment, and SLA tracking. Streamline your support workflow from submission to resolution.",
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: {
      1: "SLA Tracking",
      2: "Priority Management"
    }
  },
  {
    title: "Analytics and Reporting",
    description: "Gain insights with advanced reporting dashboards and performance analytics to improve decision-making.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: {
      1: "Real Time Dashboard",
      2: "Customer Reports"
    }
  },
  {
    title: "User Management",
    description: "Simplify onboarding, access control, and user role assignments with secure management tools.",
    image: "https://images.unsplash.com/photo-1613347761493-4060c969cd28?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0",
    task: {
      1: "Role Management",
      2: "Custom Branding"
    }
  },
  {
    title: "Tickets Progress",
    description: "See the progress of your tickets with a real-time dashboard.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    task: {
      1: "Real Time Updates",
      2: "Progress Visualization"
    }
  },
  {
    title: "Support & Maintenance",
    description: "Ongoing support to keep your digital assets secure, updated, and reliable.",
    image: "https://images.pexels.com/photos/8867474/pexels-photo-8867474.jpeg",
    task: {
      1: "System Monitoring",
      2: "Regular Updates"
    }
  },
];

const faqs = [
  {
    q: "How do I create a support ticket?",
    a: "Log in, click 'Create Ticket', enter your issue details, and submit. You’ll get a confirmation and can monitor progress in your dashboard."
  },
  {
    q: "Who can access and manage tickets?",
    a: "Access is based on user roles. Staff can view their own tickets, while IT teams and managers oversee tickets relevant to their responsibilities."
  },
  {
    q: "How are tickets assigned and prioritized?",
    a: "Tickets are sorted and assigned automatically by issue type, urgency, and available IT staff to ensure prompt handling."
  },
  {
    q: "Can I monitor my ticket status?",
    a: "Yes, you’ll receive real-time updates and notifications as your ticket moves through each stage until it’s resolved."
  }
];

const ServicePage = () => {
  return (
    <div id='services' className="min-h-screen w-full bg-gray-50 flex flex-col items-center pt-24">
      <div className="max-w-6xl w-full px-4">
        {/* Services */}
        <h2 className="text-4xl font-extrabold text-blue-600 text-center mb-4">IT Support Services</h2>
        <p className="text-lg text-gray-700 text-center mb-10">
          Discover our comprehensive suite of services designed to streamline your{" "}
          <br />
          <span className="text-blue-600">IT operations and enhance support efficiency</span>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mx-2 md:mx-0">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="card card-compact bg-white w-full md:w-75 lg:w-94 shadow-xl hover:shadow-2xl transition flex flex-col rounded-md"
            >
              <figure>
                <img
                  src={service.image}
                  alt={service.title}
                  className="object-cover w-full h-48 hover:scale-105 transition-all duration-300"
                />
              </figure>
              <div className="card-body flex flex-col flex-grow">
                <h2 className="card-title text-lg font-bold text-blue-600">{service.title}</h2>
                <p className="line-clamp-2 flex-grow text-gray-600">{service.description}</p>
                {service.task && (
                  <div className="card-actions justify-start mt-4 flex gap-2">
                    <button className="btn btn-outline btn-sm">{service.task[1]}</button>
                    <button className="btn btn-outline btn-sm">{service.task[2]}</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mx-2 mb-8 md:mx-0">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-3">FAQ: Digital support made easy</h2>
          <p className="text-gray-600 text-center mb-8">
            Explore common queries about our digital ticketing platform and how it improves IT support for your organization.
          </p>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="collapse collapse-arrow border border-gray-200 rounded-lg">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium text-blue-600">
                  {faq.q}
                </div>
                <div className="collapse-content text-gray-600">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ServicePage