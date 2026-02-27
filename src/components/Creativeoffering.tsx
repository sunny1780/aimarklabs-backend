import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

type OfferingItem = {
  title: string;
  description: string;
  wide?: boolean;
};

const offerings: OfferingItem[] = [
  {
    title: 'Branding & Identity Design',
    description:
      'Develop logos, color schemes, typography, and visual assets that reflect your brand personality and ensure consistency across all platforms.'
  },
  {
    title: 'SEO, Graphic & Motion Design',
    description:
      'Design infographics, banners, and animated visuals optimized for digital platforms, boosting engagement and storytelling.'
  },
  {
    title: 'Video Production & Editing',
    description:
      'Engineer broadcast-quality video content with motion graphics integration, professional audio systems, and multi-format optimization.'
  },
  {
    title: 'UI/UX Design & Prototyping',
    description:
      'Develop user-friendly, intuitive interfaces for websites and apps, ensuring seamless navigation and interaction for higher engagement.'
  },
  {
    title: 'Illustration & Custom Graphics',
    description:
      'Design bespoke illustrations, iconography, and visual elements that bring unique personality to your brand and enhance storytelling across all touchpoints.',
    wide: true
  }
];

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 260;
const DEFAULT_GLOW_COLOR = '132, 0, 255';

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('span');
  el.className = 'creative-particle';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.background = `rgba(${color}, 1)`;
  el.style.boxShadow = `0 0 8px rgba(${color}, 0.7)`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-opacity', glow.toString());
};

const Sparkle = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#B8C3FF]"
    aria-hidden="true"
  >
    <path
      d="M15.5 6.2L17.5 12.3L23.6 14.3L17.5 16.3L15.5 22.4L13.5 16.3L7.4 14.3L13.5 12.3L15.5 6.2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.8 6.4L24.35 8.05L26 8.6L24.35 9.15L23.8 10.8L23.25 9.15L21.6 8.6L23.25 8.05L23.8 6.4Z"
      fill="currentColor"
    />
    <path
      d="M26.5 11.8L26.85 12.8L27.85 13.15L26.85 13.5L26.5 14.5L26.15 13.5L25.15 13.15L26.15 12.8L26.5 11.8Z"
      fill="currentColor"
    />
  </svg>
);

const AnimatedOfferingCard = ({
  children,
  wide = false
}: {
  children: ReactNode;
  wide?: boolean;
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLElement[]>([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: DEFAULT_PARTICLE_COUNT }, () =>
      createParticleElement(Math.random() * width, Math.random() * height)
    );
    particlesInitialized.current = true;
  }, []);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 90,
          y: (Math.random() - 0.5) * 90,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.35,
          duration: 1.4,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 90);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      // animateParticles(); // Disabled particle animation
    };

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
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      element.style.setProperty('--glow-opacity', '0');
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleClick = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'creative-ripple';
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
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles]);

  return (
    <article
      ref={cardRef}
      className={`creative-card rounded-[20px] border border-[#9EA8DA] p-6 md:p-7 text-white bg-transparent min-h-[248px] md:min-h-[270px] flex flex-col ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      {children}
    </article>
  );
};

const GlobalSpotlight = ({ gridRef }: { gridRef: React.RefObject<HTMLDivElement | null> }) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'creative-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 720px;
      height: 720px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${DEFAULT_GLOW_COLOR}, 0.14) 0%,
        rgba(${DEFAULT_GLOW_COLOR}, 0.08) 18%,
        rgba(${DEFAULT_GLOW_COLOR}, 0.04) 32%,
        rgba(${DEFAULT_GLOW_COLOR}, 0.02) 45%,
        rgba(${DEFAULT_GLOW_COLOR}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current;
      const rect = section.getBoundingClientRect();
      const mouseInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.creative-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty('--glow-opacity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(DEFAULT_SPOTLIGHT_RADIUS);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, event.clientX, event.clientY, glowIntensity);
      });

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.7
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.7
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.creative-card').forEach((card) => {
        (card as HTMLElement).style.setProperty('--glow-opacity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef]);

  return null;
};

const Creativeoffering = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll('.creative-card'),
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.08
      }
    );
  }, []);

  useEffect(() => {
    const cardsGrid = gridRef.current;
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
    <section ref={sectionRef} className="bg-[#1F2457] py-16 md:py-20 lg:py-24 creative-offering-section">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center">
<span className="inline-block rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] px-5 py-2 text-[14px] font-medium text-[#272D55]">
  What We Deliver
</span>


 <h2 className="mt-6 text-white text-4xl md:text-[60px] leading-[1.08] font-medium tracking-[-0.02em]">
  Our Creative Offerings
</h2>


        </div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4" ref={gridRef}>
          {offerings.map((item) => (
            <AnimatedOfferingCard key={item.title} wide={item.wide}>
              <Sparkle />
              <div className="mt-auto">
                <h3 className="text-[20px] leading-tight font-medium">
                  {item.title}
                </h3>
                <p className="mt-4 text-[16px] leading-[1.5] text-[#FFFFFF] font-normal">
                  {item.description}
                </p>
              </div>


            </AnimatedOfferingCard>
          ))}
        </div>

        <div className="mt-12 md:mt-14 flex justify-center">
    <button className="rounded-[8px] bg-[#F29335] hover:bg-[#e88f2b] transition-colors text-white px-8 py-4 min-w-[244px] text-[16px] font-medium">
  Start Designing Solutions
</button>



        </div>
      </div>

      <GlobalSpotlight gridRef={gridRef} />

      <style>
        {`
          .creative-card {
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
            box-shadow: none;
          }

          .creative-card::before {
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
            opacity: var(--glow-opacity, 0);
            z-index: 1;
            transition: opacity 0.3s ease;
          }

          .creative-card::after {
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
            opacity: var(--glow-opacity, 0);
            transition: opacity 0.3s ease;
          }

          .creative-card:hover {
            --border-glow-size: 2.5px;
            background: rgba(12, 10, 28, 0.65);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            box-shadow: none;
          }

          .creative-ripple {
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

          .creative-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 2;
          }

        `}
      </style>
    </section>
  );
};

export default Creativeoffering;
