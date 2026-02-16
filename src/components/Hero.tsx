import React from 'react';
import SharedVideo from './SharedVideo';

interface HeroProps {
  nextInView: boolean;
}

const Hero: React.FC<HeroProps> = ({ nextInView }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#ffe4e6] to-[#fef9c3] min-h-[360px] sm:min-h-[500px] flex items-center">
      {/* Corner video */}
      {!nextInView && (
        <SharedVideo
          src="/images/video.mp4"
          layoutId="home-shared-video"
          className="absolute bottom-4 right-3 sm:bottom-0 sm:right-0 z-20 w-[220px] h-[140px] sm:w-64 sm:h-40"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 w-full relative py-10 sm:py-0">
        {/* Big background text - absolutely centered */}
        <h1 className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[90px] lg:text-[160px] xl:text-[200px] leading-none font-bold text-[#d4d4d8] tracking-tight select-none z-0">
          AlMarkLabs
        </h1>

        {/* Main layout */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between min-h-[320px] sm:min-h-[360px] z-10 pt-8 sm:pt-0">
          <div className="sm:hidden mb-4">
            <h1 className="text-3xl font-extrabold text-[#272D55] leading-tight">
              AI Mark Labs
            </h1>
            <p className="text-sm text-gray-700 mt-1">
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
            <div className="mt-2 sm:-mt-[112px] sm:mr-24 text-left space-y-1 text-[15px] sm:text-[16px] text-gray-700 pr-[210px] sm:pr-0">
              <div>
                <p>ui/ux design</p>
                <img src="/images/Line.png" alt="line" className="hero-float-1 mt-1" />
              </div>
              <div>
                <p>digital marketing</p>
                <img src="/images/Line.png" alt="line" className="hero-float-2 mt-1" />
              </div>
              <div>
                <p>web development</p>
                <img src="/images/Line.png" alt="line" className="hero-float-3 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
