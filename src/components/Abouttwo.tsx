import React from 'react';
import { FaUsers, FaPalette, FaChartLine, FaGlobe } from 'react-icons/fa6';

const Abouttwo = () => {
  const sections = [
    {
      bg: '#F7F9FB',
      icon: FaUsers,
      title: 'Creative Team',
      description: 'Skilled experts in strategy & content.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-600',
      iconColor: 'text-gray-800',
    },
    {
      bg: '#F29335',
      icon: FaPalette,
      title: 'Unique Ideas',
      description: 'Fresh concepts tailored to your brand.',
      textColor: 'text-white',
      descColor: 'text-white/90',
      iconColor: 'text-white',
    },
    {
      bg: '#F7F9FB',
      icon: FaChartLine,
      title: 'Proven Growth',
      description: 'Data-backed campaigns with real impact.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-600',
      iconColor: 'text-gray-800',
    },
    {
      bg: '#B3BDEF',
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Strategies that expand your audience.',
      textColor: 'text-gray-900',
      descColor: 'text-gray-800',
      iconColor: 'text-gray-800',
    },
  ];

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      {sections.map((section, index) => {
        const IconComponent = section.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center p-8 lg:p-10 min-h-[280px] transition-all duration-300 hover:opacity-95"
            style={{ backgroundColor: section.bg }}
          >
            <div className={`mb-4 ${section.iconColor || 'text-gray-800'}`}>
              <IconComponent className="w-12 h-12" />
            </div>
            <h3 className={`font-bold text-lg lg:text-xl mb-2 ${section.textColor}`}>
              {section.title}
            </h3>
            <p className={`text-sm lg:text-base ${section.descColor}`}>
              {section.description}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default Abouttwo;
