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

const BrandingOfferingsSection: React.FC = () => {
  return (
    <section className="bg-[#1D2255] py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
    <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] text-[#272D55] text-sm sm:text-base font-medium border border-[#B3BDEF]">
  What We Deliver
</span>


        <h2 className="mt-6 text-[60px] font-medium tracking-[-0.02em] text-[#FFFFFF]">
  Our Branding Offerings
</h2>

        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {cards.map((card) => (
          <article
  key={card.title}
  className={`rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[260px] sm:min-h-[280px] ${card.title === 'Brand Strategy & Market Positioning' ? 'lg:min-h-[390px]' : ''} ${card.title === 'Visual Identity & Logo Systems' || card.title === 'Brand Voice & Messaging Frameworks' ? 'lg:min-h-[320px]' : ''} ${card.title === 'Video Production & Editing' ? 'lg:-mt-20 lg:min-h-[400px]' : ''} flex flex-col ${card.span || ''} text-[#FFFFFF]`}
>
              <img
                src="/images/Vector.svg"
                alt=""
                aria-hidden="true"
                className="w-[30px] h-[30px]"
              />
<h3 className={`${card.title === 'Brand Strategy & Market Positioning' || card.title === 'Video Production & Editing' ? 'mt-auto' : 'mt-8'} text-[20px] leading-[1.2] text-[#EFF2FF] font-medium`}>
  {card.title}
</h3>


 <p className="mt-4 text-[16px] leading-[1.45] text-[#FFFFFF] font-normal">
  {card.description}
</p>


            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandingOfferingsSection;
