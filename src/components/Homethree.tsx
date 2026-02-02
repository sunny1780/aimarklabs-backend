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
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#5C6ACF] mb-6">
            (01)
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 text-[#C0C8FF] uppercase">
            MARKETING
          </h2>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 uppercase transition-colors duration-200 text-[#F2F3FF] hover:text-[#FFC857] cursor-pointer">
            BRANDING
          </h2>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 uppercase text-[#8B97E8]">
            Development
          </h2>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight uppercase text-[#6E7AD8]">
            UI/UX Design
          </h2>
          <div className="mt-6 space-y-2 text-[11px] sm:text-xs tracking-[0.3em] text-[#5C6ACF]">
            <p>(02)</p>
            <p>(03)</p>
            <p>(04)</p>
          </div>
        </div>

        {/* Right card block */}
        <div className="relative flex-1 flex justify-center lg:justify-end">
          <div className="relative bg-[#0D1430]/80 rounded-[28px] p-4 sm:p-5 w-full max-w-xs sm:max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            {/* Top pill "Our Services" */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-[#272D55] text-xs font-semibold mb-3 shadow-sm">
              Our Services
            </div>

            {/* Main image inside card */}
            <div className="overflow-hidden rounded-[22px] border border-white/20 mb-3">
              <img
                src="/images/CTA.png"
                alt="Our services preview"
                className="w-full h-56 object-cover"
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
              className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homethree;

