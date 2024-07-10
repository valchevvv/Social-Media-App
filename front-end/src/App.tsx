import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useLoadingSpinner } from './contexts/LoadingSpinnerContext';
import Feed from './pages/Feed';
import Auth from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';
import PostPage from './pages/PostPage';
import LoadingSpinner from './components/LoadingSpinner';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFound';
import PostPreview from './pages/ProfilePage/PostPreview';
import { IoIosArrowBack } from 'react-icons/io';

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
      }
      else if(user && location.pathname.startsWith('/auth')) {
        navigate('/');
      }
    }
  }, [user, navigate, location.pathname, isAuthLoading]);

  return null;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`App ${(user ? "laptop:flex" : "hidden")}`}>
      {user && <Sidebar />}
      {user && <Navigation />}
      <div className="content flex flex-col justify-center items-center p-0 laptop:p-5 w-full h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile" element={<Navigate to={'/profile/me'} />} />
          <Route path="/post/:id" element={<PostPreview />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const { isLoading } = useLoadingSpinner();
  const { isAuthLoading } = useContext(AuthContext);

  return (
    <Router>
      <AuthChecker />
      {isLoading && <LoadingSpinner />}
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
