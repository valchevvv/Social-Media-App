import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Feed from './pages/Feed';
import Auth from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';
import PostPage from './pages/PostPage';
import { useLoadingSpinner } from './contexts/LoadingSpinnerContext';
import LoadingSpinner from './components/LoadingSpinner';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/ProfilePage/Edit';

const RouterSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyToken } = useContext(AuthContext);

  useEffect(() => {
    verifyToken();
    if (!user && !location.pathname.startsWith('/auth')) {
      navigate('/auth/login');
    } else if (user && location.pathname.startsWith('/auth')) {
      navigate('/');
    }
  }, [user, navigate, location.pathname]);

  return null;
};

const App = () => {
  const { user } = useContext(AuthContext);
  const { isLoading } = useLoadingSpinner();

  return (
    <Router>
      <RouterSetup />
      {isLoading && <LoadingSpinner />}
      <Routes>
        <Route path="/auth/:type" element={<Auth />} />
      </Routes>
      <div className={`App ${(user ? "laptop:flex" : "hidden")}`}>
        <div className="sidebar">
          {user && <Sidebar />}
        </div>
        {user && <Navigation />}
        <div className="content flex justify-center items-center p-0 laptop:p-5 w-full h-full">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;