import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <>
      <section
        className="relative min-h-[70vh] sm:min-h-[95vh] flex items-center justify-center py-14 sm:py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
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

        <div className="relative z-10 max-w-5xl mx-auto text-center about-hero-content px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1
            className="w-full max-w-[900px] mx-auto text-center text-[40px] sm:text-[56px] md:text-[72px] xl:text-[80px] font-bold text-gray-900 leading-[1] tracking-[0.005em] mb-5 sm:mb-6"
            style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
          >
            <span className="block">
              Your Growth,
              <span className="inline-flex items-center ml-2 align-middle about-hero-icon">
                <img
                  src="/images/icons.png"
                  alt=""
                  className="w-12 h-10 sm:w-24 sm:h-16 lg:w-28 lg:h-20 object-contain"
                />
              </span>
            </span>
            <span className="block mt-2 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 about-hero-row">
              <img
                src="/images/venga.png"
                alt=""
                className="h-auto w-auto max-w-full flex-shrink-0 align-middle rounded-xl about-hero-people"
              />
              <span className="whitespace-nowrap">Our Strategy.</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto mb-7 sm:mb-8 leading-relaxed">
          At AIMarkLabs, growth isn’t accidental; it’s engineered.? By combining artificial intelligence, deep market insight, and creative execution, we help brands scale with precision, clarity, and measurable impact.
          </p>

          {/* CTA Button */}
          <button className="relative bg-[#F29335] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg inline-flex items-center gap-2 overflow-hidden group">
            <span className="relative z-10">Lets Talk</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 inline-flex items-center shrink-0">
              <img src="/images/iconsarow.svg" alt="" className="w-5 h-5" />
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
            display: block;
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
