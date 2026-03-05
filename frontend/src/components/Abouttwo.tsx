import React from 'react';

const Abouttwo = () => {
  const sections = [
    {
      bg: '#F7F9FB',
      icon: '/images/21.svg',
      title: 'Creative Team',
      description: 'Brilliant minds crafting campaigns that convert.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-600',
      iconColor: 'text-gray-800',
    },
    {
      bg: '#F29335',
      icon: '/images/22.svg',
      title: 'Vision Based',
      description: 'Future-focused strategies that anticipate market trends.',
      textColor: 'text-white',
      descColor: 'text-white/90',
      iconColor: 'text-white',
    },
    {
      bg: '#F7F9FB',
      icon: '/images/23.svg',
      title: 'Design Growth',
      description: 'Beautiful designs engineered to drive revenue.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-600',
      iconColor: 'text-gray-800',
    },
    {
      bg: '#B3BDEF',
      icon: '/images/24.svg',
      title: 'AI-Feedback',
      description: 'Smart algorithms optimizing your ROI 24/7.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-800',
      iconColor: 'text-gray-800',
    },
  ];

  return (
    <>
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        {sections.map((section, index) => (
            <div
              key={index}
              className="about-two-card group relative flex flex-col items-start justify-center text-left p-8 lg:p-10 w-full min-h-[328px] transition-all duration-300 hover:opacity-100"
              style={{
                backgroundColor: section.bg,
                animationDelay: `${index * 0.08}s`,
              }}
            >
              {/* subtle shine overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-y-6 -left-16 w-24 rotate-12 bg-white/15 blur-2xl group-hover:translate-x-[260%] transition-transform duration-1000" />
              </div>

              <div className={`about-two-icon mb-4 ${section.iconColor || 'text-gray-800'}`}>
                <img src={section.icon} alt="" className="w-12 h-12 object-contain" />
              </div>
              <h3
                className="w-full max-w-[264px] text-[20px] sm:text-[24px] lg:text-[30px] font-bold leading-[24px] sm:leading-[28px] lg:leading-[36px] tracking-[0.005em] mb-2 text-[#272D55]"
                style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
              >
                {section.title}
              </h3>
              <p
                className="w-full max-w-[264px] text-[14px] sm:text-[16px] lg:text-[18px] font-normal leading-[22px] sm:leading-[24px] lg:leading-[28px] tracking-[0.005em] opacity-50 text-[#272D55]"
                style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
              >
                {section.description}
              </p>
            </div>
          ))}
      </section>

      {/* Local styles for professional motion */}
      <style>
        {`
          .about-two-card {
            opacity: 0;
            transform: translateY(16px);
            animation: aboutTwoFadeUp 0.6s ease-out forwards;
          }

          .about-two-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
          }

          .about-two-icon {
            transition: transform 0.35s ease-out;
          }

          .about-two-card:hover .about-two-icon {
            transform: translateY(-4px) scale(1.05);
          }

          @keyframes aboutTwoFadeUp {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Abouttwo;
