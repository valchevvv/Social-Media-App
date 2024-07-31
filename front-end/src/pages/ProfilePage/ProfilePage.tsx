import { useContext, useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import Posts from './Posts';
import { useLocation } from 'react-router-dom';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { get } from '../../helper/axiosHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { Post } from '../../helper/interfaces';
import profile_picture from '../../assets/profile_picture.png';
import { useSocketIoHelper } from '../../hooks/useSocket';



interface FollowData {
  sender: string;
  receiver: string;
  followStatus: string;
  notifyDetails: {
    follow: boolean;
    followed: boolean;
    sender: {
      id: string;
      username: string;
    };
    receiver: {
      id: string;
      username: string;
    };
  }
}

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
  const { socket } = useSocketIoHelper();

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
        setFollowing(response.followers.includes(user?._id));
        setFollowed(response.following.includes(user?._id));
      })
      .catch((error) => console.log(error))
      .finally(() => stopLoading());
  }, [profileId, user?._id]);

  const [following, setFollowing] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);

  

  const handleFollowed = (data: FollowData) => {
    if(!user) return;
    if(data.sender === user._id) setFollowing(data.followStatus === 'followed');
    else if(data.receiver === user._id) setFollowed(data.followStatus === 'followed');

    if(userInfo) {
      const updatedUserInfo = {...userInfo};
      if(data.sender === userInfo._id) {
        updatedUserInfo.stats.following += data.followStatus === 'followed' ? 1 : -1;
      } else if(data.receiver === userInfo._id) {
        updatedUserInfo.stats.followers += data.followStatus === 'followed' ? 1 : -1;
      }

      console.log(updatedUserInfo);

      setUserInfo(updatedUserInfo);
    }
  };

  useEffect(() => {
    if (!user || !userInfo || !socket) return;

    socket.on('followed_f', handleFollowed);

    return () => {
      socket.off('followed_f', handleFollowed);
    };
  }, [socket, user, userInfo]);

  const handleFollowClick = () => {
    if (!user || !userInfo || location.pathname === '/profile/me' || !socket) return;
    socket.emit('follow_b', {
      userId: user._id,
      followId: userInfo._id
    })  
    
    setFollowing(!following); // Update following state locally
  };

  return (
    <div className="w-full mx-auto mt-8">
      {userInfo && userInfo?.username && (
        <>
          <UserInfo
            self={(profileId === user?.username || profileId === 'me')}
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
