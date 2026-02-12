import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Homecta from '../components/Homecta';

interface MarketingServicesProps {
  onLoginClick: () => void;
}

const marketingServices = [
  {
    title: 'Performance Marketing',
    description:
      'Run conversion-focused campaigns across Meta, Google, and YouTube with data-backed optimization.',
  },
  {
    title: 'SEO Strategy',
    description:
      'Improve organic visibility with technical audits, on-page optimization, and content planning.',
  },
  {
    title: 'Social Media Growth',
    description:
      'Build stronger brand presence using platform-specific content systems and community engagement.',
  },
  {
    title: 'Marketing Analytics',
    description:
      'Track what matters with clear dashboards, event tracking, and actionable performance insights.',
  },
];

const MarketingServices: React.FC<MarketingServicesProps> = ({
  onLoginClick
}) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Navbar onLoginClick={onLoginClick} />

      <main>
        <section className="bg-[#1D2255] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-sm font-medium">
              Marketing
            </span>
            <h1 className="mt-6 text-white text-4xl sm:text-5xl lg:text-[68px] leading-[1.05] font-semibold">
              Marketing Services
            </h1>
            <p className="mt-4 text-white/80 text-base sm:text-lg max-w-3xl mx-auto">
              We design full-funnel marketing systems that attract qualified traffic, improve conversion rates, and
              drive sustainable growth.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {marketingServices.map((service) => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-[#D9DFEA] bg-white p-6 sm:p-7"
                >
                  <h2 className="text-[#1A1F26] text-2xl font-semibold">{service.title}</h2>
                  <p className="mt-3 text-[#5A666E] text-base leading-relaxed">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Homecta />
      <Footer />
    </div>
  );
};

export default MarketingServices;
