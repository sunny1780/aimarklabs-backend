import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
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

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
          <span className="block">
            Your Growth,
            <span className="inline-flex items-center gap-1 ml-2 align-middle">
              <span className="inline-flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F29335] items-center justify-center -ml-1 p-1.5">
                <img src="/images/star.png" alt="" className="w-full h-full object-contain invert" />
              </span>
              <span className="inline-flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#272D55] items-center justify-center -ml-2 p-1.5">
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-11.8l112-192c10.4-17.8-1.2-40.7-21.7-40.7z" />
                </svg>
              </span>
            </span>
          </span>
          <span className="block mt-2">
            <span className="relative inline-block px-2">
              <img
                src="/images/people.png"
                alt=""
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-12 sm:h-14 w-[180px] sm:w-[220px] object-cover object-center rounded-2xl opacity-95"
              />
              Our
            </span>{' '}
            Strategy.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          We help businesses build powerful online identities through tailored strategies, creative content, and data-driven campaigns.
        </p>

        {/* CTA Button */}
        <button className="bg-[#F29335] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#e0852a] transition-colors inline-flex items-center gap-2">
          Lets Talk
          <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default AboutHero;
