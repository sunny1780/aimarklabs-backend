import React, { useEffect, useState } from 'react';
import BounceCards from './BounceCards';
import TextType from './TextType';

const marketingImages = [
  '/images/Marketing-hero.png',
  '/images/11.png',
  '/images/12.png',
  '/images/13.png'
];

const transformStyles = [
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)'
];

const MarketingHero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const mobileTransformStyles = [
    'rotate(5deg) translate(-88px)',
    'rotate(0deg) translate(-42px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(42px)'
  ];

  return (
    <section className="bg-[#F3F5F7] pt-12 sm:pt-16 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center min-h-[560px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-[10px] border border-[#B3BDEF] bg-[#D7DDFC] text-[#272D55] text-[14px] leading-none px-5 py-2.5">
              Marketing
            </span>

            <h1 className="mt-10 sm:mt-14 text-[34px] sm:text-[54px] lg:text-[60px] leading-[0.98] font-semibold tracking-[-0.02em] text-[#1E1E1E]">
              <TextType
                text={['Growth-Focused Marketing Retainers']}
                as="span"
                typingSpeed={75}
                pauseDuration={2000}
                showCursor
                cursorCharacter="|"
                loop={false}
                startOnVisible
              />
            </h1>

            <a
              href="/contact"
              className="mt-8 sm:mt-12 inline-flex items-center justify-center rounded-[10px] bg-[#F29335] text-white text-[14px] sm:text-[16px] font-medium leading-none px-6 sm:px-8 py-3 sm:py-4 hover:bg-[#df8428] transition-colors"
            >
              Request a Marketing Audit
            </a>
          </div>

          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[430px] overflow-hidden">
            <BounceCards
              className="custom-bounceCards"
              images={marketingImages}
              containerWidth={isMobile ? 300 : 500}
              containerHeight={isMobile ? 190 : 250}
              animationDelay={1}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.5)"
              transformStyles={isMobile ? mobileTransformStyles : transformStyles}
              enableHover={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingHero;
