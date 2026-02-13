import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ContactusProps {
  onLoginClick: () => void;
}

const Contactus: React.FC<ContactusProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]" style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Navbar onLoginClick={onLoginClick} />

      <main className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 bg-white rounded-3xl shadow-sm p-6 sm:p-10">
          {/* Left content */}
          <div className="space-y-6">
            <button className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] border border-[#B3BDEF]">
              Get in Touch
            </button>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Let&apos;s discuss your
              <br />
              project
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We are committed to understanding your requirements and crafting a tailored solution that aligns
              with your goals.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Enter your details and someone from our team will reach out to find a time to connect with you.
            </p>
          </div>

          {/* Right form */}
          <form className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Company URL</label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            {/* Services checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Services you are looking for <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {[
                  'Digital Marketing',
                  'Branding',
                  'Remote IT Resources',
                  'Custom Software Development',
                  'Web Development',
                  'Mobile App Development',
                  'Other IT Services',
                ].map((service) => (
                  <label key={service} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#F29335] focus:ring-[#F29335]"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project details */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#F29335] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#e0852a] transition-colors text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contactus;
