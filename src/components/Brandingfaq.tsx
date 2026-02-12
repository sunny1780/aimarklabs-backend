import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Et facilisis aliquam sem imperdiet ut fames. Tincidunt sed leo in semper magna curabitur dictum. Dignissim id blandit porttitor habitant tortor mattis scelerisque auctor. Mi netus consectetur velit vitae viverra volutpat purus libero nisi. Ullamcorper pharetra nibh auctor tempor diam mi leo mauris dolor.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Et facilisis aliquam sem imperdiet ut fames. Tincidunt sed leo in semper magna curabitur dictum. Dignissim id blandit porttitor habitant tortor mattis scelerisque auctor. Mi netus consectetur velit vitae viverra volutpat purus libero nisi. Ullamcorper pharetra nibh auctor tempor diam mi leo mauris dolor.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Et facilisis aliquam sem imperdiet ut fames. Tincidunt sed leo in semper magna curabitur dictum. Dignissim id blandit porttitor habitant tortor mattis scelerisque auctor. Mi netus consectetur velit vitae viverra volutpat purus libero nisi. Ullamcorper pharetra nibh auctor tempor diam mi leo mauris dolor.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Et facilisis aliquam sem imperdiet ut fames. Tincidunt sed leo in semper magna curabitur dictum. Dignissim id blandit porttitor habitant tortor mattis scelerisque auctor. Mi netus consectetur velit vitae viverra volutpat purus libero nisi. Ullamcorper pharetra nibh auctor tempor diam mi leo mauris dolor.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Et facilisis aliquam sem imperdiet ut fames. Tincidunt sed leo in semper magna curabitur dictum. Dignissim id blandit porttitor habitant tortor mattis scelerisque auctor. Mi netus consectetur velit vitae viverra volutpat purus libero nisi. Ullamcorper pharetra nibh auctor tempor diam mi leo mauris dolor.',
  },
];

const Arrow = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 text-[#F39A34] transition-transform ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.27l3.71-3.04a.75.75 0 11.95 1.16l-4.2 3.45a.75.75 0 01-.95 0l-4.2-3.45a.75.75 0 01-.08-1.06z" />
  </svg>
);

const Brandingfaq = () => {
  const [openIndex, setOpenIndex] = useState<number>(1);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className="bg-[#F3F5F7] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.45fr] gap-10 lg:gap-14 items-start">
          <div>
            <span className="inline-flex items-center rounded-[10px] border border-[#AEB7E6] bg-[#D4DBFF] px-4 py-2 text-sm font-medium text-[#2B3362]">
              FAQ&apos;s
            </span>

            <h2 className="mt-6 text-[#111318] text-4xl sm:text-5xl lg:text-[62px] leading-[1.02] font-medium">
              Got a Question?
            </h2>

            <p className="mt-4 text-[#5E6872] text-xl sm:text-2xl lg:text-[40px] leading-relaxed max-w-[420px]">
              Quick answers to common questions about our services, process, and results.
            </p>

            <a
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#F39A34] px-6 py-3 text-white text-base sm:text-lg lg:text-[30px] font-medium hover:bg-[#e88f2b] transition-colors"
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
                    <span className="text-[#1B2026] text-xl sm:text-2xl lg:text-[42px] leading-tight font-medium">
                      {item.question}
                    </span>
                    <Arrow open={isOpen} />
                  </button>

                  {isOpen && (
                    <div className="pb-7 pr-2 sm:pr-6">
                      <p className="text-[#5E6872] text-lg sm:text-xl lg:text-[37px] leading-relaxed">
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

export default Brandingfaq;
