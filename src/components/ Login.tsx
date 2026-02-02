import React, { useState } from 'react';
import { ADMIN_EMAILS, ADMIN_PASSWORD, getUsers } from '../utils/auth';

interface LoginProps {
  onGoToSignUp?: () => void;
  onLoginSuccess?: (destination: string) => void;
}

const Login: React.FC<LoginProps> = ({ onGoToSignUp, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getUsers();
    if (ADMIN_EMAILS.includes(username)) {
      if (password !== ADMIN_PASSWORD) {
        setError('Invalid username or password.');
        return;
      }
      onLoginSuccess?.('/admin');
      return;
    }
    const user = users.find((record) => record.username === username);
    if (!user || user.password !== password) {
      setError('Invalid username or password.');
      return;
    }
    const destination = user.clientSlug
      ? `/admin/client/${user.clientSlug}`
      : '/dashboard';
    onLoginSuccess?.(destination);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <button
            type="button"
            onClick={onGoToSignUp}
            className="text-white text-sm font-medium hover:text-gray-200 transition"
          >
            Register
          </button>
        </div>
        
        {/* Login Form Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md px-8">
            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to AI Mark Labs
              </h2>
              <p className="text-gray-500 text-sm">
                Login to continue the app.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="******************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition pr-10"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : null}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#f39c12] text-white py-3 rounded-lg font-semibold hover:bg-[#e67e22] transition shadow-md"
              >
                Log In
              </button>

              {/* Forget Links */}
              <div className="flex justify-center items-center gap-3 text-sm pt-2">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition">
                  Forget Username
                </a>
                <span className="text-gray-400">Or</span>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition">
                  Forget Pin
                </a>
              </div>
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

export default Login;
