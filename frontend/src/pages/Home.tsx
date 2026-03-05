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

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return isMobile;
}

const Home: React.FC<HomeProps> = ({ onLoginClick }) => {
  const isMobile = useIsMobile(768);
  const nextRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Mobile + short viewports: relaxed thresholds so video animates down (iPhone SE, 11, 12, etc.)
  const isShortViewport = viewportHeight < 700;
  const useRelaxedThresholds = isMobile || isShortViewport;
  const enterAmount = useRelaxedThresholds ? 0.05 : 0.45;
  const enterMargin = useRelaxedThresholds ? '0px 0px -30px 0px' : '0px 0px -20% 0px';

  const enterInView = useInView(nextRef, { amount: enterAmount, margin: enterMargin });
  const [nextInView, setNextInView] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [atTop, setAtTop] = useState(false);
  const committedAtRef = useRef<number>(0);
  const MIN_COMMIT_MS = 250;

  useEffect(() => {
    const onScroll = () => {
      const threshold = useRelaxedThresholds ? 50 : 80;
      setHasScrolledPastHero(window.scrollY > threshold);
      setAtTop(window.scrollY <= 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [useRelaxedThresholds]);

  useEffect(() => {
    const now = Date.now();
    if (!nextInView && hasScrolledPastHero && enterInView) {
      setNextInView(true);
      committedAtRef.current = now;
    } else if (nextInView && atTop) {
      const pastDebounce = now - committedAtRef.current > MIN_COMMIT_MS;
      if (pastDebounce) {
        setNextInView(false);
      }
    }
  }, [enterInView, hasScrolledPastHero, nextInView, atTop]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar onLoginClick={onLoginClick} />
      <LayoutGroup id="home-shared-video-group">
        <Hero nextInView={nextInView} isMobile={isMobile} />
        <div ref={nextRef}>
          <Hometwo nextInView={nextInView} isMobile={isMobile} />
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
