const overviewItems = [
  {
    title: 'Heading comes here',
    text: 'By merging innovative design with strategic thinking and audience-driven insights, we ensure your'
  },
  {
    title: 'Heading comes here',
    text: 'By merging innovative design with strategic thinking and audience-driven insights, we ensure your'
  },
  {
    title: 'Heading comes here',
    text: 'By merging innovative design with strategic thinking and audience-driven insights, we ensure your'
  }
];

const UiUxOverview = () => {
  return (
    <section className="bg-[#F4F5F7] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10 md:gap-14 items-start">
          <p className="text-[18px] leading-relaxed text-[#5f6972] max-w-[340px]">
            By merging innovative design with strategic thinking and
            audience-driven insights, we ensure your digital presence
            communicates trust, professionalism, and unique
          </p>

          <div>
            <h2 className="text-4xl md:text-[54px] md:leading-[1.05] font-semibold text-[#1f2328] tracking-[-0.02em]">
              Overview Overview Overview Overview OverviewOverview
            </h2>

            <div className="mt-6 border-t border-[#d4d9e0] pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {overviewItems.map((item, index) => (
                <div key={index}>
                  <h3 className="text-[32px] font-semibold text-[#1f2328] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-[#5f6972]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 rounded-2xl overflow-hidden">
          <img
            src="/images/ui.png"
            alt="UI UX workspace overview"
            className="w-full h-[300px] sm:h-[420px] md:h-[520px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default UiUxOverview;
