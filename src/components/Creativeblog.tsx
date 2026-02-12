import React from 'react';


const blogCards = [
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.',
  },
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.',
  },
  {
    tag: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.',
  },
];

const Creativeblog= () => {
  return (
    <section className="bg-[#F3F5F7] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
   <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-[14px] font-medium">
  Blogs
</span>


            <h2 className="mt-5 text-[#111111] text-4xl sm:text-5xl lg:text-[72px] leading-[1.05] font-medium">
            Stay Informed About The Trends
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogCards.map((card, index) => (
            <article key={index} className="bg-[#F9FAFC] rounded-xl p-3 sm:p-4">
              <img
                src="/images/AIBLOG.webp"
                alt="Branding blog visual"
                className="w-full h-44 sm:h-48 object-cover rounded-lg"
                loading="lazy"
              />

              <div className="pt-6 px-2 pb-2">
               <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#D7DDFC] text-[#272D55] text-sm font-medium">
  {card.tag}
</span>


 <h3 className="mt-5 text-[#182126] text-[20px] leading-tight font-semibold">
  {card.title}
</h3>



  <p className="mt-3 text-[#182126] text-[14px] leading-relaxed font-normal">
  {card.description}
</p>


              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
   <a
  href="/blog"
  className="inline-flex items-center gap-2 rounded-[6px] bg-[#F29335] px-8 py-3 text-white text-[16px] font-medium hover:bg-[#e88f2b] transition-colors"
>
  Learn More
  <span aria-hidden="true">→</span>
</a>


        </div>
      </div>
    </section>
  );
};

export default Creativeblog;
