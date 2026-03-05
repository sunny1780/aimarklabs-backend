import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Marketingcta from '../components/Marketingcta';
import MarketingHero from '../components/MarketingHero';
import MarketingOfferingsSection from '../components/MarketingOfferingsSection';
import PerformanceMarketing from '../components/PerformanceMarketing';
import MarketingFaqs from '../components/MarketingFaq';
import MarketingBlog from '../components/MarketingBlog';
import BlogExtra from '../components/BlogExtra';

interface MarketingServicesProps {
  onLoginClick: () => void;
}

const MarketingServices: React.FC<MarketingServicesProps> = ({
  onLoginClick
}) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB] overflow-x-hidden">
      <Navbar onLoginClick={onLoginClick} />

      <main>
        <MarketingHero />
        <PerformanceMarketing/>
        <MarketingOfferingsSection />
        <MarketingFaqs/>
      
        <MarketingBlog/>
        <BlogExtra/>
      </main>

      <Marketingcta/>
      <Footer />
    </div>
  );
};

export default MarketingServices;
