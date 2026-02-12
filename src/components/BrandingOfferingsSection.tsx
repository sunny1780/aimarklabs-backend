import React from 'react';

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
    span: 'lg:col-span-2',
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
    span: 'lg:col-span-2',
  },
];

const SparkleIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3.5L13.84 8.16L18.5 10L13.84 11.84L12 16.5L10.16 11.84L5.5 10L10.16 8.16L12 3.5Z"
      stroke="#B7BEEA"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18.5 3.5V6.5" stroke="#B7BEEA" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 5H20" stroke="#B7BEEA" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BrandingOfferingsSection: React.FC = () => {
  return (
    <section className="bg-[#1D2255] py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[#C9D2FA] text-[#2D3763] text-sm sm:text-base font-medium">
            What We Deliver
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-[68px] font-medium tracking-[-0.02em] text-[#F3F6FF]">
            Our Branding Offerings
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[260px] sm:min-h-[280px] flex flex-col ${card.span || ''}`}
            >
              <SparkleIcon />
              <h3 className="mt-8 text-[30px] sm:text-[34px] leading-[1.2] text-[#EFF2FF] font-medium">{card.title}</h3>
              <p className="mt-4 text-[24px] sm:text-[26px] leading-[1.45] text-[#DFE4FF]">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandingOfferingsSection;
