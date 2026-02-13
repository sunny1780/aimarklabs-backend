import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!servicesRef.current) return;
      if (!servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <nav className="w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 via-orange-50 to-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/images/logo1.png"
            alt="a Mark Lous Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            About Us
          </Link>
          {/* Services Dropdown */}
          <div
            className="relative"
            ref={servicesRef}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-1"
            >
              Services
              <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 w-52 py-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</span>
                </div>
                <Link
                  to="/services/creative-services"
                  onClick={() => setServicesOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Creative Services
                </Link>
                <Link
                  to="/services/branding-services"
                  onClick={() => setServicesOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Branding Services
                </Link>
                <Link
                  to="/services/development-services"
                  onClick={() => setServicesOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Development Services
                </Link>
                <Link
                  to="/services/marketing-services"
                  onClick={() => setServicesOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Marketing Services
                </Link>
              </div>
            )}
          </div>
          <Link to="/industries" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Industries
          </Link>
          <Link to="/team" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Team
          </Link>
          <Link to="/blog" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop Login */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onLoginClick}
            className="bg-[#F29335] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Login</span>
            <img
              src="/images/btnarow.svg"
              alt="arrow"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-700"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm p-3">
          <div className="flex flex-col">
            <Link to="/" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <button
              type="button"
              onClick={() => setMobileServicesOpen((prev) => !prev)}
              className="px-3 py-2 text-sm text-gray-800 flex items-center justify-between"
            >
              Services
              <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileServicesOpen && (
              <div className="ml-2 border-l border-gray-200 pl-3">
                <Link to="/services/creative-services" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Creative Services</Link>
                <Link to="/services/branding-services" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Branding Services</Link>
                <Link to="/services/development-services" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Development Services</Link>
                <Link to="/services/marketing-services" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Marketing Services</Link>
              </div>
            )}
            <Link to="/industries" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Industries</Link>
            <Link to="/team" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Team</Link>
            <Link to="/blog" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/contact" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <button
              onClick={onLoginClick}
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Login</span>
              <img src="/images/btnarow.svg" alt="arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
