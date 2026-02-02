import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  return (
    <footer
      className="bg-[#272D55] text-white"
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
              className="bg-[#F29335] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#e0852a] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-600"></div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Copyright */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src="/images/logofooter.png" alt="AiMarkLabs Logo" className="h-14" />
            </div>
            <p className="text-white/80 text-sm mb-2">Amplify Your Brand Presence.</p>
            <p className="text-white/60 text-xs">© 2025 AiMarkLabs. All rights reserved.</p>
          </div>

          {/* Column One Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Column One</h4>
            <ul className="space-y-2">
              {['Link One', 'Link Two', 'Link Three', 'Link Four', 'Link Five'].map((link, index) => (
                <li key={index}>
                  <a href="/" className="text-white/80 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column Two Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Column Two</h4>
            <ul className="space-y-2">
              {['Link Six', 'Link Seven', 'Link Eight', 'Link Nine', 'Link Ten'].map((link, index) => (
                <li key={index}>
                  <a href="/" className="text-white/80 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us / Social Media */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <ul className="space-y-3">
              {[
                { name: 'Facebook', icon: FaFacebook },
                { name: 'Instagram', icon: FaInstagram },
                { name: 'X', icon: FaXTwitter },
                { name: 'LinkedIn', icon: FaLinkedin },
                { name: 'YouTube', icon: FaYoutube }
              ].map((social, index) => {
                const IconComponent = social.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                return (
                  <li key={index}>
                    <a href="/" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                      <IconComponent className="w-5 h-5 text-white" />
                      <span>{social.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
