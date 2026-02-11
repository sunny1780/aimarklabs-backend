const blogCards = [
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.'
  },
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.'
  },
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.'
  }
];

const Creativeblog = () => {
  return (
    <section className="bg-[#F3F5F7] py-16 md:py-20">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-[10px] border border-[#AEB7E6] bg-[#D4DBFF] px-4 py-2 text-sm font-medium text-[#2B3362]">
            Blogs
          </span>
          <h2 className="mt-6 text-[#111318] text-4xl md:text-[64px] leading-[1.08] font-medium tracking-[-0.02em]">
            Stay Informed About The Trends
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {blogCards.map((card, index) => (
            <article
              key={index}
              className="rounded-[10px] bg-white overflow-hidden"
            >
              <img
                src="/images/ui.png"
                alt="Blog visual"
                className="w-full h-[200px] object-cover"
              />

              <div className="p-5 md:p-6">
                <span className="inline-block rounded-[10px] border border-[#AEB7E6] bg-[#D4DBFF] px-4 py-2 text-sm font-medium text-[#2B3362]">
                  {card.tag}
                </span>

                <h3 className="mt-5 text-[#20252B] text-[42px] leading-tight font-medium">
                  {card.title}
                </h3>

                <p className="mt-3 text-[#59626C] text-[32px] leading-[1.45]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 md:mt-12 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#F39A34] px-8 py-3.5 text-white text-[31px] font-medium hover:bg-[#e88f2b] transition-colors">
            Learn More
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Creativeblog;
