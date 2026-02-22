import React, { useRef, useState, useEffect } from 'react';
import SharedVideo from './SharedVideo';

interface HometwoProps {
  nextInView: boolean;
}

const Hometwo: React.FC<HometwoProps> = ({ nextInView }) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLeftVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (leftTextRef.current) {
      observer.observe(leftTextRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const leftTextStyle = {
    transform: leftVisible ? 'translateX(0)' : 'translateX(-60px)',
    opacity: leftVisible ? 1 : 0,
    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease',
  };

  const cardStyle = (delay: number) => ({
    transform: isVisible ? 'translateX(0)' : 'translateX(80px)',
    opacity: isVisible ? 1 : 0,
    transition: `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, opacity 0.35s ease ${delay}ms`,
  });

  return (
    <section
      className="relative bg-[#F5F7FB] py-12 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {nextInView && (
          <SharedVideo
            src="https://customer-leo8lubv91ct4vwd.cloudflarestream.com/5c3acb77ca3fe6464ff0adce38180240/manifest/video.m3u8"
            layoutId="home-shared-video"
            className="w-full max-w-[1400px] h-[280px] sm:h-[420px] lg:h-[740px] mx-auto mb-12"
          />
        )}
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left Side - Text + Map */}
          <div className="relative overflow-x-hidden">
            <div ref={leftTextRef} style={leftTextStyle}>
              <div className="mb-8">
               <span
  className="inline-flex items-center justify-center gap-2.5 h-9 px-2.5 py-2 rounded border border-[#B3BDEF] text-[14px] font-medium tracking-wide text-[#272D55] bg-[#D7DDFC] font-manrope"
>
  Why choose us
</span>

              </div>
              <h2
                className="text-gray-900 mb-5 max-w-[633px]"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: '50px',
                  lineHeight: '100%',
                  letterSpacing: '0.5%'
                }}
              >
                We Create Marketing That
                Works
              </h2>
              <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                We partner with brands to solve real challenges using AI-powered strategies, creative design, and performance-focused marketing.
              </p>
            </div>

            {/* Map with overlay avatars */}
            <div className="relative max-w-xl">
              <img
                src="/images/map.svg"
                alt="World Map"
                className="w-full h-auto opacity-60"
              />

              {/* Chat Bubbles Overlay - animated */}
              <img
                src="/images/chat bubbles.svg"
                alt="Chat Bubbles"
                className="absolute inset-0 w-full h-full object-contain opacity-100 pointer-events-none animate-gentle-float"
              />
            </div>
          </div>

          {/* Right Side - Divider + Feature Cards (Video section) */}
          <div
            ref={cardsRef}
            className="lg:border-l lg:border-gray-200 lg:pl-12 flex flex-col gap-6 overflow-x-hidden"
          >
            {/* AI-Powered Strategy */}
            <div style={cardStyle(0)} className="bg-white rounded-[22px] px-8 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-full max-w-[462px] min-h-[176px]">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-full bg-[#FFEAD1] flex items-center justify-center flex-shrink-0">
                  <img src="/images/icon11.svg" alt="AI Strategy Icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#BF5605] mb-2">
                    AI-Powered Strategy
                  </h3>
                  <p className="text-[#5F6D7E] text-sm leading-relaxed font-normal">
                    Data-driven insights and intelligent planning that help your brand grow faster and smarter.
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Excellence */}
            <div style={cardStyle(150)} className="bg-white rounded-[22px] px-8 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-full max-w-[462px] min-h-[176px] lg:ml-10">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-full bg-[#FFEAD1] flex items-center justify-center flex-shrink-0">
                  <img src="/images/icon12.svg" alt="Creative Excellence Icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#BF5605] mb-2">
                    Creative Excellence
                  </h3>
                  <p className="text-[#5F6D7E] text-sm leading-relaxed font-normal">
                    High-impact branding, design, and digital experiences built to engage and convert.
                  </p>
                </div>
              </div>
            </div>

            {/* Proven Results */}
            <div style={cardStyle(300)} className="bg-white rounded-[22px] px-8 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-full max-w-[462px] min-h-[176px] lg:ml-3">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-full bg-[#FFEAD1] flex items-center justify-center flex-shrink-0">
                  <img src="/images/icon13.svg" alt="Proven Results Icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#BF5605] mb-2">
                    Proven Results
                  </h3>
                  <p className="text-[#5F6D7E] text-sm leading-relaxed font-normal">
                    Measurable outcomes backed by analytics, optimization, and continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hometwo;
