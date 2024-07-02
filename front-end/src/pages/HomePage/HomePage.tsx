import { useEffect, useState } from 'react';

import { get } from '../../helper/axiosHelper'
import PostCard from './PostCard';

const HomePage = () => {
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
    <div className='justify-center'>
      {
        posts && posts.map((post, index) => (
          <PostCard key={index} postData={post} />
        ))
      }
    </div>
  );
};

export default HomePage;