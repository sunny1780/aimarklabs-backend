import React from 'react';

const IndustryCards: React.FC = () => {
  const cards = [
    {
      icon: '/images/icon1.svg',
      title: 'Healthcare & Life Sciences',
      description:
        'Manages patient inquiries, automates scheduling, and ensures HIPAA-compliant communication for seamless healthcare experiences.',
    },
    {
      icon: '/images/icon2.svg',
      title: 'Finance & Banking',
      description:
        'Delivers secure account support, instant transactions, and personalized financial guidance with complete regulatory compliance.',
    },
    {
      icon: '/images/icon3.svg',
      title: 'Education & Nonprofit',
      description:
        'Streamlines enrollment, automates donor engagement, and connects communities with resources that amplify mission impact.',
    },
    {
      icon: '/images/icon4.svg',
      title: 'FMCG & Ecommerce',
      description:
        'Boosts conversions, tracks orders, and delivers personalized product recommendations that maximize customer lifetime value.',
    },
    {
      icon: '/images/icon5.svg',
      title: 'Hospitality & Facilities',
      description:
        'Automates reservations, manages guest requests, and delivers exceptional service that enhances satisfaction and loyalty.',
    },
    {
      icon: '/images/icon6.svg',
      title: 'Real Estate & Construction',
      description:
        'Qualifies leads, schedules viewings, and provides project updates that accelerate sales cycles and close deals.',
    },
  ];

  return (
    <>
      <section
        className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={card.title}
                className="industry-card group bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {/* subtle top gradient / glow */}
                <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="mx-auto h-full w-40 bg-gradient-to-b from-[#F29335]/25 to-transparent blur-2xl" />
                </div>

                <img
                  src={card.icon}
                  alt=""
                  className="industry-card-icon w-16 h-16 mb-4 object-contain"
                />
                <h3 className="industry-card-title text-lg font-bold text-[#F29335] mb-3">
                  {card.title}
                </h3>
                <p className="industry-card-text text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local styles for Industry cards motion */}
      <style>
        {`
          .industry-card {
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(18px);
            animation: industryCardFadeUp 0.6s ease-out forwards;
            transition:
              transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1),
              box-shadow 0.3s ease-out,
              background-color 0.3s ease-out;
          }

          .industry-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 22px 55px rgba(15, 23, 42, 0.16);
            background-color: #ffffff;
          }

          .industry-card-icon {
            transition: transform 0.35s ease-out, filter 0.35s ease-out;
          }

          .industry-card:hover .industry-card-icon {
            transform: translateY(-4px) scale(1.06);
            filter: drop-shadow(0 12px 22px rgba(148, 163, 184, 0.45));
          }

          .industry-card-title {
            position: relative;
          }

          .industry-card-title::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: -0.35rem;
            width: 0;
            height: 2px;
            transform: translateX(-50%);
            background: linear-gradient(90deg, #fbbf77, #f29335);
            border-radius: 9999px;
            transition: width 0.3s ease-out;
          }

          .industry-card:hover .industry-card-title::after {
            width: 60%;
          }

          @keyframes industryCardFadeUp {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes industryCardRipple {
            0% {
              transform: scale(0.9);
              opacity: 0.45;
            }
            70% {
              transform: scale(1.3);
              opacity: 0;
            }
            100% {
              transform: scale(1.3);
              opacity: 0;
            }
          }

          .industry-card:hover::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle at top, rgba(242, 147, 53, 0.08), transparent 55%);
            opacity: 1;
            animation: industryCardRipple 0.75s ease-out;
            pointer-events: none;
          }
        `}
      </style>
    </>
  );
};

export default IndustryCards;
