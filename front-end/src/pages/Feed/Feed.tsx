/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../contexts/AuthContext';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { useSidebarContext } from '../../contexts/SidebarContext';
import { get } from '../../helper/axiosHelper';
import { Post } from '../../helper/interfaces';
import { SocketIoHelper, getSocketIoHelperInstance } from '../../helper/socketIoHelper';
import PostCard from './PostCard';
import ProfileCard, { ProfileCardProps } from './ProfileCard';
import { useInView } from 'react-intersection-observer';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const { isCollapsed } = useSidebarContext();
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

  const updateLikes = (data: {
    sender: { id: string; username: string };
    post: string;
    likeStatus: string;
  }) => {
    const updated = posts.map((post: Post) => {
      if (post._id === data.post) {
        if (data.likeStatus === 'liked' && !post.likes.includes(data.sender.id))
          post.likes.push(data.sender.id);
        if (data.likeStatus === 'unliked')
          post.likes = post.likes.filter(like => like !== data.sender.id);
      }
      return post;
    });
    setPosts(updated);
  };

  useEffect(() => {
    if (!user || !socketIoHelper || !posts) return;

    socketIoHelper.on('like_f', data => {
      updateLikes(data);
    });

    return () => {
      socketIoHelper.off('like_f', () => {});
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
      })
      .finally(() => stopLoading());
  };

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
  };

  const commentPost = (post: string, content: string) => {
    socketIoHelper?.emit('comment_b', { userId: user?._id, postId: post, content: content });
  };

  const [people, setPeople] = useState<ProfileCardProps[]>([]);

  useEffect(() => {
    startLoading();
    get('users/people-you-know')
      .then(response => {
        setPeople(response);
      })
      .finally(() => stopLoading());
  }, []);

  return (
    <div className="flex flex-row w-full justify-center gap-20">
      {/* <div className='mobile:hidden sticky top-9 w-[20%] h-full text-white rounded-lg p-10 bg-black shadow-xl'>
        asd
      </div> */}
      <div
        className={`${people.length > 0 ? 'laptop:ml-[20%]' : ''} flex flex-col items-center scroll-smooth pb-24`}
      >
        {posts &&
          posts.map((post, index) => (
            <PostCard
              key={index}
              postData={post}
              onLike={() => likePost(post)}
              onComment={(postId, content) => commentPost(postId, content)}
            />
          ))}
        <div ref={ref} />
      </div>
      {people && people.length > 0 && (
        <div
          className={`mobile:hidden tablet:hidden laptop:block sticky top-9 ${isCollapsed ? 'laptop:w-[30%] desktop:w-[20%]' : 'laptop:w-[45%] desktop:w-[25%]'} h-full rounded-lg px-10 p-10 shadow-2xl flex flex-col gap-2`}
        >
          <span className="font-semibold">People you may know</span>
          <hr />
          <div className="flex flex-col gap-4 mt-2">
            {people.map((person, index) => (
              <ProfileCard
                _id={person._id}
                name={person.name}
                username={person.username}
                profilePicture={person.profilePicture}
                key={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
