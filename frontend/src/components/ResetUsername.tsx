import React, { useState } from 'react';

const ResetUsername = () => {
  const [newUsername, setNewUsername] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset username:', { newUsername, confirmUsername });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Dark Blue Section */}
      <div className="relative w-1/2 bg-[#1e2749] flex items-center justify-center overflow-hidden">
        {/* Background Decorative Logos */}
        <img 
          src="/images/LtLogo.png" 
          alt="Left Top Decoration" 
          className="absolute top-0 left-0 opacity-70"
        />
        <img 
          src="/images/RtLogo.png" 
          alt="Right Top Decoration" 
          className="absolute top-0 right-0 opacity-60"
        />
        <img 
          src="/images/RbLogo.png" 
          alt="Right Bottom Decoration" 
          className="absolute bottom-0 right-0 opacity-60"
        />
        
        {/* Main Content - Centered */}
        <div className="relative z-10 text-center px-16 max-w-xl">
          <h1 className="text-white text-5xl font-bold leading-tight mb-4">
            Digital Marketing
          </h1>
          <h2 className="text-[#f39c12] text-5xl font-bold mb-12">
            Agency
          </h2>
        </div>

        {/* Bottom Content - Paragraph and Pagination Dots */}
        <div className="absolute bottom-20 left-0 right-0 px-16 max-w-xl mx-auto">
          <p className="text-gray-300 text-sm leading-relaxed mb-6 text-justify">
            Pellentibus est feugiat sed ut dui eget eget. Arcu arnet tempor tristique nunc lacus 
            ullamcorper denean denean. Id nisl est consectetur et. Eu viverra dignissim sit 
            posuere. Urna lectus viverra pretium aliquam morbi ut egestas elit consequat. 
            Odio laoreet cursus consectetur platea interdum nullam.
          </p>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-16 h-1 bg-[#f39c12] rounded-full"></div>
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - White Section */}
      <div className="relative w-1/2 bg-white">
        {/* Top Row - Logo and Register Button - Bilkul top par */}
        <div className="flex items-center justify-between bg-[#1e2749] w-full px-8 py-4">
          <img 
            src="/images/logo.png" 
            alt="AI Mark Labs Logo" 
            className="w-35 h-10"
          />
          <button className="text-white text-sm font-medium hover:text-gray-200 transition">
            Register
          </button>
        </div>
        
        {/* Reset Username Form Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md px-8">
            {/* Header Text */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Reset your Username
              </h2>
              <p className="text-gray-500 text-sm">
                Please set a new Username for your account.
              </p>
            </div>

            {/* Reset Username Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Username Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition"
                />
              </div>

              {/* Confirm Username Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm new Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={confirmUsername}
                  onChange={(e) => setConfirmUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition"
                />
              </div>

              {/* Set Username Button */}
              <button
                type="submit"
                className="w-full bg-[#f39c12] text-white py-3 rounded-lg font-semibold hover:bg-[#e67e22] transition shadow-md"
              >
                Set Username
              </button>
            </form>

            {/* Footer Text */}
            <p className="text-center text-xs text-gray-500 mt-10">
              By using <span className="font-semibold text-gray-700">AI Mark Labs</span>, you agree to our terms and policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetUsername;