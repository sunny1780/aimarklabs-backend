import React from 'react';
import Navbar from '../components/Navbar';
import Abouttwo from '../components/Abouttwo';
import Aboutthree from '../components/Aboutthree';
import AboutFour from '../components/AboutFour';

interface AboutusProps {
  onLoginClick: () => void;
}

const Aboutus: React.FC<AboutusProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Abouttwo />
      <Aboutthree />
      <AboutFour />
    </div>
  );
};

export default Aboutus;
