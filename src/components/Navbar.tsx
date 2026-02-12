import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 via-orange-50 to-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src="/images/logo1.png" 
            alt="a Mark Lous Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <a href="/" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Home
          </a>
          <a href="/about" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            About Us
          </a>
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-1">
              Services
              <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</span>
                </div>
                <Link
                  to="/services/creative-services"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Creative Services
                </Link>
                <Link
                  to="/services/branding-services"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Branding Services
                </Link>
                <Link
                  to="/services/development-services"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Development Services
                </Link>
                <Link
                  to="/services/marketing-services"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Marketing Services
                </Link>
              </div>
            )}
          </div>
          <a href="/industries" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Industries
          </a>
          <a href="/team" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Team
          </a>
          <a href="/blog" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Blog
          </a>
          <a href="/contact" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Contact
          </a>
        </div>

        {/* Login Button */}
        <div className="flex items-center">
          <button 
            onClick={onLoginClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Login</span>
            <img 
              src="/images/btnarow.svg" 
              alt="arrow" 
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
