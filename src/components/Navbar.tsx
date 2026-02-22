import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_EMAILS } from '../utils/auth';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeEmail, setActiveEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const syncUserFromStorage = () => {
      if (typeof window === 'undefined') return;
      const email = localStorage.getItem('dashboard_active_email') || '';
      const slug = localStorage.getItem('dashboard_active_client_slug') || '';
      const nameBySlug: Record<string, string> = {
        'little-sicily': 'Little Sicily',
        'cash-for-gold': 'Cash For Gold Beckley',
        'karachi-bbq': 'Karachi BBQ',
        'evolo-ai': 'Evolo AI',
      };

      const resolvedName =
        nameBySlug[slug] ||
        (email.includes('@') ? email.split('@')[0] : email) ||
        '';

      setActiveEmail(email);
      setDisplayName(resolvedName);
    };

    syncUserFromStorage();
    window.addEventListener('storage', syncUserFromStorage);
    return () => window.removeEventListener('storage', syncUserFromStorage);
  }, []);

  const isLoggedIn = Boolean(activeEmail);
  const profileInitial = (displayName || activeEmail).charAt(0).toUpperCase() || 'U';
  const dashboardPath = ADMIN_EMAILS.includes(activeEmail) ? '/admin' : '/dashboard';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard_active_client_slug');
      localStorage.removeItem('dashboard_active_email');
    }
    setActiveEmail('');
    setDisplayName('');
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
      <nav className="sticky top-0 z-[1000] w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 via-orange-50 to-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center" aria-label="Go to home page">
          <img
            src="/images/logo1.png"
            alt="a Mark Lous Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

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
          {/* <Link to="/team" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Team
          </Link> */}
          <Link to="/blog" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-800 hover:text-gray-900 text-sm font-medium transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop Login */}
        <div className="hidden lg:flex items-center">
          {isLoggedIn ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e2749] text-white text-sm font-semibold">
                  {profileInitial}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">
                    {displayName || activeEmail}
                  </div>
                </div>
                <svg className={`h-4 w-4 text-slate-500 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  <Link
                    to={dashboardPath}
                    onClick={() => setAccountMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
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
          )}
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
              {/* <Link to="/team" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Team</Link> */}
              <Link to="/blog" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/contact" className="px-3 py-2 text-sm text-gray-800" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              {isLoggedIn ? (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2749] text-white text-xs font-semibold">
                    {profileInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {displayName || activeEmail}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Login</span>
                  <img src="/images/btnarow.svg" alt="arrow" className="w-4 h-4" />
                </button>
              )}
              {isLoggedIn ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </nav>
  );
};

export default Navbar;
