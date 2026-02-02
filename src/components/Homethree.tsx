import React from 'react';

const Homethree: React.FC = () => {
  return (
    <section
      className="relative py-16 px-4 sm:px-6 lg:px-10 overflow-hidden"
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

      <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10">
        {/* Left text block */}
        <div className="flex-1 text-left text-[#9CA9FF]">
          <h2
            className="group inline-flex items-baseline gap-2 mb-3 uppercase text-[#57609B] hover:text-white"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '150px',
              lineHeight: '100%',
            }}
          >
            MARKETING
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-white">
              (01)
            </span>
          </h2>
          <h2
            className="group inline-flex items-baseline gap-2 mb-3 uppercase transition-colors duration-200 text-[#57609B] hover:text-white cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '150px',
              lineHeight: '100%',
            }}
          >
            BRANDING
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-white">
              (02)
            </span>
          </h2>
          <h2
            className="group inline-flex items-baseline gap-2 mb-3 uppercase text-[#57609B] hover:text-white"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '150px',
              lineHeight: '100%',
            }}
          >
            Development
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-white">
              (03)
            </span>
          </h2>
          <h2
            className="group inline-flex items-baseline gap-2 uppercase text-[#57609B] hover:text-white"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: '150px',
              lineHeight: '100%',
            }}
          >
            UI/UX Design
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#57609B] group-hover:text-white">
              (04)
            </span>
          </h2>
        </div>

        {/* Right card block */}
        <div className="relative flex-1 flex justify-center lg:justify-end">
          <div className="relative rounded-[28px] p-4 sm:p-5 w-full max-w-xs sm:max-w-sm">
            {/* Top pill "Our Services" */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-[#272D55] text-xs font-semibold mb-3 shadow-sm">
              Our Services
            </div>

            {/* Main image inside card */}
            <div className="overflow-hidden rounded-[22px] border border-white/20 mb-3">
              <img
                src="/images/CTA.png"
                alt="Our services preview"
                className="w-full h-80 object-cover"
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

