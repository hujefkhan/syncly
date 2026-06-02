import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Explore from './pages/Explore';
import PostPage from "./pages/PostPage";
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CommunityGuidelines from './pages/CommunityGuidelines';
import About from './pages/About';

import AppLayout from './layouts/AppLayout';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-brand-600">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const fetchMe = useAuth(s => s.fetchMe);
  useEffect(() => { fetchMe(); }, [fetchMe]);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
<Route
  path="/verify-email"
  element={<VerifyEmail />}
/>

<Route
  path="/privacy"
  element={<PrivacyPolicy />}
/>

<Route
  path="/terms"
  element={<TermsOfService />}
/>

<Route
  path="/guidelines"
  element={<CommunityGuidelines />}
/>

<Route
  path="/about"
  element={<About />}
/>
      <Route element={<Protected><AppLayout /></Protected>}>

        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:conversationId" element={<Messages />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
