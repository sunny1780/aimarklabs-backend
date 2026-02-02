import React from 'react';

const AboutFour: React.FC = () => {
  const content =
    'we believe that every challenge hides a chance to grow stronger. Our mission is to transform complex business problems into strategic advantages through innovation, insight, and intelligent execution.';

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-10 bg-white"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Our Mission */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <div className="relative pt-4">
              <div className="bg-[#F7F9FB] border border-[#F29335]/50 rounded-lg p-6 pr-8 pt-12">
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                  {content}
                </p>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#F29335] rounded-lg flex items-center justify-center shadow-md p-2">
                <img src="/images/comma.svg" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className='pt-40'>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <div className="relative pt-4">
              <div className="bg-[#F7F9FB] border border-[#F29335]/50 rounded-lg p-6 pr-8 pt-12">
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                  {content}
                </p>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#F29335] rounded-lg flex items-center justify-center shadow-md p-2">
                <img src="/images/comma.svg" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFour;
