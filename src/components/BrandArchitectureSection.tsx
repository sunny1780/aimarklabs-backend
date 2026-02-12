import React from 'react';

const architectureItems = [
  {
    title: 'Brand Strategy',
    description: 'Research-driven positioning frameworks',
  },
  {
    title: 'Identity Systems',
    description: 'Cohesive visual language',
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
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.58fr] gap-8 lg:gap-12 items-start">
         <p className="text-[16px] leading-[1.5] text-[#5A666E] max-w-[520px]">
  By merging innovative design with strategic thinking and audience-driven insights, we ensure your digital
  presence communicates trust, professionalism, and unique
</p>


          <div>
           <h2 className="text-[36px] leading-[1.1] font-bold text-[#1E1E1E]">
  Strategic Brand Architecture
</h2>


            <div className="mt-5 border-t border-[#C9CED6] pt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
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
        </div>

        <div className="mt-9 sm:mt-11 overflow-hidden rounded-2xl">
          <img
            src="/images/colors.png"
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
