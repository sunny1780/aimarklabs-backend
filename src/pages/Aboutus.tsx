import React from 'react';
import Navbar from '../components/Navbar';
import AboutHero from '../components/AboutHero';
import Abouttwo from '../components/Abouttwo';
import Aboutthree from '../components/Aboutthree';
import AboutFour from '../components/AboutFour';
import Team from '../components/Team';
import Footer from '../components/Footer';
import AboutCta from '../components/AboutCta';
// data
interface AboutusProps {
  onLoginClick: () => void;
}

const Aboutus: React.FC<AboutusProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <AboutHero />
      <Abouttwo />
      <Aboutthree />
      <AboutFour />
      <Team />
      <AboutCta/>
      <Footer />
    </div>
  );
};

export default Aboutus;
