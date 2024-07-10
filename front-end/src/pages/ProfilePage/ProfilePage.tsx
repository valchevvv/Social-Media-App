/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/ProfilePage.tsx
import { useContext, useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import Posts from './Posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { get, post } from '../../helper/axiosHelper';

import profile_picture from '../../assets/profile_picture.png';
import { AuthContext } from '../../contexts/AuthContext';

import { Post } from '../../helper/interfaces';

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

  useEffect(() => {
    if(location.pathname.split('/')[2] == user?.username) navigate('/profile/me')
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
      })
    }).catch((error) => console.log(error)).finally(() => stopLoading());
  }, [profileId])


  const [following, setFollowing] = useState<boolean>(false);
  const [follow, setFollowed] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !userInfo || location.pathname == '/profile/me') return;
    get(`users/${user?.username}`).then((response) => {
      console.log("response: ", response)
      setFollowing(response.following.includes(userInfo._id));
      setFollowed(response.followers.includes(userInfo._id));
    }).catch((error) => console.log(error));
  }, [userInfo, user])

  const handleFollowClick = () => {
    if (!user || !userInfo || location.pathname == '/profile/me') return;
    post('users/follow', { _id: userInfo._id }).then(() => {
      get(`users/${user?.username}`).then((response) => {
        console.log("response: ", response)
        setFollowing(response.following.includes(userInfo._id));
        setFollowed(response.followers.includes(userInfo._id));
      }).catch((error) => console.log(error));
    }).catch((error) => console.log(error));
  }

  return (
    <div className="w-full mx-auto mt-8">
      {
        (userInfo && userInfo?.username) &&
        <>
          <UserInfo self={(profileId === 'me')} following={following} followed={follow} onFollow={handleFollowClick} username={userInfo.username} email={userInfo.email} name={userInfo.name} stats={userInfo.stats} bio={userInfo.bio} profilePicture={userInfo.profilePicture} />
          <Posts posts={userInfo.posts} />
        </>
      }
    </div>
  );
};

export default ProfilePage;
