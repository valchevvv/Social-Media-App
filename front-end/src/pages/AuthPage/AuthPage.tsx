import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the import path as needed
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { get, post } from '../../helper/axiosHelper'
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Assuming login function is provided by AuthContext
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const { startLoading, stopLoading } = useLoadingSpinner();
  
  useEffect(() => {
    if (location.pathname === '/auth/login') setIsLogin(true)
    else if (location.pathname === '/auth/register') setIsLogin(false)
    else navigate('/auth/login')
  }, [location]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      startLoading();
      if (isLogin) {
        response = await get('users/login', {
          username,
          password
        });
      } else {
        response = await post('users/register', {
          username,
          email,
          password
        });
      }
      stopLoading();
      if (!response || !response.token) {
        console.error('Login failed:', response.data.error);
        return;
      }

      login(response.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center laptop:py-12">
      <div className="relative py-3 laptop:max-w-xl laptop:mx-auto">
        <div
          className="laptop:absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 laptop:skew-y-0 laptop:-rotate-6 laptop:rounded-3xl">
        </div>
        <div className="relative px-4 laptop:py-10 laptop:bg-white laptop:shadow-lg laptop:rounded-3xl laptop:p-20">

          <div className="max-w-md mx-auto">
            <div>
              <h1 className="lg:text-2xl lg:inline flex justify-center  text-4xl  font-semibold">{isLogin ? "Login" : "Register"}</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="px-10 laptop:px-0 py-8 text-base leading-6 space-y-4 text-gray-700 laptop:text-lg laptop:leading-7">
                <div className="relative">
                  <input autoComplete="off" required id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-100 laptop:bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" />
                  <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                </div>
                {
                  !isLogin &&
                  <div className="relative">
                    <input autoComplete="off" required id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 laptop:bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="E-mail" />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">E-mail</label>
                  </div>
                }
                <div className="relative">
                  <input autoComplete="off" required id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 laptop:bg-white mt-2 laptop:mt-0 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                  <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-4 laptop:peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                </div>
                <div className="flex justify-center pt-2">
                  <button type='submit' className="bg-cyan-500 text-white rounded-md text-base px-5 py-2 laptop:px-2 laptop:py-1">{isLogin ? "Login" : "Register"}</button>
                </div>
                <div className='flex justify-center'>
                  <Link to={`/auth/${(!isLogin ? "login" : "register")}`} className="text-cyan-500 text-base hover:text-cyan-600 transition duration-200 ease-in-out">{!isLogin ? "Login" : "Register"}</Link>
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