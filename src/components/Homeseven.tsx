import React, { useEffect, useRef, useState } from 'react';

const Homeseven: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -60px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const baseLineClasses =
    'flex flex-wrap items-center justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-5 w-full';

  const lineClass = (delayClass: string) =>
    `${baseLineClasses} ${visible ? `typing-line ${delayClass}` : 'opacity-0'}`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#272D55] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Line 1: GROWING [one] YOUR BRAND* */}
        <div className={lineClass('typing-delay-0')}>
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight flex-shrink-0">
            GROWING
          </span>
          <img
            src="/images/one.png"
            alt=""
            className="h-8 w-32 sm:h-14 sm:w-44 md:h-16 md:w-52 lg:h-[68px] lg:w-[235px] min-w-[100px] sm:min-w-[160px] flex-1 rounded-full object-cover border-2 border-white object-center mx-1 sm:mx-2"
          />
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight flex-shrink-0">
            YOUR BRAND<sup>*</sup>
          </span>
        </div>

        {/* Line 2: ON THE [two] RIGHT PLATFORM */}
        <div className={lineClass('typing-delay-1')}>
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight underline decoration-white underline-offset-2 flex-shrink-0">
            ON THE
          </span>
          <img
            src="/images/two.png"
            alt=""
            className="h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-40 lg:h-14 lg:w-48 xl:h-16 xl:w-52 min-w-[70px] sm:min-w-[100px] flex-1 rounded-full object-cover border-2 border-white object-center mx-1 sm:mx-2"
          />
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight flex-shrink-0">
            RIGHT PLATFORM
          </span>
        </div>

        {/* Line 3: -AT [three] THE RIGHT TIME */}
        <div className={lineClass('typing-delay-2')}>
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight flex-shrink-0">
            -AT
          </span>
          <img
            src="/images/three.png"
            alt=""
            className="h-8 w-28 sm:h-14 sm:w-44 md:h-16 md:w-64 lg:h-[68px] lg:w-[360px] min-w-[90px] sm:min-w-[140px] flex-1 rounded-full object-cover border-2 border-white object-center mx-1 sm:mx-2"
          />
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight border-2 border-white px-2 py-0.5 sm:px-3 sm:py-1 inline-block flex-shrink-0">
            THE RIGHT TIME
          </span>
        </div>

        {/* Line 4: 'WITH' A [four] SMART PLAN." */}
        <div className={`${lineClass('typing-delay-3')} italic`}>
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight flex-shrink-0">
            &apos;<span className="font-bold">WITH</span>&apos; A
          </span>
          <img
            src="/images/four.png"
            alt=""
            className="h-8 w-24 sm:h-14 sm:w-40 md:h-16 md:w-52 lg:h-[68px] lg:w-[280px] min-w-[80px] sm:min-w-[130px] flex-1 rounded-full object-cover border-2 border-white not-italic object-center mx-1 sm:mx-2"
          />
          <span className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium uppercase tracking-tight flex-shrink-0">
            SMART PLAN.&quot;
          </span>
        </div>
      </div>
    </section>
  );
};

export default Homeseven;
