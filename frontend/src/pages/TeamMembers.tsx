import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TeamMembersProps {
  onLoginClick: () => void;
}

type TeamMember = {
  name: string;
  title: string;
};

const teamMembers: TeamMember[] = [
  { name: 'Misty Farghaly', title: 'CEO' },
  { name: 'Ali Chishti', title: 'CFO' },
  { name: 'Mohammad Farghaly', title: 'Client Relations' }, 
  { name: 'Syed Farhan Ali', title: 'React Developer' },
  { name: 'Daniyal Akhtar', title: 'Video Editor' },
  { name: 'Amna Tahir', title: 'Wordpress Developer' },
  { name: 'Rida Fatima', title: 'Ui/Ux Designer' },
  { name: 'Eragge', title: 'Social Media Manager' },
  { name: 'Maria', title: 'UI/UX Designer' },
  { name: 'Yusra Khan', title: 'Associate AI Engineer' },
  { name: 'Asma Ijaz', title: 'Sr React Native Developer' },
  { name: 'Abdullah Tahir', title: 'Associate QA Engineer' },
  { name: 'Hamnah Anwar', title: 'Project Manager' },
  { name: 'Mudassir', title: 'Sr React Native Developer' },
  { name: 'Muhammad Hassan', title: 'Sr React Native Developer' },
 { name: 'Amjad Ali', title: 'Operations Manager' },
   { name: 'Saman Shahzad', title: 'QA Intern' },
     { name: 'Itrat Batool', title: 'Project Manager' },
        { name: 'Areeba ', title: 'HR' },
         { name: '  Javeria Bashir ', title: 'Marketing Manager' },
        { name: 'Kamran Iqbal ', title: 'Associate AI engineer' },
         { name: 'Faizan Rasool ', title: 'Frontend Developer' },
{ name: 'Hamna ', title: 'Content Writer' },
{ name: 'Hazeema ', title: 'Associate QA Engineer' },
];

const teamProfileImages = [
  '/images/team/Mistyyy.png',
  '/images/team/AALI.png',
  '/images/team/Muhamma.png',
   '/images/team/Farhan.png',
  '/images/team/Daniyal.png',
  // '/images/team/Ellipse (5).png',
  // '/images/team/Ellipse (6).png',
  '/images/team/Amna.png',
  '/images/team/Profile.png',
  '/images/team/Eragge@2x.png',
  '/images/team/Marea.png',
  '/images/team/Yusra.png',
  '/images/team/Asma.png',
  '/images/team/Abdullah.png',
  '/images/team/Hamna.png',
  '/images/team/Mudassir.png',
  '/images/team/Hassan.png',
  '/images/team/Amjad.png',
  '/images/team/Saman.png',
  '/images/team/Kamran.png',
  '/images/team/Areeba.png',
    '/images/team/Javeria.png',
  '/images/team/Kamran (1).png',
  '/images/team/Faizan.png',
  '/images/team/Hamna Muneer.png',
  '/images/team/Hazeema.png',
];

const displayedTeam = teamProfileImages.map((image, index) => {
  const member = teamMembers[index];
  return {
    name: member?.name ?? `Team Member ${index + 1}`,
    title: member?.title ?? 'AI Mark Labs',
    image,
  };
});

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
            {displayedTeam.map((member) => (
              <article
                key={`${member.name}-${member.title}`}
                className="rounded-2xl p-5 text-center"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden">
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
