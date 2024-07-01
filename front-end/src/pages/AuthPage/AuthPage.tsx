import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the import path as needed
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Assuming login function is provided by AuthContext
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if(location.pathname === '/auth/login') setIsLogin(true)
    else if(location.pathname === '/auth/register') setIsLogin(false)
    else navigate('/auth/login')
  }, [location]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace 'your_auth_endpoint' with your actual authentication endpoint
      console.log(`localhost:5000/api/users/login?username=${username}&password=${password}`)
      const response = await axios.get(`http://localhost:5000/api/users/login?username=${username}&password=${password}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.data || !response.data.token) {
        console.error('Login failed:', response.data.error);
        return;
      }

      login(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input autoComplete="off" required id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" />
                  <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                </div>
                <div className="relative">
                  <input autoComplete="off" required id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                  <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                </div>
                <div className="flex justify-center pt-2">
                  <button type='submit' className="bg-cyan-500 text-white rounded-md px-2 py-1">{isLogin ? "Login" : "Register"}</button>
                </div>
                <div className='flex justify-center'>
                  <Link to={`/auth/${(!isLogin ? "login" : "register")}`} className="text-cyan-500 hover:text-cyan-600 transition duration-200 ease-in-out">{!isLogin ? "Login" : "Register"}</Link>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;