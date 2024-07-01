import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const HomePage = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      HomePage
      <button className='bg-black text-white rounded p-2' onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;