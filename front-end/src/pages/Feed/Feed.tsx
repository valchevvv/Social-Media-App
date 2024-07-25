/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { get } from '../../helper/axiosHelper';
import PostCard from './PostCard';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { getSocketIoHelperInstance, SocketIoHelper } from '../../helper/socketIoHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { Post } from '../../helper/interfaces';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const { startLoading, stopLoading } = useLoadingSpinner();
  const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);
  const { user } = useContext(AuthContext);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!user?._id) {
      setSocketIoHelper(null);
    } else {
      const socketHelper = getSocketIoHelperInstance();
      setSocketIoHelper(socketHelper);
    }
  }, [user?._id]);

  const updateLikes = (data: { sender: { id: string, username: string }, post: string, likeStatus: string }) => {
    const updated = posts.map((post: Post) => {
      if (post._id === data.post) {
        if (data.likeStatus === "liked" && !post.likes.includes(data.sender.id)) post.likes.push(data.sender.id);
        if (data.likeStatus === "unliked") post.likes = post.likes.filter((like) => like !== data.sender.id);
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
      socketIoHelper.off('like_f', () => { });
    };
  }, [socketIoHelper, user, location.pathname, posts]);

  const loadPosts = (page: number) => {
    startLoading();
    get(`post/paginated?page=${page}&limit=10`)
      .then(response => {
        setPosts(prevPosts => [...prevPosts, ...response]);
      })
      .catch(error => {
        console.error('Failed to get posts:', error);
      }).finally(() => stopLoading());
  }

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView]);

  const likePost = (post: Post) => {
    socketIoHelper?.emit('like_b', { userId: user?._id, postId: post._id });
  }

  const commentPost = (post: string, content: string) => {
    socketIoHelper?.emit('comment_b', { userId: user?._id, postId: post, content: content });
  }

  return (
    <div className='justify-center scroll-smooth pb-24'>
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
      <div ref={ref} />
    </div>
  );
};

export default Feed;
