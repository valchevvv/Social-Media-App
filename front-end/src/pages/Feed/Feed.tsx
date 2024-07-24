/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';

import { get } from '../../helper/axiosHelper'
import PostCard from './PostCard';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { getSocketIoHelperInstance, SocketIoHelper } from '../../helper/socketIoHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { Post } from '../../helper/interfaces';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { startLoading, stopLoading } = useLoadingSpinner();
  const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?._id) {
      setSocketIoHelper(null);
    } else {
      const socketHelper = getSocketIoHelperInstance('http://localhost:5001');
      setSocketIoHelper(socketHelper);
    }
  }, [user?._id]);

  const updateLikes = (data: { sender: {
    id: string,
    username: string
  }, post: string, likeStatus: string }) => {
    const updated = posts.map((post: Post ) => {
      if (post._id === data.post) {
        if(data.likeStatus === "liked" && !post.likes.includes(data.sender.id)) post.likes.push(data.sender.id);
        if(data.likeStatus === "unliked") post.likes = post.likes.filter((like) => like !== data.sender.id);
      }
      return post;
    });
    setPosts(updated);
  }

  useEffect(() => {
    if (!user || !socketIoHelper || !posts) return;

    socketIoHelper.on('like_f', (data) => {
      updateLikes(data);
    });


    return () => {
      socketIoHelper.off('like_f',  () => {});
    };
  }, [socketIoHelper, user, location.pathname, posts]);

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

  const likePost = (post: Post) => {
    socketIoHelper?.emit('like_b', { userId: user?._id, postId: post._id });
  }

  const commentPost = (post: string, content: string) => {
    socketIoHelper?.emit('comment_b', { userId: user?._id, postId: post, content: content });
  }

  return (
    <div className='justify-center pb-24'>
      {
        posts && posts.map((post, index) => (
          <PostCard 
            key={index} 
            postData={post} 
            onLike={() => likePost(post)}
            onComment={(postId, content) => commentPost(postId, content)} 
          />
        ))
      }
    </div>
  );
};

export default Feed;