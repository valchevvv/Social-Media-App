// ProfilePage.tsx

import { useContext, useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import Posts from './Posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { get } from '../../helper/axiosHelper';

import profile_picture from '../../assets/profile_picture.png';
import { AuthContext } from '../../contexts/AuthContext';

import { Post } from '../../helper/interfaces';
import { SocketIoHelper } from '../../helper/socketIoHelper'; // Adjust path as per your project structure
import { notifyInfo } from '../../helper/notificationHelper';

interface UserInfo {
  _id: string;
  username: string;
  name: string;
  email: string;
  stats: { posts: number; followers: number; following: number };
  bio: string;
  profilePicture: string;
  posts: Post[]
}

const ProfilePage = () => {
  const location = useLocation();
  const profileId = location.pathname.split('/')[2];
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoadingSpinner();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { user } = useContext(AuthContext);

  const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);

  useEffect(() => {
    if (!user?._id) {
      setSocketIoHelper(null);
    } else {
      setSocketIoHelper(new SocketIoHelper('http://localhost:5001'));
    }
  }, [user?._id]);

  useEffect(() => {
    if (location.pathname.split('/')[2] === user?.username) {
      navigate('/profile/me')
    }
  }, [])

  useEffect(() => {
    startLoading();
    get(`users/${profileId}`).then((response) => {
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
      setFollowing(response.followers.includes(user?._id));
      setFollowed(response.following.includes(user?._id));
    }).catch((error) => console.log(error)).finally(() => stopLoading());
  }, [profileId, user?._id])

  const [following, setFollowing] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !userInfo || location.pathname === '/profile/me' || !socketIoHelper) return;

    const handleFollowed = (data: { sender: string, reciever: string, followStatus: string }) => {
      if (data.sender === user._id && data.reciever === userInfo._id) {
        setFollowing(data.followStatus === 'followed');
        setUserInfo((prev) => {
          if (prev) {
            return {
              ...prev,
              stats: {
                ...prev.stats,
                followers: data.followStatus === 'followed' ? prev.stats.followers + 1 : prev.stats.followers - 1
              }
            }
          }
          return prev;
        });
      }
      if (data.sender === userInfo._id && data.reciever === user._id) {
        setFollowed(data.followStatus === 'followed');
        if(data.followStatus === 'followed' && following === true) {
          notifyInfo(`${userInfo.username} followed you back`)
        } else notifyInfo(`${userInfo.username} ${(data.followStatus === "followed" ? "started" : "stopped")} following you`)
        setUserInfo((prev) => {
          if (prev) {
            return {
              ...prev,
              stats: {
                ...prev.stats,
                following: data.followStatus === 'followed' ? prev.stats.following + 1 : prev.stats.following - 1
              }
            }
          }
          return prev;
        });
      }
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
  }

  return (
    <div className="w-full mx-auto mt-8">
      {
        (userInfo && userInfo?.username) &&
        <>
          <UserInfo self={(profileId === 'me')} following={following} followed={followed} onFollow={handleFollowClick} username={userInfo.username} email={userInfo.email} name={userInfo.name} stats={userInfo.stats} bio={userInfo.bio} profilePicture={userInfo.profilePicture} />
          <Posts posts={userInfo.posts} />
        </>
      }
    </div>
  );
};

export default ProfilePage;
