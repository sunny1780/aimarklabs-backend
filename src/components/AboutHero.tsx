import React from 'react';

const AboutHero: React.FC = () => {
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

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
          <span className="block">
            Your Growth,
            <span className="inline-flex items-center ml-2 align-middle">
              <img src="/images/icons.png" alt="" className="w-20 h-14 sm:w-24 sm:h-16 lg:w-28 lg:h-20 object-contain" />
            </span>
          </span>
          <span className="block mt-2 inline-flex items-center justify-center gap-2">
            <img
              src="/images/people.png"
              alt=""
              className="w-auto h-auto max-w-full rounded-2xl flex-shrink-0 align-middle"
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
        <button className="bg-[#F29335] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#e0852a] transition-colors inline-flex items-center gap-2">
          Lets Talk
          <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default AboutHero;
