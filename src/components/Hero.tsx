import React from 'react';
import SharedVideo from './SharedVideo';

interface HeroProps {
  nextInView: boolean;
}

const Hero: React.FC<HeroProps> = ({ nextInView }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#ffe4e6] to-[#fef9c3] min-h-[500px] flex items-center">
      {/* Corner video */}
      {!nextInView && (
        <SharedVideo
          src="/images/video.mp4"
          layoutId="home-shared-video"
          className="absolute bottom-0 right-0 z-20 w-64 h-40"
        />
      )}

      <div className="max-w-7xl mx-auto px-10 w-full relative">
        {/* Big background text - absolutely centered */}
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] leading-none font-bold text-[#d4d4d8] tracking-tight select-none z-0">
          AlMarkLabs
        </h1>

        {/* Main layout */}
        <div className="relative flex items-center justify-between min-h-[360px] z-10">
          {/* Left side - image badges */}
          <div className="relative flex-1">
            {/* Left star image */}
            <img
              src="/images/star.png"
              alt="star shape"
              className="hero-float-1 absolute -left-28 -top-32 w-36 h-36 object-contain"
            />

            {/* Floating Aa image */}
            <img
              src="/images/Aa.png"
              alt="Aa card"
              className="hero-float-2 absolute -top-16 left-[300px] w-24 h-auto object-contain"
            />

            {/* Bottom left Full-Stack pill image */}
            <img
              src="/images/fullstack.png"
              alt="Full Stack badge"
              className="hero-float-3 absolute -bottom-36 left-40 w-28 h-auto object-contain"
            />

            {/* Bottom right Agencies pill image */}
            <img
              src="/images/agencies.png"
              alt="Agencies badge"
              className="hero-float-2 absolute -bottom-40 -right-[320px] w-28 h-auto object-contain"
            />
          </div>

          {/* Right side - services list */}
          <div className="flex-1 flex justify-end">
            <div className="-mt-[112px] mr-24 text-left space-y-1 text-[16px] text-gray-700">
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
