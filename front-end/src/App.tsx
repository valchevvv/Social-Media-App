import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Home from './pages/HomePage';
import Auth from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';

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

  return (
    <Router>
      <RouterSetup />
      <Routes>
        <Route path="/auth/:type" element={<Auth />} />
      </Routes>
      <div className={`App ${(user ? "sm:flex" : "hidden")} sm:flex-row`}>
        <div className="sidebar">
          {user && <Sidebar />}
        </div>
        {user && <Navigation />}
        <div className="content p-0 pb-[50px] sm:p-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;