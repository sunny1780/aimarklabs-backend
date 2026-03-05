import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Brandingcta from '../components/Brandingcta';
import BrandingHero from '../components/BrandingHero';
import BrandArchitectureSection from '../components/BrandArchitectureSection';
import BrandingOfferingsSection from '../components/BrandingOfferingsSection';
import Brandingfaq from '../components/Brandingfaq';
import Brandingblogs from '../components/Brandingblogs';

interface BrandingServicesProps {
  onLoginClick: () => void;
}

const BrandingServices: React.FC<BrandingServicesProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB] overflow-x-hidden">
      <Navbar onLoginClick={onLoginClick} />
      <BrandingHero />
      <BrandArchitectureSection />
      <BrandingOfferingsSection />
      <Brandingfaq />
      <Brandingblogs />
      <Brandingcta />
      <Footer />
    </div>
  );
};

export default BrandingServices;
