import React, { useState, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { buildApiUrl } from '../utils/api';

interface ContactusProps {
  onLoginClick: () => void;
}

const Contactus: React.FC<ContactusProps> = ({ onLoginClick }) => {
  const availableServices = [
    'Digital Marketing',
    'Branding',
    'Remote IT Resources',
    'Custom Software Development',
    'Web Development',
    'Mobile App Development',
    'Other IT Services',
  ];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [region, setRegion] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState('');
  const [textareaHeight, setTextareaHeight] = useState(120);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(120);

  const handleResizeStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = textareaHeight;
    const moveHandler = (moveEvent: TouchEvent | MouseEvent) => {
      const y = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const diff = y - startY.current;
      setTextareaHeight(Math.max(100, Math.min(400, startHeight.current + diff)));
    };
    const upHandler = () => {
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
    document.addEventListener('touchmove', moveHandler, { passive: true });
    document.addEventListener('touchend', upHandler);
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }, [textareaHeight]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleServiceChange = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!fullName || !email || !phoneNumber || !region || !projectDetails || services.length === 0) {
      setSubmitMessage('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(buildApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          companyName,
          companyUrl,
          region,
          services,
          projectDetails,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Contact submission failed.');
      }

      setSubmitMessage('Thanks! Your request has been submitted.');
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setCompanyName('');
      setCompanyUrl('');
      setRegion('');
      setServices([]);
      setProjectDetails('');
    } catch (error: any) {
      if (error instanceof TypeError) {
        setSubmitMessage('Unable to reach server. Please try again in a moment.');
        return;
      }
      setSubmitMessage(error?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Navbar onLoginClick={onLoginClick} />

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12  rounded-3xl p-6 sm:p-10">
          {/* Left content */}
          <div className="space-y-6">
            <button className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] border border-[#B3BDEF]">
              Get in Touch
            </button>

            <h1
              className="text-gray-900 max-w-[544px] text-[48px] leading-[100%] tracking-[0.005em] font-medium font-manrope"
            >
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
          <form className="space-y-5 bg-[#FBFCFD] p-6 sm:p-8 shadow-sm" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Company URL</label>
              <input
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335]"
              />
            </div>

            {/* Services checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Services you are looking for <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {availableServices.map((service) => (
                  <label key={service} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={services.includes(service)}
                      onChange={() => handleServiceChange(service)}
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
              <div className="relative">
                <textarea
                  rows={4}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F29335] focus:border-[#F29335] resize-none"
                  style={{ minHeight: textareaHeight, height: textareaHeight }}
                />
                <div
                  ref={resizeRef}
                  onTouchStart={handleResizeStart}
                  onMouseDown={handleResizeStart}
                  className="absolute bottom-2 right-2 p-2 -m-2 flex cursor-se-resize touch-none gap-1 opacity-70 hover:opacity-100 active:opacity-100 items-end"
                  aria-label="Resize"
                >
                  <span className="block h-4 w-px bg-gray-600 rounded rotate-45 origin-bottom" />
                  <span className="block h-2.5 w-px bg-gray-600 rounded rotate-45 origin-bottom" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              {submitMessage ? (
                <p className="text-sm text-gray-600 mr-3 self-center">{submitMessage}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#F29335] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#e0852a] transition-colors text-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
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
