import React from 'react';

const IndustryHero: React.FC = () => {
  return (
    <section
      className="relative min-h-[95vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/AboutHero.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center text-center">
        <h1
          className="text-[#272D55] uppercase"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(48px, 12vw, 198px)',
            lineHeight: '100%',
            letterSpacing: '-0.02em',
          }}
        >
          Industries
        </h1>
      </div>
    </section>
  );
};

export default IndustryHero;
