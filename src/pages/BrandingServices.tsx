import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Servicehero from '../components/Servicehero';
import Homecta from '../components/Homecta';

interface BrandingServicesProps {
  onLoginClick: () => void;
}

const BrandingServices: React.FC<BrandingServicesProps> = ({
  onLoginClick
}) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Servicehero />
      <Homecta />
      <Footer />
    </div>
  );
};

export default BrandingServices;
