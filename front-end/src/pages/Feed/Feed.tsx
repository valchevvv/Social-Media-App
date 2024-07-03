import { useEffect, useState } from 'react';

import { get } from '../../helper/axiosHelper'
import PostCard from './PostCard';

const Feed = () => {
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

export default Feed;