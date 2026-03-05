import React, { useEffect, useRef, useState } from 'react';

const AboutCta: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -60px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contentStyle: React.CSSProperties = {
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
    opacity: isVisible ? 1 : 0,
    transition:
      'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-4"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="homecta-card bg-[#272D55] rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* Arrow Image */}
            <div className="absolute right-20 bottom-8 hidden lg:block">
              <img
                src="/images/arow.svg"
                alt="Arrow"
                className="w-24 h-24 object-contain opacity-80 animate-arrow-float"
              />
            </div>

            {/* Content */}
            <div
              className="relative z-10 max-w-3xl mx-auto text-center"
              style={contentStyle}
            >
              <h2
                className="homecta-heading mb-5 sm:mb-6 uppercase text-3xl sm:text-5xl lg:text-[70px] leading-tight"
                style={{
                  fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#F29335',
                }}
              >
                **READY TO PARTNER
              </h2>
              <h3 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 sm:mb-6">
                WITH A TEAM THAT{' '}
                <span className="underline italic">DELIVERS</span>
              </h3>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
                <strong>Driven by strategy</strong>, powered by creativity,focused on measurable growth.
              </p>
              <div className="flex justify-center">
                <button className="relative group bg-[#F29335] text-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm overflow-hidden inline-flex items-center justify-center">
                  <span className="relative z-10">
                    Book a Free Consultation
                  </span>
                  {/* Button shine */}
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="absolute -inset-y-1 -left-10 w-20 rotate-12 bg-white/40 blur-md group-hover:translate-x-[220%] transition-transform duration-700" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local styles for CTA motion */}
      <style>
        {`
          .homecta-card {
            box-shadow: 0 28px 80px rgba(15, 23, 42, 0.35);
          }

          .homecta-card::before {
            content: "";
            position: absolute;
            inset: -40%;
            background:
              radial-gradient(circle at 0% 0%, rgba(242, 147, 53, 0.26), transparent 55%),
              radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.22), transparent 55%);
            opacity: 0.55;
            transform: translate3d(-12px, 0, 0);
            animation: homectaGlow 18s ease-in-out infinite alternate;
          }

          .homecta-heading {
            text-shadow: 0 14px 35px rgba(0, 0, 0, 0.6);
            letter-spacing: 0.08em;
          }

          .animate-arrow-float {
            animation: arrowFloat 6s ease-in-out infinite;
          }

          @keyframes homectaGlow {
            0% {
              transform: translate3d(-12px, 0, 0) scale(1.02);
              opacity: 0.5;
            }
            50% {
              transform: translate3d(0, -8px, 0) scale(1.06);
              opacity: 0.75;
            }
            100% {
              transform: translate3d(12px, 0, 0) scale(1.02);
              opacity: 0.55;
            }
          }

          @keyframes arrowFloat {
            0% {
              transform: translate3d(0, 0, 0) rotate(-8deg);
            }
            50% {
              transform: translate3d(0, -10px, 0) rotate(-2deg);
            }
            100% {
              transform: translate3d(0, 0, 0) rotate(-8deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default AboutCta;
