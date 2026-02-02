import React from 'react';
import Navbar from '../components/Navbar';
import IndustryHero from '../components/IndustryHero';
import IndustryCards from '../components/IndustryCards';
import Homecta from '../components/Homecta';
import Footer from '../components/Footer';

interface IndustriesProps {
  onLoginClick: () => void;
}

const Industries: React.FC<IndustriesProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <IndustryHero />
      <IndustryCards />
      <Homecta />
      <Footer />
    </div>
  );
};

export default Industries;
