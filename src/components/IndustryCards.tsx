import React from 'react';

const IndustryCards: React.FC = () => {
  const card = {
    icon: '/images/graph.png',
    title: 'AI-Powered Strategy',
    description:
      'Data-driven insights and intelligent planning that help your brand grow faster and smarter.',
  };

  return (
    <section
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center"
            >
              <img
                src={card.icon}
                alt=""
                className="w-16 h-16 mb-4 object-contain"
              />
              <h3 className="text-lg font-bold text-[#F29335] mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryCards;
