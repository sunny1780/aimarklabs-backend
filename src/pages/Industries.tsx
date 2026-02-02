import React from 'react';
import Navbar from '../components/Navbar';

interface IndustriesProps {
  onLoginClick: () => void;
}

const Industries: React.FC<IndustriesProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={onLoginClick} />
      <div className="py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Industries</h1>
        <p className="text-gray-600">Industries page content coming soon.</p>
      </div>
    </div>
  );
};

export default Industries;
