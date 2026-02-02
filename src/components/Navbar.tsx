import React from 'react';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
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
          <a href="/services" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Services
          </a>
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
