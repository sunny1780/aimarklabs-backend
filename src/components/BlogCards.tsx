import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BlogCards: React.FC = () => {
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

  const cardStyle = (index: number): React.CSSProperties => ({
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    opacity: visible ? 1 : 0,
    transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 120}ms, opacity 0.5s ease ${index * 120}ms`,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => {
            const cardContent = (
              <>
                <img
                  src={cardImages[index % 3]}
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
                <div style={cardStyle(index)} className={cardClass}>
                  {cardContent}
                </div>
              </Link>
            ) : (
              <div key={index} style={cardStyle(index)} className={cardClass}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogCards;
