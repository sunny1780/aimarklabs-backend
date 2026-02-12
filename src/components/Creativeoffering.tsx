import { useEffect, useRef, type ReactNode } from 'react';
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
    <article
      ref={cardRef}
      className={`creative-card rounded-[14px] border border-[#9EA8DA] p-6 md:p-7 text-white bg-transparent min-h-[248px] md:min-h-[270px] flex flex-col ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      {children}
    </article>
  );
};

const Creativeoffering = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

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

  return (
    <section ref={sectionRef} className="bg-[#1F2457] py-16 md:py-20 lg:py-24">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center">
<span className="inline-block rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] px-5 py-2 text-[14px] font-medium text-[#272D55]">
  What We Deliver
</span>


 <h2 className="mt-6 text-white text-4xl md:text-[60px] leading-[1.08] font-medium tracking-[-0.02em]">
  Our Creative Offerings
</h2>


        </div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <style>
        {`
          .creative-card {
            position: relative;
            overflow: hidden;
            transform-style: preserve-3d;
            will-change: transform;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-opacity: 0;
          }

          .creative-card::before {
            content: "";
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: radial-gradient(
              140px 140px at var(--glow-x) var(--glow-y),
              rgba(153, 63, 255, 1) 0%,
              rgba(132, 0, 255, 0.72) 35%,
              rgba(132, 0, 255, 0.28) 62%,
              transparent 78%
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 0;
            z-index: 1;
            transition: opacity 0.2s ease;
          }

          .creative-card::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background: radial-gradient(
              220px circle at var(--glow-x) var(--glow-y),
              rgba(132, 0, 255, calc(var(--glow-opacity) * 0.35)) 0%,
              rgba(132, 0, 255, calc(var(--glow-opacity) * 0.12)) 35%,
              transparent 70%
            );
            opacity: 1;
          }

          .creative-card:hover::before {
            opacity: var(--glow-opacity);
          }

          .creative-card:hover {
            border-color: #b2bcf5;
            box-shadow: 0 14px 35px rgba(8, 10, 34, 0.28);
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

        `}
      </style>
    </section>
  );
};

export default Creativeoffering;
