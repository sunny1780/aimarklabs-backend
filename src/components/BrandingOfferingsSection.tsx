import React, { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';

type OfferingCard = {
  title: string;
  description: string;
  span?: string;
};

const cards: OfferingCard[] = [
  {
    title: 'Brand Strategy & Market Positioning',
    description:
      'Develop data-driven positioning frameworks, audience analysis, and competitive intelligence to define your unique market space and messaging architecture.',
    span: 'lg:col-span-2 branding-card-wide',
  },
  {
    title: 'Visual Identity & Logo Systems',
    description:
      'Design comprehensive identity ecosystems including primary logos, typography hierarchies, color palettes, and visual guidelines ensuring systematic consistency.',
  },
  {
    title: 'Brand Voice & Messaging Frameworks',
    description:
      'Craft distinctive tone-of-voice guidelines, messaging pillars, and communication standards that ensure authentic brand expression across all channels.',
  },
  {
    title: 'Brand Guidelines & Asset Libraries',
    description:
      'Create detailed brand manuals with usage rules, application examples, and digital asset libraries enabling consistent execution across teams and markets.',
  },
  {
    title: 'Rebranding & Brand Evolution',
    description:
      'Transform existing brand identities to align with market shifts, audience expectations, and strategic growth objectives while maintaining equity recognition.',
  },
  {
    title: 'Video Production & Editing',
    description:
      'Create professional video content for marketing, social media, tutorials, or brand storytelling with motion graphics, voiceovers, and post-production polish.',
    span: 'lg:col-span-2 branding-card-wide',
  },
];

const BrandingAnimatedCard = ({
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

    const handleClick = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'branding-ripple';
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
    <article ref={cardRef} className={`branding-card ${className}`}>
      {children}
    </article>
  );
};

const BrandingOfferingsSection: React.FC = () => {
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
    <section className="bg-[#1D2255] py-14 sm:py-16 lg:py-20 branding-offerings-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] text-[#272D55] text-sm sm:text-base font-medium border border-[#B3BDEF]">
            What We Deliver
          </span>

          <h2 className="mt-6 text-3xl sm:text-[60px] font-medium tracking-[-0.02em] text-[#FFFFFF] leading-tight">
            Our Branding Offerings
          </h2>
        </div>

        <div ref={cardsGridRef} className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {cards.map((card) => (
            <BrandingAnimatedCard
              key={card.title}
              className={`rounded-2xl border border-[#AAB4EA] p-5 sm:p-6 min-h-[260px] sm:min-h-[280px] flex flex-col text-[#FFFFFF] ${
                card.title === 'Brand Strategy & Market Positioning' ? 'lg:min-h-[390px]' : ''
              } ${
                card.title === 'Visual Identity & Logo Systems' || card.title === 'Brand Voice & Messaging Frameworks'
                  ? 'lg:min-h-[320px]'
                  : ''
              } ${card.title === 'Video Production & Editing' ? 'lg:-mt-20 lg:min-h-[400px]' : ''} ${card.span || ''}`}
            >
              <img
                src="/images/Vector.svg"
                alt=""
                aria-hidden="true"
                className="w-[30px] h-[30px]"
              />
              <h3
                className={`${
                  card.title === 'Brand Strategy & Market Positioning' || card.title === 'Video Production & Editing'
                    ? 'mt-auto'
                    : 'mt-8'
                } text-[20px] leading-[1.2] text-[#EFF2FF] font-medium`}
              >
                {card.title}
              </h3>

              <p className="mt-4 text-[16px] leading-[1.45] text-[#FFFFFF] font-normal">
                {card.description}
              </p>
            </BrandingAnimatedCard>
          ))}
        </div>
      </div>

      <style>
        {`
          .branding-card {
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

          .branding-card::before {
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

          .branding-card::after {
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

          .branding-card:hover {
            --border-glow-size: 2.5px;
            background: rgba(12, 10, 28, 0.65);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            box-shadow:
              0 14px 40px rgba(8, 10, 34, 0.45),
              0 0 25px rgba(120, 80, 220, 0.12);
          }

          .branding-card.branding-card-wide:hover {
            box-shadow:
              0 10px 28px rgba(8, 10, 34, 0.35),
              0 0 18px rgba(120, 80, 220, 0.08);
          }

          .branding-card.branding-card-wide::after {
            background: radial-gradient(
              320px circle at var(--glow-x) var(--glow-y),
              rgba(140, 100, 255, calc(var(--glow-opacity) * 0.12)) 0%,
              rgba(100, 60, 200, calc(var(--glow-opacity) * 0.05)) 30%,
              transparent 55%
            );
          }

          .branding-ripple {
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

export default BrandingOfferingsSection;
