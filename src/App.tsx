import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminClientDashboard from './AdminClientDashboard';
import AdminDashboard from './AdminDashboard';
import AdminAccount from './AdminAccount';
import AnalyticsDashboard from './AnalyticsDashboard';
import Login from './components/ Login';
import SignUp from './components/SignUp';
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Blog from './pages/Blog';
import Industries from './pages/Industries';
import UiUx from './pages/UiUx';

const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Login
      onGoToSignUp={() => navigate('/signup')}
      onLoginSuccess={() => navigate('/dashboard')}
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/contact" element={<ContactRoute />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/industries" element={<IndustriesRoute />} />
        <Route path="/services/ui-ux" element={<UiUxRoute />} />
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
