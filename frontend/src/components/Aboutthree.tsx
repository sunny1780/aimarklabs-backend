import React, { useEffect, useRef, useState } from 'react';

const Aboutthree = () => {
  const textRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="bg-[#F7F9FB] py-20 px-4 sm:px-6 lg:px-4"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Tag */}
        <span className="inline-flex items-center justify-center rounded-lg text-sm font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] border border-[#B3BDEF] mb-6 w-[124px] h-[36px]">
        How We Think
        </span>

        {/* Heading */}
        <h2
          className="w-full max-w-[1280px] mx-auto text-center text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-medium leading-[1] tracking-[0.005em] text-gray-900 mb-6"
          style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
        >
          Our Philosophy
        </h2>

        {/* Paragraph */}
        <div ref={textRef} className="mb-8">
          <p
            className="text-center text-lg sm:text-3xl lg:text-[48px]"
            style={{
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
              fontWeight: 400,
              lineHeight: '150%',
              letterSpacing: '0.5%',
            }}
          >
            {(
              'Our philosophy centers on transforming your toughest marketing challenges into competitive advantages using data-driven strategies, creative firepower, and AI technology that delivers proven results.'
            )
              .split(' ')
              .map((word, index) => (
                <span
                  key={index}
                  className="transition-colors duration-300 ease-in-out inline"
                  style={{
                    color: isInView ? '#111827' : '#D3DBE1',
                    transitionDelay: isInView ? `${index * 40}ms` : '0ms',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="inline-flex items-center justify-center min-w-[188px] min-h-[41px] py-3 px-6 bg-[#F29335] text-white font-medium text-[16px] leading-[24px] tracking-[0.005em] rounded-lg hover:bg-[#e0852a] transition-colors text-center"
          style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
        >
          Book a Free Strategy Call
        </button>
      </div>
    </section>
  );
};

export default Aboutthree;
