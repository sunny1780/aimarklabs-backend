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
            src="/images/video.mp4"
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
                  className="inline-flex items-center px-5 py-3 rounded-md text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] shadow-sm border border-[#B3BDEF]"
                >
                  Why choose us
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-gray-900 mb-5 leading-tight">
                We Create Marketing That
                <br />
                Works
              </h2>
              <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                We partner with brands to solve real challenges using AI-powered strategies, creative design, and performance-focused marketing.
              </p>
            </div>

            {/* Map with overlay avatars */}
            <div className="relative max-w-xl animate-gentle-float">
              <img
                src="/images/map.png"
                alt="World Map"
                className="w-full h-auto opacity-60"
              />

              {/* Chat Bubbles Overlay */}
              <img
                src="/images/chat bubbles.png"
                alt="Chat Bubbles"
                className="absolute inset-0 w-full h-full object-contain opacity-100 pointer-events-none"
              />
            </div>
          </div>

          {/* Right Side - Divider + Feature Cards (Video section) */}
          <div
            ref={cardsRef}
            className="lg:border-l lg:border-gray-200 lg:pl-12 flex flex-col gap-6 overflow-x-hidden"
          >
            {/* AI-Powered Strategy */}
            <div style={cardStyle(0)} className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full max-w-[462px] min-h-[176px]">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="AI Strategy Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    AI-Powered Strategy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Data-driven insights and intelligent planning that help your brand grow faster and smarter.
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Excellence */}
            <div style={cardStyle(150)} className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full max-w-[462px] min-h-[176px] lg:ml-10">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="Creative Excellence Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    Creative Excellence
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    High-impact branding, design, and digital experiences built to engage and convert.
                  </p>
                </div>
              </div>
            </div>

            {/* Proven Results */}
            <div style={cardStyle(300)} className="bg-white rounded-[22px] px-8 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full max-w-[462px] min-h-[176px] lg:ml-3">
              <div className="flex flex-col gap-4">
                <div className="w-11 h-11">
                  <img
                    src="/images/personicon.png"
                    alt="Proven Results Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F97316] mb-1.5">
                    Proven Results
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
