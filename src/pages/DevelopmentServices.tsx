import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Developmentcta from '../components/Developmentcta';
import DevelopmentHero from '../components/DevelopmentHero';
import DevelopmentInfrastructureSection from '../components/DevelopmentInfrastructureSection';
import DevelopmentOfferingsSection from '../components/DevelopmentOfferingsSection';
import DevelopmentFaqs from '../components/DevelopmentFaqs';
import DevelopmentBlogs from '../components/DevelopmentBlogs';


interface DevelopmentServicesProps {
  onLoginClick: () => void;
}

const DevelopmentServices: React.FC<DevelopmentServicesProps> = ({
  onLoginClick
}) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Navbar onLoginClick={onLoginClick} />
      <DevelopmentHero />
      <DevelopmentInfrastructureSection />
      <DevelopmentOfferingsSection />
<DevelopmentFaqs/>
<DevelopmentBlogs/>
      <Developmentcta/>
      <Footer />
    </div>
  );
};

export default DevelopmentServices;
