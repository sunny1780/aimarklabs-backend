import React from 'react';

const Homefour: React.FC = () => {
  return (
    <section
      className="bg-[#F5F7FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Row 1: Text + Heading */}
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center mb-8">
          <p className="text-sm lg:text-base text-gray-600 max-w-md leading-relaxed">
            From strategy to execution, our numbers reflect the growth we create for our clients.
          </p>
          <div className="text-right lg:pr-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Proven Results
              <br />
              Real Impact
            </h2>
          </div>
        </div>

        {/* Row 2: Cards */}
        <div className="flex gap-6">
          {/* Experience */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Experience
            </div>
            <div className="text-[#F97316] text-[128px] font-extrabold leading-none mb-2">
              15y+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Delivering proven digital growth strategies.
            </p>
          </div>

          {/* Satisfied Clients */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Satisfied Clients
            </div>
            <div className="text-[#F97316] text-[128px] font-extrabold leading-none mb-2">
              195+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trusted by brands that value results.
            </p>
          </div>

          {/* Marketing Experts */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Marketing Experts
            </div>
            <div className="text-[#F97316] text-[128px] font-extrabold leading-none mb-2">
              75+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A team driven by strategy, creativity, and AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homefour;
