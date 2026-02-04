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
    'flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 lg:mb-5';

  const lineClass = (delayClass: string) =>
    `${baseLineClasses} ${visible ? `typing-line ${delayClass}` : 'opacity-0'}`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#272D55] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Line 1: GROWING [one] YOUR BRAND* */}
        <div className={lineClass('typing-delay-0')}>
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            GROWING
          </span>
          <img
            src="/images/one.png"
            alt=""
            className="h-14 sm:h-16 lg:h-[72px] xl:h-20 w-28 sm:w-32 lg:w-40 xl:w-44 rounded-full object-cover flex-shrink-0"
          />
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            YOUR BRAND*
          </span>
        </div>

        {/* Line 2: ON THE [two] RIGHT PLATFORM */}
        <div className={lineClass('typing-delay-1')}>
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight underline decoration-white underline-offset-2">
            ON THE
          </span>
          <img
            src="/images/two.png"
            alt=""
            className="h-14 sm:h-16 lg:h-[72px] xl:h-20 w-28 sm:w-32 lg:w-40 xl:w-44 rounded-full object-cover flex-shrink-0"
          />
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            RIGHT PLATFORM
          </span>
        </div>

        {/* Line 3: -AT [three] THE RIGHT TIME */}
        <div className={lineClass('typing-delay-2')}>
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            -AT
          </span>
          <img
            src="/images/three.png"
            alt=""
            className="h-14 sm:h-16 lg:h-[72px] xl:h-20 w-28 sm:w-32 lg:w-40 xl:w-44 rounded-full object-cover flex-shrink-0"
          />
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight border border-white px-3 py-1 inline-block">
            THE RIGHT TIME
          </span>
        </div>

        {/* Line 4: 'WITH' A [four] SMART PLAN." */}
        <div className={lineClass('typing-delay-3')}>
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            &apos;WITH&apos; A
          </span>
          <img
            src="/images/four.png"
            alt=""
            className="h-14 sm:h-16 lg:h-[72px] xl:h-20 w-28 sm:w-32 lg:w-40 xl:w-44 rounded-full object-cover flex-shrink-0"
          />
          <span className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight">
            SMART PLAN.&quot;
          </span>
        </div>
      </div>
    </section>
  );
};

export default Homeseven;
