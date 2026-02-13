import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'What technologies do you use for development?',
    answer:
      ' We use modern frameworks like React, Angular, Node.js, WordPress, Shopify, and custom backend solutions based on project needs.',
  },
  {
    question: 'Do you provide responsive designs for mobile devices?',
    answer:
'Yes, all our websites and apps are fully responsive for desktop, tablet, and mobile.'
  },
  {
    question: 'Can you integrate third-party tools and APIs?',
    answer:
'Absolutely, we can integrate payment gateways, CRMs, analytics tools, and more.'
  },
  {
    question: 'Do you offer post-launch support?',
    answer:
' Yes, we provide maintenance packages to ensure smooth performance after launch.'
  },
  {
    question: 'How long does a typical development project take?',
    answer:
' Small projects may take 4–6 weeks, while complex apps or e-commerce platforms may take 8–16 weeks.',
  },
  //  {
  //   question: 'Can you integrate my website with third-party software?',
  //   answer:
  //     'Absolutely! We connect CRMs, analytics tools, payment systems, and other APIs for seamless functionality.',
  // },
];

const DevelopmentFaqs = () => {
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
 Development Questions?

</h2>




           <p className="mt-4 text-[#5A666E] text-[18px] leading-relaxed max-w-[420px]">
Clear insights into platforms, technologies, timelines, and support.

</p>


<a
  href="/contact"
  className="mt-7 inline-flex items-center gap-2 rounded-[6px] bg-[#F29335] px-6 py-3 text-white text-[14px] sm:text-[14px] lg:text-[14px] font-medium hover:bg-[#e88f2b] transition-colors"
>
  Get Solutions That Scale
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

export default DevelopmentFaqs;
