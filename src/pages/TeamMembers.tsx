import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TeamMembersProps {
  onLoginClick: () => void;
}

type TeamMember = {
  name: string;
  title: string;
  image: string;
};

const teamMembers: TeamMember[] = [
  { name: 'Misty Farghaly', title: 'CEO', image: '/images/misty.png' },
  { name: 'Ali Chishti', title: 'CFO', image: '/images/Ali.png' },
  { name: 'Mohammad Farghaly', title: 'Client Relations', image: '/images/Muhammad.png' },
  { name: 'Hamnah Anwar', title: 'Project Manager', image: '/images/Hamnah Anwar - Project Manager.jpeg' },
  { name: 'Hazeema Anjum', title: 'AI Intern', image: '/images/Hazeema Anjum - AI Intern.jpeg' },
  { name: 'Kamran Iqbal', title: 'Associate AI Engineer', image: '/images/Kamran Iqbal - Associate AI Engineer.jpeg' },
  { name: 'Yusra Khan', title: 'Associate AI Engineer', image: '/images/Yusra khan - Associate AI Engineer.jpeg' },
  { name: 'Muhammad Hassan', title: 'React Native Developer', image: '/images/Muhammad Hassan - React Native Developer .jpeg' },
  { name: 'Mudassir', title: 'Snr React Native Developer', image: '/images/mudassir - Snr React Native Developer .jpg' },
  { name: 'Asma Ijaz', title: 'Snr React Native Developer', image: '/images/AsmaIjaz - Snr React Native Developer .png' },
  { name: 'Amjad', title: 'QA', image: '/images/Amjad QA.jpeg' },
  { name: 'Saman Shahzad', title: 'QA', image: '/images/saman shahzad (QA).jpeg' },
];

const TeamMembers: React.FC<TeamMembersProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Navbar onLoginClick={onLoginClick} />

      <section className="px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-5 py-3 rounded-md text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] shadow-sm border border-[#B3BDEF]">
              Team Members
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-tight">
              Meet Our Full Team
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <article
                key={`${member.name}-${member.title}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{member.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamMembers;
