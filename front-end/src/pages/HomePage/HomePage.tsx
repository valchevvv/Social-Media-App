import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useSidebarContext } from "../../contexts/SidebarContext";

const HomePage = () => {
  const { logout } = useContext(AuthContext);
  const { toggleSidebar } = useSidebarContext();

  return (
    <div>
      HomePage
      <button className='bg-black text-white rounded p-2' onClick={logout}>Logout</button>
      <button className='bg-black text-white rounded p-2' onClick={toggleSidebar}>Toggle Sidebar</button>
    </div>
  );
};

export default HomePage;