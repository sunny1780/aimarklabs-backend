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

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,420px)] items-center gap-12 lg:gap-16 xl:gap-20">
        {/* Left text block */}
        <div className="min-w-0 w-full text-left text-[#9CA9FF] order-1">
          <h2
            className="group flex flex-nowrap items-center gap-2 mb-3 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer text-[44px] sm:text-[78px] lg:text-[118px] xl:text-[135px] leading-[0.95]"
            onMouseEnter={() => setActiveService('marketing')}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
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
            className="group flex flex-nowrap items-center gap-2 mb-3 uppercase transition-colors duration-200 text-[#57609B] hover:text-[#C7CFFA] cursor-pointer text-[44px] sm:text-[78px] lg:text-[118px] xl:text-[135px] leading-[0.95]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
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
            className="group flex flex-nowrap items-center gap-2 mb-3 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer text-[44px] sm:text-[78px] lg:text-[118px] xl:text-[135px] leading-[0.95]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
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
            className="group flex flex-nowrap items-center gap-2 uppercase text-[#57609B] hover:text-[#C7CFFA] cursor-pointer text-[44px] sm:text-[78px] lg:text-[118px] xl:text-[135px] leading-[0.95]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
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
        <div className="relative w-full max-w-[380px] mx-auto lg:mx-0 lg:max-w-none flex justify-center lg:justify-end lg:translate-x-20 xl:translate-x-28 order-2">
          <div className="relative flex flex-col gap-2.5 rounded-[28px] p-4 sm:p-5 w-full lg:w-[315px] shrink-0 h-[405px]">
            {/* Top pill "Our Services" */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-[#272D55] text-xs font-semibold shadow-sm w-fit">
              Our Services
            </div>

            {/* Main image inside card */}
            <div className="flex-1 min-h-0 overflow-hidden rounded-[22px] border border-white/20 w-full">
              <img
                src={getServiceImage()}
                alt="Our services preview"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>

            {/* Caption text */}
            <p className="text-[11px] sm:text-xs text-[#C8D0FF] shrink-0">
              {'//'}Where creativity meets bold growth...
            </p>

            {/* Steric / star image bottom-right */}
            <img
              src="/images/steric.png"
              alt="Star accent"
              className="hidden sm:block absolute -bottom-24 sm:-bottom-28 right-8 sm:right-12 w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homethree;
