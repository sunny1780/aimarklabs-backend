import React, { useEffect, useRef, useState } from 'react';

const Homefour: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [experience, setExperience] = useState(0);
  const [clients, setClients] = useState(0);
  const [experts, setExperts] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1200; // ms
    const startTime = performance.now();

    const targetExperience = 15;
    const targetClients = 195;
    const targetExperts = 75;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setExperience(Math.floor(progress * targetExperience));
      setClients(Math.floor(progress * targetClients));
      setExperts(Math.floor(progress * targetExperts));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // ensure final values
        setExperience(targetExperience);
        setClients(targetClients);
        setExperts(targetExperts);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasAnimated]);

  return (
    <section
      className="bg-[#F5F7FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Row 1: Text + Heading */}
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center mb-8">
          <p className="text-sm lg:text-base text-gray-600 max-w-md leading-relaxed">
            From strategy to execution, our numbers reflect the growth we create for our clients.
          </p>
          <div className="text-left lg:text-right lg:pr-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Proven Results
              <br />
              Real Impact
            </h2>
          </div>
        </div>

        {/* Row 2: Cards */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Experience */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full lg:w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Experience
            </div>
            <div className="text-[#F97316] text-[64px] sm:text-[92px] lg:text-[128px] font-extrabold leading-none mb-2">
              {experience}y+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Delivering proven digital growth strategies.
            </p>
          </div>

          {/* Satisfied Clients */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full lg:w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Satisfied Clients
            </div>
            <div className="text-[#F97316] text-[64px] sm:text-[92px] lg:text-[128px] font-extrabold leading-none mb-2">
              {clients}+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trusted by brands that value results.
            </p>
          </div>

          {/* Marketing Experts */}
          <div className="bg-white rounded-[22px] px-8 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] w-full lg:w-[416px] min-h-[284px]">
            <div className="inline-flex items-center px-4 py-3 mb-4 rounded-md bg-[#D7DDFC] text-[#272D55] text-xs font-medium">
              Marketing Experts
            </div>
            <div className="text-[#F97316] text-[64px] sm:text-[92px] lg:text-[128px] font-extrabold leading-none mb-2">
              {experts}+
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A team driven by strategy, creativity, and AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homefour;
