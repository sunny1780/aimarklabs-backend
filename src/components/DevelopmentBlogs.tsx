import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type BlogCard = {
  image: string;
  buttonText: string;
  title: string;
  description: string;
  link?: string;
};

const DevelopmentBlogs = () => {
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

  const headerStyle = {
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    opacity: visible ? 1 : 0,
    transition:
      'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
  };

  const cardStyle = (delay: number) => ({
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    opacity: visible ? 1 : 0,
    transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.5s ease ${delay}ms`,
  });
  const blogCards: BlogCard[] = [
    {
      image: '/images/SEOBLOG.webp',
      buttonText: 'SEO',
      title: 'SEO in the Age of AI',
      description:
        'Discover how AI search is changing ranking signals and what practical SEO strategies still drive sustainable growth.',
      link: '/blog/seo-in-the-age-of-ai',
    },
    {
      image: '/images/AIBLOG.webp',
      buttonText: 'Marketing',
      title: 'AI-Driven Keyword Research',
      description:
'Keyword research has always been a crucial part of Search Engine Optimization (SEO) and digital marketing. However, with advancements in Artificial Intelligence (AI), keyword research has become more data-driven, precise, and effective.',
    },
    {
      image: '/images/AIPowered.webp',
      buttonText: 'Automation',
      title: 'AI-Powered Content Creation',
      description:
        'Artificial Intelligence (AI) is transforming the digital marketing landscape, and content creation is no exception. AI-powered content creation refers to the use of AI tools and algorithms to generate written, visual, or multimedia content with minimal human intervention.', },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div style={headerStyle}>
          {/* Tag */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] border border-[#B3BDEF]">
              Resources
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-10">
            Latest Blogs
          </h2>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogCards.map((card, index) => {
            const cardContent = (
              <>
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6 flex flex-col flex-1">
                  <button className="bg-[#B3BDEF] text-white text-sm font-medium px-4 py-2 rounded-lg mb-3">
                    {card.buttonText}
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5 min-h-[38px]">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed min-h-[84px]">
                    {card.description}
                  </p>
                </div>
              </>
            );
            const cardClass =
              'bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col ' +
              (card.link ? 'hover:shadow-lg transition-shadow cursor-pointer' : '');

            return card.link ? (
              <Link key={index} to={card.link} className="block h-full">
                <div style={cardStyle(index * 150)} className={cardClass}>
                  {cardContent}
                </div>
              </Link>
            ) : (
              <div key={index} style={cardStyle(index * 150)} className={cardClass}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DevelopmentBlogs;
