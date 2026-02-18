import React from 'react';
import SharedVideo from './SharedVideo';

interface HeroProps {
  nextInView: boolean;
}

const Hero: React.FC<HeroProps> = ({ nextInView }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#ffe4e6] to-[#fef9c3] min-h-[87vh] flex items-center">
      {/* Corner video */}
      {!nextInView && (
        <SharedVideo
          src="/images/video.mp4"
          layoutId="home-shared-video"
          className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 md:bottom-0 md:right-0 z-20 w-[180px] h-[110px] sm:w-[220px] sm:h-[140px] md:w-64 md:h-40"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full relative py-8 sm:py-12 lg:py-0">
        {/* Big background text - absolutely centered */}
        <h1 className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[90px] md:text-[120px] lg:text-[160px] xl:text-[200px] leading-none font-bold text-[#d4d4d8] tracking-tight select-none z-0">
          AlMarkLabs
        </h1>

        {/* Main layout */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between min-h-[280px] sm:min-h-0 z-10 pt-6 sm:pt-0">
          <div className="sm:hidden mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#272D55] leading-tight">
              AI Mark Labs
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              Creative marketing and development that drives growth.
            </p>
          </div>
          {/* Left side - image badges */}
          <div className="relative flex-1 min-h-[120px] sm:min-h-0">
            {/* Left star image */}
            <img
              src="/images/star.png"
              alt="star shape"
              className="hidden lg:block hero-float-1 absolute -left-28 -top-32 w-36 h-36 object-contain"
            />

            {/* Floating Aa image */}
            <img
              src="/images/Aa.png"
              alt="Aa card"
              className="hidden lg:block hero-float-2 absolute -top-16 left-[300px] w-24 h-auto object-contain"
            />

            {/* Bottom left Full-Stack pill image */}
            <img
              src="/images/fullstack.png"
              alt="Full Stack badge"
              className="hidden lg:block hero-float-3 absolute -bottom-36 left-40 w-28 h-auto object-contain"
            />

            {/* Bottom right Agencies pill image */}
            <img
              src="/images/agencies.png"
              alt="Agencies badge"
              className="hidden lg:block hero-float-2 absolute -bottom-40 -right-[320px] w-28 h-auto object-contain"
            />
          </div>

          {/* Right side - services list */}
          <div className="flex-1 flex justify-start sm:justify-end w-full">
            <div className="-mt-4 sm:-mt-[104px] md:-mt-[136px] sm:mr-12 md:mr-24 text-left space-y-1 text-[14px] sm:text-[15px] md:text-[16px] text-gray-700 pr-[160px] sm:pr-0">
              <div>
                <p>ui/ux design</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
              <div>
                <p>digital marketing</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
              <div>
                <p>web development</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
