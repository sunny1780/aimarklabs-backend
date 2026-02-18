import React, { useMemo, useState } from 'react';
import {
  getClients,
  getUsers,
  pickAccent,
  saveClients,
  saveUsers,
  slugify,
} from '../utils/auth';

interface SignUpProps {
  onGoToLogin?: () => void;
  onSignUpSuccess?: (destination: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onGoToLogin, onSignUpSuccess }) => {
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientSlug, setClientSlug] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const resolvedSlug = useMemo(() => {
    const base = clientSlug || companyName || username;
    return base ? slugify(base) : '';
  }, [clientSlug, companyName, username]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!resolvedSlug) {
      setError('Company name or client slug is required for clients.');
      return;
    }

    const users = getUsers();
    const existing = users.find((record) => record.username === username);
    if (existing) {
      setError('This user already exists.');
      return;
    }

    const newUser = {
      username,
      password,
      role: 'client' as const,
      clientSlug: resolvedSlug,
      companyName: companyName || username,
    };
    saveUsers([...users, newUser]);

    const clients = getClients();
    const exists = clients.some((client) => client.slug === resolvedSlug);
    if (!exists) {
      const name = companyName || username;
      const accent = pickAccent(clients.length);
      saveClients([...clients, { name, slug: resolvedSlug, accent }]);
    }

    const destination = `/admin/client/${resolvedSlug}`;
    onSignUpSuccess?.(destination);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Transform your brand&apos;s digital presence with intelligent marketing automation.
            We combine AI-driven insights with creative strategy to deliver measurable growth
            for your business in every channel.
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
            onClick={onGoToLogin}
            className="text-white text-sm font-medium hover:text-gray-200 transition"
          >
            Login
          </button>
        </div>
        
        {/* SignUp Form Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md px-8">
            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Al Mark Labs
              </h2>
              <p className="text-gray-500 text-sm">
                Login to continue the app.
              </p>
            </div>

            {/* SignUp Form */}
            <form onSubmit={handleSignUp} className="space-y-5">
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

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="AI Mark Labs"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Client Slug
                </label>
                <input
                  type="text"
                  placeholder="ai-mark-labs"
                  value={clientSlug}
                  onChange={(e) => setClientSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Suggested: {resolvedSlug || 'your-company'}
                </p>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="*************"
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

              {/* Confirmed Password Field */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirmed Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="*************"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f39c12] focus:border-transparent transition pr-10"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? (
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
{/* gd */}
              {error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : null}

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full bg-[#f39c12] text-white py-3 rounded-lg font-semibold hover:bg-[#e67e22] transition shadow-md"
              >
                Create Account
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

export default SignUp;
