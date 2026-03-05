import React from 'react';
import { Link } from 'react-router-dom';
import SharedVideo from './SharedVideo';

interface HeroProps {
  nextInView: boolean;
  isMobile?: boolean;
}

const Hero: React.FC<HeroProps> = ({ nextInView, isMobile = false }) => {
  return (
    <section className="relative overflow-visible sm:overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#ffe4e6] to-[#fef9c3] min-h-[72vh] sm:min-h-[87vh] sm:flex sm:items-center">
      {/* Desktop corner content - always visible */}
      <div className="hidden sm:block absolute z-30 bottom-6 left-6 md:bottom-4 md:left-8 max-w-[420px]">
        <p className="font-manrope text-[#182126] text-[18px] sm:text-[20px] leading-[1.35] mb-2">
          <span className="whitespace-nowrap">From brand identity to digital</span>
          <br />
          <span className="whitespace-nowrap">performance, we create marketing</span>
          <br />
          <span className="whitespace-nowrap">that delivers measurable impact.</span>
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-[#182126] px-4 py-2 text-[#FBFCFD] text-sm font-medium hover:bg-[#24313b] transition-colors"
        >
          Lets Talk
          <img src="/images/ArrowUp.svg" alt="arrow icon" className="w-4 h-4" />
        </Link>
      </div>
      {!nextInView && (
        <SharedVideo
          src="https://customer-leo8lubv91ct4vwd.cloudflarestream.com/5c3acb77ca3fe6464ff0adce38180240/manifest/video.m3u8"
          layoutId={isMobile ? undefined : 'home-shared-video'}
          className="hidden sm:block absolute bottom-6 right-6 md:bottom-0 md:right-0 z-20 w-[220px] h-[140px] md:w-64 md:h-40"
        />
      )}

      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full relative py-6 sm:py-12 lg:py-0">
        {/* Big background text - absolutely centered */}
        <h1 className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[90px] md:text-[120px] lg:text-[160px] xl:text-[200px] leading-none font-bold text-[#d4d4d8] tracking-tight select-none z-0 whitespace-nowrap">
          AI MARK LABS
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
              src="/images/sstar.svg"
              alt="star shape"
              className="hidden lg:block hero-float-1 absolute -left-40 -top-32 w-36 h-36 object-contain"
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
              className="hidden lg:block hero-float-3 absolute -bottom-28 left-40 w-28 h-auto object-contain"
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
            <div className="-mt-4 sm:-mt-[104px] md:-mt-[198px] sm:mr-12 md:mr-24 text-left space-y-1 text-[14px] sm:text-[15px] md:text-[16px] text-gray-700 pr-[160px] sm:pr-0">
              <div>
                <p>Marketing</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
              <div>
                <p>Branding</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
              <div>
                <p>Development</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
              <div>
                <p>Creative</p>
                <img src="/images/Line.png" alt="line" className="mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile corner content - always visible, only video moves */}
      <div className="sm:hidden relative w-full px-6 pt-8 pb-10">
        <img
          src="/images/sstar.svg"
          alt="star shape"
          className="hero-float-1 absolute -left-10 top-12 w-24 h-24 object-contain opacity-35"
        />

        <div className="relative h-[210px]">
          <div className="absolute right-0 top-6 space-y-1 text-[14px] leading-[1.05] text-[#6b4f1f] font-medium text-right">
            <p>Marketing</p>
            <p>Branding</p>
            <p>Development</p>
            <p>Creative</p>
          </div>

          <h1 className="absolute left-1/2 top-[102px] -translate-x-1/2 max-w-full px-2 text-[clamp(44px,13vw,64px)] leading-none font-extrabold tracking-tight text-[#c4cad8] whitespace-nowrap">
            AI Mark Labs
          </h1>

          <img
            src="/images/Aa.png"
            alt="Aa card"
            className="hero-float-2 absolute top-[102px] left-9 w-11 h-auto object-contain"
          />
          <img
            src="/images/fullstack.png"
            alt="Full Stack badge"
            className="hero-float-3 absolute top-[154px] left-[52px] w-14 h-auto object-contain"
          />
          <img
            src="/images/agencies.png"
            alt="Agencies badge"
            className="hero-float-2 absolute top-[152px] right-6 w-16 h-auto object-contain"
          />
        </div>

        <p className="font-manrope text-[#182126] text-[15px] leading-[1.35] mb-4 max-w-[340px]">
          <span>From brand identity to digital performance, we create </span>
          <br className="hidden sm:block" />
          <span>marketing that delivers measurable impact.</span>
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-[#182126] px-4 py-2 text-[#FBFCFD] text-sm font-medium hover:bg-[#24313b] transition-colors"
        >
          Lets Talk
          <img src="/images/ArrowUp.svg" alt="arrow icon" className="w-4 h-4" />
        </Link>

        {!nextInView && (
          <SharedVideo
            src="https://customer-leo8lubv91ct4vwd.cloudflarestream.com/5c3acb77ca3fe6464ff0adce38180240/manifest/video.m3u8"
            layoutId={isMobile ? undefined : 'home-shared-video'}
            className="mt-5 ml-auto w-[205px] h-[128px]"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
