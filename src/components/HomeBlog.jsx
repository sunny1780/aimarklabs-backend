import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HomeBlog = () => {
  const sectionRef = useRef(null);
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

  const cardStyle = (delay) => ({
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    opacity: visible ? 1 : 0,
    transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.5s ease ${delay}ms`,
  });
  const cardImages = [
    '/images/SEOBLOG.webp',
    '/images/AIBLOG.webp',
    '/images/AIPowered.webp',
  ];

  const card = {
    buttonText: 'Collaborate',
    title: 'Talk it out with audio',
    description:
      'Use audio to have live conversations with other collaborators directly in your Figma and FigJam files.',
  };

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
              Tag comes here
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-10">
            Latest Blogs
          </h2>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => {
            const cardContent = (
              <>
                <img
                  src={cardImages[index]}
                  alt=""
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <button className="bg-[#B3BDEF] text-white text-sm font-medium px-4 py-2 rounded-lg mb-3">
                    {card.buttonText}
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {index === 0 ? 'SEO in the Age of AI' : card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </>
            );
            const cardClass = 'bg-white rounded-xl overflow-hidden shadow-md ' + (index === 0 ? 'hover:shadow-lg transition-shadow cursor-pointer' : '');
            return index === 0 ? (
              <Link key={index} to="/blog/seo-in-the-age-of-ai">
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

export default HomeBlog;

