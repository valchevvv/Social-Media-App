import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useSidebarContext } from "../../contexts/SidebarContext";

import { get } from '../../helper/axiosHelper'
import PostCard from './PostCard';

const HomePage = () => {
  const { logout } = useContext(AuthContext);
  const { toggleSidebar } = useSidebarContext();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    get('post')
      .then(response => {
        setPosts(response);
      })
      .catch(error => {
        console.error('Failed to get user:', error);
      })
  }, [])

  return (
    <div>
      {
        posts && posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))
      }
    </div>
  );
};

export default HomePage;