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

const Creativeoffering = () => {
  return (
    <section className="bg-[#1F2457] py-16 md:py-20 lg:py-24">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-[10px] bg-[#CDD6FF] px-5 py-2 text-sm md:text-base font-medium text-[#2A315F]">
            What We Deliver
          </span>
          <h2 className="mt-6 text-white text-4xl md:text-[64px] leading-[1.08] font-medium tracking-[-0.02em]">
            Our Creative Offerings
          </h2>
        </div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {offerings.map((item) => (
            <article
              key={item.title}
              className={`rounded-[14px] border border-[#9EA8DA] p-6 md:p-7 text-white bg-transparent min-h-[248px] md:min-h-[270px] ${
                item.wide ? 'md:col-span-2' : ''
              }`}
            >
              <Sparkle />
              <h3 className="mt-8 md:mt-10 text-[33px] leading-tight font-medium">
                {item.title}
              </h3>
              <p className="mt-4 text-[31px] leading-[1.5] text-[#E7ECFF]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 md:mt-14 flex justify-center">
          <button className="rounded-lg bg-[#F39A34] hover:bg-[#e88f2b] transition-colors text-white px-8 py-4 min-w-[244px] text-[31px] font-medium">
            Start Designing Solutions
          </button>
        </div>
      </div>
    </section>
  );
};

export default Creativeoffering;
