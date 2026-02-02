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
        <span className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] border border-[#B3BDEF] mb-6">
          Tag Comes here
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Our Philosophy
        </h2>

        {/* Paragraph */}
        <div ref={textRef} className="mb-8">
          <p
            className="text-center text-2xl sm:text-3xl lg:text-[48px]"
            style={{
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
              fontWeight: 400,
              lineHeight: '150%',
              letterSpacing: '0.5%',
            }}
          >
            {(
              'we believe that every challenge hides a chance to grow stronger. Our mission is to transform complex business problems into strategic advantages through innovation, insight, and intelligent execution.'
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
        <button className="bg-[#F29335] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#e0852a] transition-colors">
          Book a Free Strategy Call
        </button>
      </div>
    </section>
  );
};

export default Aboutthree;
