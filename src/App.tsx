import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminClientDashboard from './AdminClientDashboard';
import AdminDashboard from './AdminDashboard';
import AdminAccount from './AdminAccount';
import AnalyticsDashboard from './AnalyticsDashboard';
import Login from './components/ Login';
import SignUp from './components/SignUp';
import CursorDot from './components/CursorDot';
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Blog from './pages/Blog';
import SEOBlog from './components/Blog/SEOBlog';
import AIKeywordResearchBlog from './components/Blog/AIKeywordResearchBlog';
import AIContentCreationBlog from './components/Blog/AIContentCreationBlog';
import Industries from './pages/Industries';
import UiUx from './pages/UiUx';
import BrandingServices from './pages/BrandingServices';
import DevelopmentServices from './pages/DevelopmentServices';
import MarketingServices from './pages/MarketingServices';
import TeamMembers from './pages/TeamMembers';
import ScrollToTop from './components/ScrollToTop';

const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Login
      onGoToSignUp={() => navigate('/signup')}
      onLoginSuccess={(destination) => navigate(destination)}
    />
  );
};

const SignUpRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SignUp
      onGoToLogin={() => navigate('/login')}
      onSignUpSuccess={(destination) => navigate(destination)}
    />
  );
};

const HomeRoute: React.FC = () => {
  const navigate = useNavigate();
  return <Home onLoginClick={() => navigate('/login')} />;
};

const AboutRoute: React.FC = () => {
  const navigate = useNavigate();
  return <Aboutus onLoginClick={() => navigate('/login')} />;
};

const ContactRoute: React.FC = () => {
  const navigate = useNavigate();
  return <Contactus onLoginClick={() => navigate('/login')} />;
};

const BlogRoute: React.FC = () => {
  const navigate = useNavigate();
  return <Blog onLoginClick={() => navigate('/login')} />;
};

const IndustriesRoute: React.FC = () => {
  const navigate = useNavigate();
  return <Industries onLoginClick={() => navigate('/login')} />;
};

const UiUxRoute: React.FC = () => {
  const navigate = useNavigate();
  return <UiUx onLoginClick={() => navigate('/login')} />;
};

const BrandingServicesRoute: React.FC = () => {
  const navigate = useNavigate();
  return <BrandingServices onLoginClick={() => navigate('/login')} />;
};

const DevelopmentServicesRoute: React.FC = () => {
  const navigate = useNavigate();
  return <DevelopmentServices onLoginClick={() => navigate('/login')} />;
};

const MarketingServicesRoute: React.FC = () => {
  const navigate = useNavigate();
  return <MarketingServices onLoginClick={() => navigate('/login')} />;
};

const TeamMembersRoute: React.FC = () => {
  const navigate = useNavigate();
  return <TeamMembers onLoginClick={() => navigate('/login')} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CursorDot />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/contact" element={<ContactRoute />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/blog/seo-in-the-age-of-ai" element={<SEOBlog />} />
        <Route path="/blog/ai-driven-keyword-research" element={<AIKeywordResearchBlog />} />
        <Route path="/blog/ai-powered-content-creation" element={<AIContentCreationBlog />} />
        <Route path="/industries" element={<IndustriesRoute />} />
        <Route path="/services/creative-services" element={<UiUxRoute />} />
        <Route path="/services/branding-services" element={<BrandingServicesRoute />} />
        <Route path="/services/development-services" element={<DevelopmentServicesRoute />} />
        <Route path="/services/marketing-services" element={<MarketingServicesRoute />} />
        <Route path="/team" element={<TeamMembersRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/account" element={<AdminAccount />} />
        <Route path="/admin/client/:slug" element={<AdminClientDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
