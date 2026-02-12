import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Why is branding crucial for business success?',
    answer:
'A strong brand builds trust, recognition, and customer loyalty, making you stand out in a competitive market.',
  },
  {
    question: 'How do motion graphics improve engagement?',
    answer:
      'Animated visuals capture attention quickly, helping to convey complex ideas in a simple, engaging way.',
  },
  {
    question: 'Can you refresh an existing brand identity?',
    answer:
      'Yes! We modernize logos, colors, and messaging to align with current market trends.',
  },
  {
    question: 'Do you provide social media content creation?',
    answer:
'Absolutely! We design posts, reels, and ad creatives to enhance your online presence.'  },
  {
    question: 'What is your process for creating brand assets?',
    answer:
      'We begin with strategy and research, followed by design drafts and multiple revisions to ensure brand consistency.',
  },
   {
    question: 'How do you ensure the content aligns with our business goals?',
    answer:
      'We conduct in-depth research on your industry, audience, and competitors to create content that aligns with your objectives.',
  },
];

const Creativefaq = () => {
  const [openIndex, setOpenIndex] = useState<number>(1);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className="bg-[#F3F5F7] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.45fr] gap-10 lg:gap-14 items-start">
          <div>
            <span className="inline-flex items-center rounded-[10px] border border-[#B3BDEF] bg-[#D4DBFF] px-4 py-2 text-sm font-medium text-[#272D55] bg-[#D7DDFC]">
              FAQ&apos;s
            </span>

<h2 className="mt-6 text-[#111111] text-4xl sm:text-5xl lg:text-[60px] leading-[1.02] font-medium">
  Got a Question?
</h2>




           <p className="mt-4 text-[#5A666E] text-[18px] leading-relaxed max-w-[420px]">
  Quick answers to common questions about our services, process, and results.
</p>


<a
  href="/contact"
  className="mt-7 inline-flex items-center gap-2 rounded-[6px] bg-[#F29335] px-6 py-3 text-white text-[14px] sm:text-[14px] lg:text-[14px] font-medium hover:bg-[#e88f2b] transition-colors"
>
  Transform Your Brand Identity
  <span aria-hidden="true">→</span>
</a>


          </div>

          <div>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={`${item.question}-${index}`} className="border-b border-[#C8D0DA]">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 py-7 text-left"
                  >
 <span className="text-[#182126] text-[16px] sm:text-[16px] lg:text-[16px] leading-tight font-semibold">
  {item.question}
</span>


                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-5 w-5 text-[#F39A34] transform transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
                      fill="currentColor"
                    >
                      <path d="M12 7L6 15H18L12 7Z" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="pb-7 pr-2 sm:pr-6">
<p className="text-[#5A666E] text-[16px] sm:text-[16px] lg:text-[16px] leading-relaxed">
  {item.answer}
</p>


                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creativefaq;
