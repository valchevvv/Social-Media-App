import { useContext, useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import Posts from './Posts';
import { useLocation } from 'react-router-dom';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { get } from '../../helper/axiosHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { Post } from '../../helper/interfaces';
import { SocketIoHelper, getSocketIoHelperInstance } from '../../helper/socketIoHelper'; // Adjust path as per your project structure

import profile_picture from '../../assets/profile_picture.png';

interface UserInfo {
  _id: string;
  username: string;
  name: string;
  email: string;
  stats: { posts: number; followers: number; following: number };
  bio: string;
  profilePicture: string;
  posts: Post[];
}

const ProfilePage = () => {
  const location = useLocation();
  const profileId = location.pathname.split('/')[2];
  const { startLoading, stopLoading } = useLoadingSpinner();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { user } = useContext(AuthContext);

  const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);

  useEffect(() => {
    if (!user?._id) {
      setSocketIoHelper(null);
    } else {
      const socketHelper = getSocketIoHelperInstance();
      setSocketIoHelper(socketHelper);
    }
  }, [user?._id]);

  useEffect(() => {
    startLoading();
    get(`users/${profileId}`)
      .then((response) => {
        if (!response) {
          console.error('Failed to fetch user info');
          return;
        }
        setUserInfo({
          _id: response._id,
          username: response.username,
          email: response.email,
          name: response.name,
          stats: {
            posts: response.posts.length,
            followers: response.followers.length,
            following: response.following.length,
          },
          bio: response.bio || '',
          profilePicture: response.profilePicture || profile_picture,
          posts: response.posts,
        });
        // Assuming response.followers and response.following are arrays of user IDs
        setFollowing(response.followers.includes(user?._id));
        setFollowed(response.following.includes(user?._id));
      })
      .catch((error) => console.log(error))
      .finally(() => stopLoading());
  }, [profileId, user?._id]);

  const [following, setFollowing] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !userInfo || !socketIoHelper) return;

    const handleFollowed = (data: {
      sender: string; reciever: string; followStatus: string, notifyDetails: {
        follow: boolean,
        followed: boolean,
        sender: {
          id: string,
          username: string,
        },
        reciever: {
          id: string,
          username: string,
        }
      }
    }) => {
      if (data.sender === user._id && data.reciever === userInfo._id) {
        setFollowing(data.followStatus === 'followed');
        updateStatsOnFollow(data.followStatus === 'followed', 'followers');
      }
      if (data.sender === userInfo._id && data.reciever === user._id) {
        updateStatsOnFollow(data.followStatus === 'followed', 'following');
      }
    };

    const updateStatsOnFollow = (isFollowed: boolean, statType: 'followers' | 'following') => {
      setUserInfo((prev) => {
        if (prev) {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              [statType]: isFollowed ? prev.stats[statType] + 1 : prev.stats[statType] - 1,
            },
          };
        }
        return prev;
      });
    };

    socketIoHelper.on('followed_f', handleFollowed);

    return () => {
      socketIoHelper.off('followed_f', handleFollowed);
    };
  }, [socketIoHelper, user, userInfo, location.pathname]);

  const handleFollowClick = () => {
    if (!user || !userInfo || location.pathname === '/profile/me' || !socketIoHelper) return;
    socketIoHelper.follow(userInfo._id); // Emit follow event using SocketIoHelper
    setFollowing(!following); // Update following state locally
  };

  return (
    <div className="w-full mx-auto mt-8">
      {userInfo && userInfo?.username && (
        <>
          <UserInfo
            self={(profileId === 'me')}
            following={following}
            followed={followed}
            onFollow={handleFollowClick}
            username={userInfo.username}
            email={userInfo.email}
            name={userInfo.name}
            stats={userInfo.stats}
            bio={userInfo.bio}
            profilePicture={userInfo.profilePicture}
          />
          <Posts posts={userInfo.posts} />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
