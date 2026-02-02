import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Hometwo from '../components/Hometwo';
import Homethree from '../components/Homethree';
import Homefour from '../components/Homefour';
import Homefive from '../components/Homefive';
import Homesix from '../components/Homesix';
import Homeseven from '../components/Homeseven';
import HomeFaqs from '../components/HomeFaqs';
import Homecta from '../components/Homecta';
import Footer from '../components/Footer';

interface HomeProps {
  onLoginClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Hero />
      <Hometwo />
      <Homethree />
      <Homefour />
      <Homefive />
      <Homesix />
      <Homeseven />
      <HomeFaqs />
      <Homecta />
      <Footer />
    </div>
  );
};

export default Home;
