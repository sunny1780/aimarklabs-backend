import React from 'react';

const IndustryHero: React.FC = () => {
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
            className="w-full h-full object-cover industry-hero-bg"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center text-center">
          <h1
            className="industry-hero-heading text-[#272D55] uppercase"
            style={{
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(48px, 12vw, 198px)',
              lineHeight: '100%',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="industry-hero-letter">I</span>
            <span className="industry-hero-letter">N</span>
            <span className="industry-hero-letter">D</span>
            <span className="industry-hero-letter">U</span>
            <span className="industry-hero-letter">S</span>
            <span className="industry-hero-letter">T</span>
            <span className="industry-hero-letter">R</span>
            <span className="industry-hero-letter">I</span>
            <span className="industry-hero-letter">E</span>
            <span className="industry-hero-letter">S</span>
          </h1>
        </div>
      </section>

      {/* Local styles for professional INDUSTRIES animation */}
      <style>
        {`
          .industry-hero-bg {
            transform-origin: center;
            animation: industryHeroBgPan 26s ease-in-out infinite alternate;
          }

          .industry-hero-heading {
            display: inline-flex;
            gap: 0.02em;
          }

          .industry-hero-letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(22px);
            animation: industryHeroLetterIn 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .industry-hero-letter:nth-child(1) { animation-delay: 0.05s; }
          .industry-hero-letter:nth-child(2) { animation-delay: 0.08s; }
          .industry-hero-letter:nth-child(3) { animation-delay: 0.11s; }
          .industry-hero-letter:nth-child(4) { animation-delay: 0.14s; }
          .industry-hero-letter:nth-child(5) { animation-delay: 0.17s; }
          .industry-hero-letter:nth-child(6) { animation-delay: 0.20s; }
          .industry-hero-letter:nth-child(7) { animation-delay: 0.23s; }
          .industry-hero-letter:nth-child(8) { animation-delay: 0.26s; }
          .industry-hero-letter:nth-child(9) { animation-delay: 0.29s; }
          .industry-hero-letter:nth-child(10) { animation-delay: 0.32s; }

          @keyframes industryHeroBgPan {
            0% {
              transform: scale(1.03) translate3d(-10px, 0, 0);
            }
            50% {
              transform: scale(1.06) translate3d(0, -8px, 0);
            }
            100% {
              transform: scale(1.03) translate3d(10px, 0, 0);
            }
          }

          @keyframes industryHeroLetterIn {
            0% {
              opacity: 0;
              transform: translateY(26px);
            }
            60% {
              opacity: 1;
              transform: translateY(-4px);
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

export default IndustryHero;
