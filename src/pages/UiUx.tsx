import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Servicehero from '../components/Servicehero';
import UiUxOverview from '../components/UiUxOverview';
import Creativeoffering from '../components/Creativeoffering';
import Creativefaq from '../components/Creativefaq';
import Creativeblog from '../components/Creativeblog';
import Homecta from '../components/Homecta';

interface UiUxProps {
  onLoginClick: () => void;
}

const UiUx: React.FC<UiUxProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Servicehero/>
      <UiUxOverview />
      <Creativeoffering />
      <Creativefaq />
      <Creativeblog />
      <Homecta />

      <Footer />
    </div>
  );
};

export default UiUx;
