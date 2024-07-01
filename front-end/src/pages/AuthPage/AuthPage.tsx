import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the import path as needed
import axios from 'axios'; // Import Axios

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Assuming login function is provided by AuthContext

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
      if(!response.data || !response.data.token) {
        console.error('Login failed:', response.data.error);
        return;
      }

      login(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default AuthPage;