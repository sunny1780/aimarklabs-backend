import React from 'react';
import Navbar from '../components/Navbar';
import Abouttwo from '../components/Abouttwo';
import Aboutthree from '../components/Aboutthree';

interface AboutusProps {
  onLoginClick: () => void;
}

const Aboutus: React.FC<AboutusProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Abouttwo />
      <Aboutthree />
    </div>
  );
};

export default Aboutus;
