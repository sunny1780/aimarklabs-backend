import React, { useEffect, useRef, useState } from 'react';

const HomeFaqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Second item open by default
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -80px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "What services does your agency offer?",
      answer: "We provide a full range of digital marketing services, including SEO, PPC, social media management, content creation, email marketing, web design, and analytics reporting."
    },
    {
      question: "Do you work with businesses in all industries?",
      answer: "Yes, we work with businesses across various industries, including e-commerce, technology, healthcare, finance, hospitality, and more."
    },
    {
      question: "Can you help us target audiences in different countries?",
      answer: "Absolutely! We specialize in global marketing and can localize campaigns to target specific audiences by region, language, or culture."
    },
    {
      question: "How do you measure the success of your campaigns?",
      answer: "We track metrics such as website traffic, conversions, ROI, engagement rates, and other KPIs based on your business goals. Regular reports are shared for transparency."
    },
    // {
    //   question: "Lorem ipsum dolor sit amet consectetur?",
    //   answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    // }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const leftStyle: React.CSSProperties = {
    transform: visible ? 'translateX(0)' : 'translateX(-40px)',
    opacity: visible ? 1 : 0,
    transition:
      'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
  };

  const rightStyle: React.CSSProperties = {
    transform: visible ? 'translateX(0)' : 'translateX(40px)',
    opacity: visible ? 1 : 0,
    transition:
      'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 120ms, opacity 0.6s ease 120ms',
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side */}
          <div style={leftStyle}>
            <div className="mb-6">
              <span className="inline-flex items-center justify-center h-9 px-3 py-2 rounded border border-[#B3BDEF] text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC]">
                FAQ's
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-gray-900 leading-tight mb-4">
              Got a Question?
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Quick answers to common questions about our services, process, and results.
            </p>
            <button className="bg-[#F97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ea6a0d] transition-colors flex items-center gap-2">
              Contact Now
              <span>→</span>
            </button>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="space-y-0" style={rightStyle}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-4 text-left hover:text-[#F97316] transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#F97316] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFaqs;
