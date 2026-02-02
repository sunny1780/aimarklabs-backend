import React from 'react';
import Navbar from '../components/Navbar';
import Abouttwo from '../components/Abouttwo';
import Aboutthree from '../components/Aboutthree';
import AboutFour from '../components/AboutFour';
import Team from '../components/Team';

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
      <Team />
    </div>
  );
};

export default Aboutus;
