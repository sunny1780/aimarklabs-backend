import React from 'react';

const PerformanceMarketing: React.FC = () => {
  return (
    <section className="py-14 sm:py-16 bg-[#F3F5F7]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.58fr] gap-8 lg:gap-12 items-start">
        <p className="text-[16px] leading-[1.5] text-[#5A666E] max-w-[520px] font-normal">
  By merging innovative design with strategic thinking and audience-driven insights, we ensure your digital
  presence communicates trust, professionalism, and unique
</p>


          <div>
 <h2 className="text-[36px] leading-[1.1] font-semibold text-[#1D1F24]">
  Performance Marketing Framework
</h2>




            <div className="mt-5 border-t border-[#C9CED6] pt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <article>
              <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
  Data Analytics
</h3>

<p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
 Insight-driven decision frameworks
</p>


              </article>

              <article>
                         <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
Channel Strategy
</h3>
              <p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
  Multi-platform audience engagement
</p>
              </article>

              <article>
                      <h3 className="text-[16px] leading-[1.2] font-semibold text-[#22262C]">
Conversion Architecture
</h3>
              <p className="mt-3 text-[16px] leading-[1.35] text-[#5A666E] font-normal">
 Revenue-optimized customer journeys


</p>
              </article>
            </div>
          </div>
        </div>

        <div className="mt-9 sm:mt-11 overflow-hidden rounded-2xl">
          <img
            src="/images/Marketing.png"
            alt="Technical infrastructure visual"
            className="w-full h-[280px] sm:h-[420px] lg:h-[470px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default PerformanceMarketing;
