import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin,  } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleInternalNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columnOneLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Industries', to: '/industries' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  const columnTwoLinks = [
    { label: 'Creative', to: '/services/creative-services' },
    { label: 'Branding', to: '/services/branding-services' },
    { label: 'Development', to: '/services/development-services' },
    { label: 'Marketing', to: '/services/marketing-services' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/people/AI-Mark-Labs/61555229655979/' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/aimarklab/' },
    // { name: 'X', icon: FaXTwitter, href: 'https://x.com' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/company/ai-mark-labs/' },
    // { name: 'YouTube', icon: FaYoutube, href: 'https://www.youtube.com' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  return (
    <footer
      className="bg-[#21213D] text-white"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">Stay Ahead with Social Media</h2>
          <h3 className="text-3xl italic text-white/90 mb-4">Trends & Insights</h3>
          <p className="text-white/80 text-base max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for expert tips, the latest updates, and strategies to grow your brand online.
          </p>
          
          {/* Subscription Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="flex-1 w-full sm:w-auto px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#F29335]"
              required
            />
            <button
              type="submit"
              className="bg-[#F29335] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#e0852a] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/20"></div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto] gap-10 lg:gap-16">
          {/* Left: Logo, Slogan, Contact, Social */}
          <div>
            <div className="mb-4">
              <Link to="/" onClick={handleInternalNavClick} aria-label="Go to home page">
                <img src="/images/logofooter.png" alt="AiMarkLabs Logo" className="h-12" />
              </Link>
            </div>
            <p className="text-white/70 text-sm mb-6">Amplify Your Brand Presence.</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Phone</p>
                <a href="tel:+18055382647" className="text-white text-sm font-medium">+1 (805) 538-2647</a>
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:sales@aimarklabs.com" className="text-white text-sm font-medium">sales@aimarklabs.com</a>
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
                <p className="text-white text-sm font-medium max-w-[220px]">AI Mark Labs, LLC 1110 N Virgil Ave PMB 98121 Los Angeles, CA 90029</p>
              </div>
            </div>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded border border-white/30 text-white hover:bg-white/10 transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {columnOneLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={handleInternalNavClick}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {columnTwoLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    onClick={handleInternalNavClick}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/20"></div>

      {/* Copyright Bottom */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-5">
        <p className="text-white/60 text-sm">© 2025 AlMarkLabs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
