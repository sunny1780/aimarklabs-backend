import React from 'react';
import Navbar from '../components/Navbar';
import BlogHero from '../components/BlogHero';
import BlogCards from '../components/BlogCards';
import Homecta from '../components/Homecta';
import Footer from '../components/Footer';

interface BlogProps {
  onLoginClick: () => void;
}

const Blog: React.FC<BlogProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <BlogHero />
      <BlogCards />
      <Homecta />
      <Footer />
    </div>
  );
};

export default Blog;
