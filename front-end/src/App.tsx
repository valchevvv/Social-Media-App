/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';

import LoadingSpinner from './components/LoadingSpinner';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import { AuthContext } from './contexts/AuthContext';
import { useLoadingSpinner } from './contexts/LoadingSpinnerContext';
import { useSocketIoHelper } from './hooks/useSocket';
import Auth from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import ExplorePage from './pages/ExplorePage';
import Feed from './pages/Feed';
import NotFoundPage from './pages/NotFound';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import PostPreview from './pages/ProfilePage/PostPreview';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const AuthChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyToken, isAuthLoading } = useContext(AuthContext);

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user && !location.pathname.startsWith('/auth')) {
        navigate('/auth/login');
      } else if (user && location.pathname.startsWith('/auth')) {
        navigate('/');
      }
    }
  }, [user, navigate, location.pathname, isAuthLoading]);

  return null;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`App ${user ? 'laptop:flex' : 'hidden'}`}>
      {user && <Sidebar />}
      {user && <Navigation />}
      <div className="content flex flex-col justify-center items-center p-0 w-full h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile" element={<Navigate to={'/profile/me'} />} />
          <Route path="/post/:id" element={<PostPreview />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const { isLoading } = useLoadingSpinner();
  const { isAuthLoading } = useContext(AuthContext);
  const { isLoading: socketLoading } = useSocketIoHelper();

  return (
    <Router>
      <AuthChecker />
      {(isLoading || socketLoading) && <LoadingSpinner />}
      {!isAuthLoading && (
        <Routes>
          <Route path="/auth/:type" element={<Auth />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
