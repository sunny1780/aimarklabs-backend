import React from 'react';

const MarketingOfferingsSection: React.FC = () => {
  return (
    <section className="bg-[#1D2255] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-[14px] font-medium">
            What We Deliver
          </span>
          <h2 className="mt-6 text-[#FFFFFF] text-4xl sm:text-5xl lg:text-[72px] leading-[1.05] font-medium">
            Our Marketing Offerings
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          <article className="rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] lg:min-h-[340px] flex flex-col">
            <img src="/images/Vector.svg" alt="" aria-hidden="true" className="w-[30px] h-[30px]" />
            <div className="mt-auto">
              <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                SEO &amp; Content Marketing Strategy
              </h3>
              <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
Optimize digital presence with technical SEO, authority-building content, and organic strategies that drive sustainable traffic, improved search rankings, and visibility.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] lg:min-h-[700px] flex flex-col lg:row-span-2">
            <img src="/images/Vector.svg" alt="" aria-hidden="true" className="w-[30px] h-[30px]" />
            <div className="mt-auto">
              <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                Social Media Marketing &amp; Community Management
              </h3>
              <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
Build engaged audiences through platform-specific content, consistent interaction, and analytics-driven strategies across all major social networks for lasting community growth.

              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] lg:min-h-[700px] flex flex-col lg:row-span-2">
            <img src="/images/Vector.svg" alt="" aria-hidden="true" className="w-[30px] h-[30px]" />
            <div className="mt-auto">
              <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                Email Marketing &amp; Marketing Automation
              </h3>
              <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
Create personalized email journeys using segmentation, behavioral triggers, and automated nurture sequences to maximize customer lifetime value, engagement, and conversions.

              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] lg:min-h-[340px] flex flex-col">
            <img src="/images/Vector.svg" alt="" aria-hidden="true" className="w-[30px] h-[30px]" />
            <div className="mt-auto">
              <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                AI &amp; LLM Visibility
              </h3>
              <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
Leverage AI and large language models to enhance brand visibility, optimize content creation, and deliver intelligent insights across digital channels effectively.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/contact"
            className="inline-flex items-center rounded-[8px] bg-[#F29335] px-7 py-3 text-[#FFFFFF] text-[16px] font-medium hover:bg-[#e7862b] transition-colors"
          >
            Scale Your Business Growth
          </a>
        </div>
      </div>
    </section>
  );
};

export default MarketingOfferingsSection;
