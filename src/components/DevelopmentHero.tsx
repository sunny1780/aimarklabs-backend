import React from 'react';
import LetterGlitch from './LetterGlitch';

const DevelopmentHero: React.FC = () => {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[calc(100vh-80px)] overflow-hidden">
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
        glitchColors={['#0f172a', '#1e3a5f', '#38bdf8', '#22d3ee']}
      />

      <div className="absolute inset-0 bg-[#040912]/65 z-[1]" />

      <div className="relative z-10 mx-auto flex min-h-[75vh] sm:min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-[8px] border border-[#D7DDFC] bg-[#D7DDFC] px-5 py-2 text-[14px] font-medium text-[#272D55]">
            Development
          </span>

          <h1 className="mt-6 text-white text-4xl sm:text-6xl lg:text-[60px] leading-[0.95] font-semibold">
            Solutions That
            <br />
            Perform
          </h1>

          <a
            href="/contact"
            className="mt-8 inline-flex items-center rounded-lg bg-[#F29335] px-6 sm:px-7 py-3 text-white text-[14px] sm:text-[16px] font-medium hover:bg-[#e7862b] transition-colors"
          >
            Launch Your Digital Platform
          </a>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentHero;
