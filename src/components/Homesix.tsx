import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Homesix: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -80px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const headerStyle: React.CSSProperties = {
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    opacity: visible ? 1 : 0,
    transition:
      'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
  };

  const memberStyle = (delay: number): React.CSSProperties => ({
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
    opacity: visible ? 1 : 0,
    transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.55s ease ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10 relative"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      {/* Background Lines */}
      <div className="absolute bottom-0 left-0 right-0 top-[50%] pointer-events-none">
        <img
          src="/images/lines.png"
          alt="Background Lines"
          className="w-full h-full object-contain object-bottom"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12" style={headerStyle}>
          <div className="mb-6">
            <span className="inline-flex items-center px-5 py-3 rounded-md text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] shadow-sm border border-[#B3BDEF]">
              Team Members
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-gray-900 leading-tight mb-4">
            Meet Our Team
          </h2>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          {/* Misty Farghaly */}
          <div
            className="flex flex-col items-center text-center"
            style={memberStyle(0)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src="/images/misty.png"
                alt="Misty Farghaly"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-1">Misty Farghaly</h3>
            <p className="text-gray-600">CEO</p>
          </div>

          {/* Ali Chishti */}
          <div
            className="flex flex-col items-center text-center"
            style={memberStyle(150)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src="/images/Ali.png"
                alt="Ali Chishti"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-1">Ali Chishti</h3>
            <p className="text-gray-600">CFO</p>
          </div>

          {/* Mohammad Farghaly */}
          <div
            className="flex flex-col items-center text-center"
            style={memberStyle(300)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src="/images/Muhammad.png"
                alt="Mohammad Farghaly"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-1">Mohammad Farghaly</h3>
            <p className="text-gray-600">Client Relations</p>
          </div>
        </div>

        <div className="mt-10 flex justify-center" style={memberStyle(380)}>
          <Link
            to="/team"
            className="inline-flex items-center rounded-lg bg-[#F29335] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Homesix;
