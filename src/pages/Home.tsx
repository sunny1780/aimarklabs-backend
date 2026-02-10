import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Hometwo from '../components/Hometwo';
import Homethree from '../components/Homethree';
import Homefour from '../components/Homefour';
import Homefive from '../components/Homefive';
import Homesix from '../components/Homesix';
import Homeseven from '../components/Homeseven';
import HomeFaqs from '../components/HomeFaqs';
import HomeBlog from '../components/HomeBlog';
import Homecta from '../components/Homecta';
import Footer from '../components/Footer';

interface HomeProps {
  onLoginClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick }) => {
  const nextRef = useRef<HTMLDivElement>(null);
  const nextInView = useInView(nextRef, { amount: 0.35, margin: '0px 0px -20% 0px' });

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <Hero nextInView={nextInView} />
      <div ref={nextRef}>
        <Hometwo nextInView={nextInView} />
      </div>
      <Homethree />
      <Homefour />
      <Homefive />
      <Homesix />
      <Homeseven />
      <HomeFaqs />
      <HomeBlog />
      <Homecta />
      <Footer />
    </div>
  );
};

export default Home;
