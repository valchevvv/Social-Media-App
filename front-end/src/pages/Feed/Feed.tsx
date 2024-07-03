import { useEffect, useState } from 'react';

import { get } from '../../helper/axiosHelper'
import PostCard from './PostCard';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { startLoading, stopLoading } = useLoadingSpinner();

  useEffect(() => {
    startLoading();
    get('post')
      .then(response => {
        setPosts(response);
      })
      .catch(error => {
        console.error('Failed to get user:', error);
      }).finally(() => stopLoading());
  }, [])

  return (
    <div className='justify-center pb-24'>
      {
        posts && posts.map((post, index) => (
          <PostCard key={index} postData={post} />
        ))
      }
    </div>
  );
};

export default Feed;