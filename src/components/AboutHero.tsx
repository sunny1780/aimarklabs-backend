import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <>
      <section
        className="relative min-h-[95vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/AboutHero.png"
            alt=""
            className="w-full h-full object-cover about-hero-bg"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center about-hero-content">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
            <span className="block">
              Your Growth,
              <span className="inline-flex items-center ml-2 align-middle about-hero-icon">
                <img
                  src="/images/icons.png"
                  alt=""
                  className="w-20 h-14 sm:w-24 sm:h-16 lg:w-28 lg:h-20 object-contain"
                />
              </span>
            </span>
            <span className="block mt-2 inline-flex items-center justify-center gap-2 about-hero-row">
              <img
                src="/images/people.png"
                alt=""
                className="w-auto h-auto max-w-full rounded-2xl flex-shrink-0 align-middle about-hero-people"
              />
              <span>Our</span>
              <span>Strategy.</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            We help businesses build powerful online identities through tailored strategies, creative content, and data-driven campaigns.
          </p>

          {/* CTA Button */}
          <button className="relative bg-[#F29335] text-white font-semibold px-8 py-4 rounded-lg inline-flex items-center gap-2 overflow-hidden group">
            <span className="relative z-10">Lets Talk</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            {/* Button shine */}
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute -inset-y-1 -left-10 w-20 rotate-12 bg-white/40 blur-md group-hover:translate-x-[220%] transition-transform duration-700" />
            </span>
          </button>
        </div>
      </section>

      {/* Local styles for subtle professional animation */}
      <style>
        {`
          .about-hero-bg {
            transform-origin: center;
            animation: aboutHeroBgPan 28s ease-in-out infinite alternate;
          }

          .about-hero-content {
            opacity: 0;
            transform: translateY(20px);
            animation: aboutHeroFadeUp 0.9s ease-out 0.3s forwards;
          }

          .about-hero-icon {
            animation: aboutHeroFloat 6s ease-in-out infinite;
          }

          .about-hero-people {
            box-shadow: 0 25px 50px rgba(15, 23, 42, 0.18);
            animation: aboutHeroFloat 7s ease-in-out infinite;
          }

          .about-hero-row span {
            animation: aboutHeroFadeInWords 0.9s ease-out 0.5s forwards;
            opacity: 0;
          }

          .about-hero-row span:nth-child(2) {
            animation-delay: 0.6s;
          }

          .about-hero-row span:nth-child(3) {
            animation-delay: 0.7s;
          }

          @keyframes aboutHeroBgPan {
            0% {
              transform: scale(1.02) translate3d(-8px, 0, 0);
              filter: brightness(1);
            }
            50% {
              transform: scale(1.05) translate3d(0, -6px, 0);
              filter: brightness(1.02);
            }
            100% {
              transform: scale(1.02) translate3d(8px, 0, 0);
              filter: brightness(1);
            }
          }

          @keyframes aboutHeroFadeUp {
            0% {
              opacity: 0;
              transform: translateY(24px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes aboutHeroFloat {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes aboutHeroFadeInWords {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default AboutHero;
