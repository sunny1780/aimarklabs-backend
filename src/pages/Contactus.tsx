import React from 'react';
import Navbar from '../components/Navbar';

interface ContactusProps {
  onLoginClick: () => void;
}

const Contactus: React.FC<ContactusProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <div className="py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600">Contact page content coming soon.</p>
      </div>
    </div>
  );
};

export default Contactus;
