import React from 'react'
import { Users, ChartColumn, Medal } from 'lucide-react';

const Aboutpage = () => {
  return (
    <div
      id="about"
      className="min-h-screen w-full bg-gray-50 flex items-center justify-center pt-16 md:pt-24 pb-10 md:pb-16"
    >
      <div className="px-4 md:px-10 w-full max-w-7xl">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-4 text-center leading-snug">
          Manage your entire community <br className="hidden md:block" /> in a single system
        </h2>
        <p className="text-base md:text-lg text-gray-700/70 mb-8 text-center">
          Who is SOLEASE suitable for?
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10 mx-2 md:mx-0">
          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-center mb-3">
              <Users className="size-14 md:size-16 bg-slate-300/40 p-2 rounded-lg" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-blue-500 mb-2 text-center">
              Membership Organisations
            </h3>
            <p className="text-gray-600 text-sm md:text-base text-center">
              Our SolEase Ticketing System automates IT support requests, ensuring timely resolutions without manual follow-ups.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-center mb-3">
              <ChartColumn className="size-14 md:size-16 bg-slate-300/40 p-2 rounded-lg" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-blue-500 mb-2 text-center">
              National Associations
            </h3>
            <p className="text-gray-600 text-sm md:text-base text-center">
              SolEase centralizes issue reporting for associations, enabling efficient tracking, assignment, and resolution.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center justify-center mb-3">
              <Medal className="size-14 md:size-16 bg-slate-300/40 p-2 rounded-lg" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-blue-500 mb-2 text-center">
              Clubs And Groups
            </h3>
            <p className="text-gray-600 text-sm md:text-base text-center">
              SolEase empowers clubs to simplify their support process, digitize ticket submissions, and improve accountability.
            </p>
          </div>
        </div>

        {/* Main Agenda */}
        <div className="m-2 mx-2 md:mx-0 p-6 md:p-10 backdrop-blur-sm bg-slate-200/30 rounded-2xl flex flex-col gap-4 items-center shadow">
          <h4 className="text-2xl md:text-3xl font-bold text-gray-800 text-center text-cyan-300/85 uppercase">
            Main agenda of SOLEASE
          </h4>
          <p className="text-gray-700 text-sm md:text-base text-center px-2 md:px-6">
            Our platform is adopted by ministries, agencies, and public sector partners across Kenya. 
            It streamlines IT support, resolves issues faster, and improves service delivery through a secure, centralized system.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-500 text-white px-8 md:px-6 py-2 md:py-3 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
          >
            Learn More
          </a>
        </div>

        {/* Stats Section */}
        <div className="text-center mt-12">
          <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Ticket Community Management
          </h4>
          <p className="text-gray-700 text-sm md:text-base mb-6">
            Helping government institutions transform IT support <br className="hidden md:block" />
            into a seamless, centralized system
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
            <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-2">👥</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">1,000</span>
              <span className="text-gray-600 mt-1 text-sm md:text-base">Active Users</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-2">🎫</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">128</span>
              <span className="text-gray-600 mt-1 text-sm md:text-base">Tickets Solved</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-2">⚡</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">267</span>
              <span className="text-gray-600 mt-1 text-sm md:text-base">Real-Time Notifications Sent</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <span className="text-2xl md:text-3xl mb-2">📊</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">436</span>
              <span className="text-gray-600 mt-1 text-sm md:text-base">Performance Reports Generated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Aboutpage