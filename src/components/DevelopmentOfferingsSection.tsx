import React, { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';

const offerings = [
  {
    title: 'Custom Web Application Development',
    description:
      'Build tailored web solutions with modern frameworks, API integrations, and cloud-native architecture optimized for performance, scalability, and user engagement.',
  },
  {
    title: 'Mobile App Development',
    description:
      'Develop native and cross-platform mobile applications with intuitive interfaces, offline capabilities, and seamless backend integration for exceptional user experiences.',
  },
  {
    title: 'E-Commerce Platform Solutions',
    description:
      'Engineer secure, conversion-optimized online stores with payment gateway integration, inventory management, and analytics systems that maximize revenue potential.',
  },
];

const DevelopmentAnimatedCard = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
      element.style.setProperty('--glow-opacity', '1');
      element.style.setProperty('--glow-radius', '300px');

      gsap.to(element, {
        rotateX,
        rotateY,
        x: (x - centerX) * 0.015,
        y: (y - centerY) * 0.015,
        duration: 0.18,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      element.style.setProperty('--glow-opacity', '0');
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'development-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.8 },
        {
          scale: 8,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <article ref={cardRef} className={`development-card ${className}`}>
      {children}
    </article>
  );
};

const DevelopmentOfferingsSection: React.FC = () => {
  const cardsGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cardsGrid = cardsGridRef.current;
    if (!cardsGrid) return;

    const hideCustomCursor = () => {
      document.querySelector('.custom-cursor')?.classList.add('is-hidden');
    };
    const showCustomCursor = () => {
      document.querySelector('.custom-cursor')?.classList.remove('is-hidden');
    };

    cardsGrid.addEventListener('mouseenter', hideCustomCursor);
    cardsGrid.addEventListener('mouseleave', showCustomCursor);
    return () => {
      cardsGrid.removeEventListener('mouseenter', hideCustomCursor);
      cardsGrid.removeEventListener('mouseleave', showCustomCursor);
      showCustomCursor();
    };
  }, []);

  return (
    <section className="bg-[#1D2255] py-16 sm:py-20 development-offerings-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-[14px] font-medium">
            What We Deliver
          </span>

          <h2 className="mt-6 text-[#FFFFFF] text-4xl sm:text-5xl lg:text-[60px] leading-[1.05] font-medium">
            Our Development Offerings
          </h2>
        </div>

        <div ref={cardsGridRef} className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {offerings.map((item) => (
            <DevelopmentAnimatedCard
              key={item.title}
              className="rounded-2xl border border-[#AAB4EA] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] flex flex-col"
            >
              <img
                src="/images/Vector.svg"
                alt=""
                aria-hidden="true"
                className="w-[30px] h-[30px]"
              />
              <div className="mt-auto">
                <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                  {item.title}
                </h3>
                <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
                  {item.description}
                </p>
              </div>
            </DevelopmentAnimatedCard>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/contact"
            className="inline-flex items-center rounded-[8px] bg-[#F29335] px-7 py-3 text-[#FFFFFF] text-[16px] font-medium hover:bg-[#e7862b] transition-colors"
          >
            Start Your Development Project
          </a>
        </div>
      </div>

      <style>
        {`
          .development-card {
            position: relative;
            overflow: hidden;
            transform-style: preserve-3d;
            will-change: transform;
            transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease, backdrop-filter 0.25s ease;
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-radius: 300px;
            --glow-opacity: 0;
            --border-size: 2px;
            --border-glow-size: 2px;
            border-color: rgba(100, 80, 150, 0.25);
            border-width: var(--border-size);
            background: rgba(8, 8, 20, 0.45);
            backdrop-filter: blur(12px) saturate(120%);
            -webkit-backdrop-filter: blur(12px) saturate(120%);
          }

          .development-card::before {
            content: "";
            position: absolute;
            inset: 0;
            padding: var(--border-glow-size);
            background: radial-gradient(
              var(--glow-radius, 300px) circle at var(--glow-x) var(--glow-y),
              rgba(160, 100, 255, calc(var(--glow-opacity) * 0.85)) 0%,
              rgba(140, 80, 240, calc(var(--glow-opacity) * 0.6)) 20%,
              rgba(120, 60, 220, calc(var(--glow-opacity) * 0.3)) 40%,
              transparent 60%
            );
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            z-index: 1;
            transition: opacity 0.3s ease;
          }

          .development-card::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background: radial-gradient(
              360px circle at var(--glow-x) var(--glow-y),
              rgba(140, 100, 255, calc(var(--glow-opacity) * 0.2)) 0%,
              rgba(100, 60, 200, calc(var(--glow-opacity) * 0.08)) 30%,
              transparent 55%
            );
            opacity: 1;
            transition: opacity 0.3s ease;
          }

          .development-card:hover {
            --border-glow-size: 2.5px;
            background: rgba(12, 10, 28, 0.65);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            box-shadow:
              0 14px 40px rgba(8, 10, 34, 0.45),
              0 0 25px rgba(120, 80, 220, 0.12);
          }

          .development-ripple {
            position: absolute;
            width: 14px;
            height: 14px;
            margin-left: -7px;
            margin-top: -7px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle, rgba(132, 0, 255, 0.55) 0%, transparent 70%);
            z-index: 2;
          }
        `}
      </style>
    </section>
  );
};

export default DevelopmentOfferingsSection;
