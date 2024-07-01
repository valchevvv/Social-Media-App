import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Home from './pages/HomePage';
import Auth from './pages/AuthPage';

const RouterSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);
  const user = context?.user;

  console.log("user", user);

  useEffect(() => {
    if (!user && !location.pathname.startsWith('/auth')) {
      navigate('/auth');
    } else if (user && location.pathname.startsWith('/auth')) {
      navigate('/');
    }
  }, [user, navigate, location.pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <RouterSetup />
        <Routes>
          <Route path="/auth/:type" element={<Auth />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;