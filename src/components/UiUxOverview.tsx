import React from 'react';


const UiUxOverview: React.FC = () => {
  return (
    <section className="py-14 sm:py-16 bg-[#F3F5F7]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.58fr] gap-8 lg:gap-12 items-start">
          {/* Mobile: 1.Heading 2.Paragraph 3.Items | Desktop: Left=Paragraph, Right=Heading+Items */}
          <h2 className="order-1 lg:col-start-2 lg:row-start-1 text-2xl sm:text-[36px] leading-[1.1] font-semibold text-[#1D1F24]">
            Strategic Design Framework
          </h2>
          <p className="order-2 lg:col-start-1 lg:row-start-1 text-[16px] leading-[1.5] text-[#5A666E] max-w-[520px] font-normal">
            We design visually compelling and striking creatives that grab attention, tell your brand story, and leave a lasting impression on audiences.
          </p>
          <div className="order-3 lg:col-start-2 lg:row-start-2 mt-5 border-t border-[#C9CED6] pt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <article>
              <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
Design Systems
</h3>

<p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
Systematic frameworks for brand consistency
</p>


              </article>

              <article>
                         <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
 Visual Architecture
</h3>
              <p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
 Strategic interface for audience engagement
</p>
              </article>

              <article>
                      <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
 Experience Engineering
</h3>
              <p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
  High-performance conversion infrastructure


</p>
              </article>
          </div>
        </div>

        <div className="mt-9 sm:mt-11 overflow-hidden rounded-2xl">
          <img
            src="/images/Creative.png"
            alt="Technical infrastructure visual"
            className="w-full h-[280px] sm:h-[420px] lg:h-[470px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default UiUxOverview;
