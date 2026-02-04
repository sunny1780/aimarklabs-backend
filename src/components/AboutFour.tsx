import React from 'react';

const AboutFour: React.FC = () => {
  const content =
    'we believe that every challenge hides a chance to grow stronger. Our mission is to transform complex business problems into strategic advantages through innovation, insight, and intelligent execution.';

  return (
    <>
      <section
        className="py-16 px-4 sm:px-6 lg:px-10 bg-white"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Our Mission */}
            <div className="about-four-block">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <div className="relative pt-4">
                <div className="about-four-card bg-[#F7F9FB] border border-[#F29335]/50 rounded-lg p-6 pr-8 pt-12">
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                    {content}
                  </p>
                </div>
                <div className="about-four-badge absolute -top-2 -right-2 w-12 h-12 bg-[#F29335] rounded-lg flex items-center justify-center shadow-md p-2">
                  <img src="/images/comma.svg" alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <div className="about-four-block pt-40">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <div className="relative pt-4">
                <div className="about-four-card bg-[#F7F9FB] border border-[#F29335]/50 rounded-lg p-6 pr-8 pt-12">
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                    {content}
                  </p>
                </div>
                <div className="about-four-badge absolute -top-2 -right-2 w-12 h-12 bg-[#F29335] rounded-lg flex items-center justify-center shadow-md p-2">
                  <img src="/images/comma.svg" alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local styles for professional motion on mission/vision cards */}
      <style>
        {`
          .about-four-block {
            opacity: 0;
            transform: translateY(18px);
            animation: aboutFourFadeUp 0.7s ease-out forwards;
          }

          .about-four-block:nth-of-type(2) {
            animation-delay: 0.12s;
          }

          .about-four-card {
            position: relative;
            overflow: hidden;
            transition:
              transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
              box-shadow 0.35s ease-out,
              border-color 0.35s ease-out,
              background-color 0.35s ease-out;
          }

          .about-four-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 0% 0%, rgba(242, 147, 53, 0.14), transparent 55%);
            opacity: 0;
            transform: translate3d(-12px, -8px, 0);
            transition:
              opacity 0.35s ease-out,
              transform 0.35s ease-out;
            pointer-events: none;
          }

          .about-four-block:hover .about-four-card {
            transform: translateY(-6px);
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.14);
            border-color: rgba(242, 147, 53, 0.7);
            background-color: #f8fafc;
          }

          .about-four-block:hover .about-four-card::before {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }

          .about-four-badge {
            transform-origin: center center;
            transition:
              transform 0.35s ease-out,
              box-shadow 0.35s ease-out;
          }

          .about-four-block:hover .about-four-badge {
            transform: translateY(-4px) rotate(-3deg);
            box-shadow: 0 18px 40px rgba(242, 147, 53, 0.35);
          }

          @keyframes aboutFourFadeUp {
            0% {
              opacity: 0;
              transform: translateY(24px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default AboutFour;
