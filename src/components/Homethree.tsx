import React, { useState } from 'react';

type ServiceKey = 'marketing' | 'branding' | 'development' | 'uiux';

const Homethree: React.FC = () => {
  const [activeService, setActiveService] = useState<ServiceKey>('marketing');

  const getServiceImage = () => {
    switch (activeService) {
      case 'branding':
        return '/images/s3.png';
      case 'development':
        return '/images/s2.png';
      case 'uiux':
        return '/images/s4.png';
      case 'marketing':
      default:
        return '/images/s1.png';
    }
  };
  return (
    <section
      className="relative py-16 px-4 sm:px-6 lg:pl-10 lg:pr-24 xl:pr-32 overflow-hidden"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/CTA.png"
          alt="Services background"
          className="w-full h-full object-cover"
        />
        {/* Slight dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-[#050824]/60" />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,420px)] items-center gap-12 lg:gap-16 xl:gap-20">
        {/* Left text block */}
        <div className="min-w-0 text-left text-[#9CA9FF] order-1">
          <h2
            className="group inline-flex items-center gap-2 mb-3 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer"
            onMouseEnter={() => setActiveService('marketing')}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '160px',
              lineHeight: '100%',
              letterSpacing: 0,
              fontStyle: 'normal',
            }}
          >
            MARKETING
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-[#C7CFFA]">
              (01)
            </span>
          </h2>
          <h2
            className="group inline-flex items-center gap-2 mb-3 uppercase transition-colors duration-200 text-[#57609B] hover:text-[#C7CFFA] cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '160px',
              lineHeight: '100%',
              letterSpacing: 0,
              fontStyle: 'normal',
            }}
            onMouseEnter={() => setActiveService('branding')}
          >
            BRANDING
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-[#C7CFFA]">
              (02)
            </span>
          </h2>
          <h2
            className="group inline-flex items-center gap-2 mb-3 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '160px',
              lineHeight: '100%',
              letterSpacing: 0,
              fontStyle: 'normal',
            }}
            onMouseEnter={() => setActiveService('development')}
          >
            Development
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-[#C7CFFA]">
              (03)
            </span>
          </h2>
          <h2
            className="group inline-flex items-center gap-2 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '160px',
              lineHeight: '100%',
              letterSpacing: 0,
              fontStyle: 'normal',
            }}
            onMouseEnter={() => setActiveService('uiux')}
          >
            Creative
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-[#C7CFFA]">
              (04)
            </span>
          </h2>
        </div>

        {/* Right card block */}
        <div className="relative w-full max-w-[380px] mx-auto lg:mx-0 lg:max-w-none flex justify-center lg:justify-end lg:translate-x-10 xl:translate-x-16 order-2">
          <div className="relative rounded-[28px] p-4 sm:p-5 w-full lg:w-[340px] xl:w-[380px] shrink-0">
            {/* Top pill "Our Services" */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-[#272D55] text-xs font-semibold mb-3 shadow-sm">
              Our Services
            </div>

            {/* Main image inside card */}
            <div className="overflow-hidden rounded-[22px] border border-white/20 mb-3 w-full">
              <img
                src={getServiceImage()}
                alt="Our services preview"
                className="w-full h-[320px] sm:h-[360px] xl:h-[400px] object-cover transition-transform duration-500"
              />
            </div>

            {/* Caption text */}
            <p className="text-[11px] sm:text-xs text-[#C8D0FF] mt-1">
              {'//'}Where creativity meets bold growth...
            </p>

            {/* Steric / star image bottom-right */}
            <img
              src="/images/steric.png"
              alt="Star accent"
              className="absolute -bottom-32 right-24 w-24 h-24 sm:w-20 sm:h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homethree;
