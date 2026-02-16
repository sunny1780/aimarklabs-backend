import React, { useEffect, useRef, useState } from 'react';
import { LayoutGroup, useInView } from 'framer-motion';
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
  // Hysteresis: enter at a higher threshold, exit at a lower threshold.
  // This prevents rapid toggling near a single boundary.
  const enterInView = useInView(nextRef, { amount: 0.45, margin: '0px 0px -20% 0px' });
  const exitInView = useInView(nextRef, { amount: 0.2, margin: '0px 0px -20% 0px' });
  const [nextInView, setNextInView] = useState(false);

  useEffect(() => {
    if (!nextInView && enterInView) {
      setNextInView(true);
    }
    if (nextInView && !exitInView) {
      setNextInView(false);
    }
  }, [enterInView, exitInView, nextInView]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar onLoginClick={onLoginClick} />
      <LayoutGroup id="home-shared-video-group">
        <Hero nextInView={nextInView} />
        <div ref={nextRef}>
          <Hometwo nextInView={nextInView} />
        </div>
      </LayoutGroup>
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
