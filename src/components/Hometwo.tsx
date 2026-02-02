import React from 'react';

const Hometwo: React.FC = () => {
  return (
    <section
      className="bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header pill */}
        <div className="mb-8">
          <span
            className="inline-flex items-center px-5 py-3 rounded-md text-[16ox] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] shadow-sm border border-[#B3BDEF]"
          >
            Why choose us
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left Side - Text + Map */}
          <div className="relative">
            <h2 className="text-[48px] lg:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
              We Create Marketing That
              <br />
              Works
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              We partner with brands to solve real challenges using AI-powered strategies, creative design, and performance-focused marketing.
            </p>

            {/* Map with overlay avatars */}
            <div className="relative max-w-xl">
              <img
                src="/images/map.png"
                alt="World Map"
                className="w-full h-auto opacity-60"
              />

              {/* Chat Bubbles Overlay */}
              <img
                src="/images/chat bubbles.png"
                alt="Chat Bubbles"
                className="absolute inset-0 w-full h-full object-contain opacity-100 pointer-events-none"
              />
            </div>
          </div>

          {/* Right Side - Divider + Feature Cards */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-12 flex flex-col gap-6">
            {/* AI-Powered Strategy */}
            <div className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[462px] min-h-[176px]">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="AI Strategy Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    AI-Powered Strategy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Data-driven insights and intelligent planning that help your brand grow faster and smarter.
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Excellence */}
            <div className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[462px] min-h-[176px] lg:ml-10">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="Creative Excellence Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    Creative Excellence
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    High-impact branding, design, and digital experiences built to engage and convert.
                  </p>
                </div>
              </div>
            </div>

            {/* Proven Results */}
            <div className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[462px] min-h-[176px] lg:ml-3">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="Proven Results Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    Proven Results
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Measurable outcomes backed by analytics, optimization, and continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hometwo;