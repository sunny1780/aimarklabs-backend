import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Servicehero from '../components/Servicehero';

interface UiUxProps {
  onLoginClick: () => void;
}

const UiUx: React.FC<UiUxProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Servicehero/>
  

      <Footer />
    </div>
  );
};

export default UiUx;
