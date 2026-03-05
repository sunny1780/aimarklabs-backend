import React from 'react';

const architectureItems = [
  {
    title: 'Brand Strategy',
    description: 'Research-driven positioning frameworks',
  },
  {
    title: 'Identity Systems',
    description: 'Cohesive visual language and brand guidelines',
  },
  {
    title: 'Market Positioning',
    description: 'Competitive differentiation strategy',
  },
];

const BrandArchitectureSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.58fr] gap-8 lg:gap-x-12 lg:gap-y-0 items-start">
          {/* Mobile: 1.Heading 2.Paragraph 3.Items | Desktop: Left=Paragraph, Right=Heading+Items */}
          <h2 className="order-1 lg:col-start-2 lg:row-start-1 text-2xl sm:text-[36px] leading-[1.1] font-bold text-[#1E1E1E]">
            Strategic Brand Architecture
          </h2>
          <p className="order-2 lg:col-start-1 lg:row-start-1 text-[16px] leading-[1.5] text-[#5A666E] max-w-[520px]">
            Memorable brand identities resonate with your audience, differentiate your business uniquely, and we craft them to stand out in the market.
          </p>
          <div className="order-3 lg:col-start-2 lg:row-start-2 mt-5 lg:mt-0 border-t border-[#C9CED6] pt-5 lg:pt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {architectureItems.map((item) => (
                <article key={item.title}>
                 <h3 className="text-[16px] leading-[1.2] font-semibold text-[#182126]">
  {item.title}
</h3>

<p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E]">
  {item.description}
</p>

                </article>
              ))}
          </div>
        </div>

        <div className="mt-9 sm:mt-11 overflow-hidden rounded-2xl">
          <img
            src="/images/brand.png"
            alt="Strategic brand architecture visual"
            className="w-full h-[280px] sm:h-[420px] lg:h-[470px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BrandArchitectureSection;
