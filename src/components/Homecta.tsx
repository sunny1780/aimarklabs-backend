import React from 'react';

const Homecta: React.FC = () => {
  return (
    <section
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-4"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#272D55] rounded-[40px] p-8 lg:p-10 relative overflow-hidden">
          {/* Arrow Image */}
          <div className="absolute right-20 bottom-8 hidden lg:block">
            <img
              src="/images/Arrow.png"
              alt="Arrow"
              className="w-24 h-24 object-contain opacity-80"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 
              className="mb-6 uppercase"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: '70px',
                lineHeight: '104.68px',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#F29335'
              }}
            >
              **READY TO BOOST
            </h2>
            <h3 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-6">
              YOUR DIGITAL BUSINESS{' '}
              <span className="underline">GROWTH</span>
            </h3>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              <strong>Grow your business</strong> online with smart strategies. Let's take your brand to the next level!
            </p>
            <div className="flex justify-center">
              <button className="bg-[#F29335] text-black px-8 py-4 rounded-lg font-semibold text-base hover:bg-[#e0852a] transition-colors">
                Book a Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homecta;
