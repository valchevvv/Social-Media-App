// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import Posts from './Posts';
import { useLocation } from 'react-router-dom';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { get } from '../../helper/axiosHelper';

import profile_picture from '../../assets/profile_picture.png';

interface UserInfo {
  username: string;
  name: string;
  email: string;
  stats: { posts: number; followers: number; following: number };
  bio: string;
  profilePicture: string;
  posts: {
    _id: string;
    author: string;
    content: string;
    image: string;
    likes: string[];
    comments: string[];
    createdAt: string;
  }[]
}

const ProfilePage = () => {
  const location = useLocation();
  const profileId = location.pathname.split('/')[2];

  const { startLoading, stopLoading } = useLoadingSpinner();

  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    startLoading();
    get(`users/${profileId}`).then((response) => {
      if (!response) {
        console.error('Failed to fetch user info');
        return;
      }
      setUserInfo({
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

  return (
    <div className="w-full mx-auto mt-8">
      {
        (userInfo && userInfo?.username) &&
        <>
          <UserInfo username={userInfo.username} email={userInfo.email} name={userInfo.name} stats={userInfo.stats} bio={userInfo.bio} profilePicture={userInfo.profilePicture} />
          <Posts posts={userInfo.posts} />
        </>
      }
    </div>
  );
};

export default ProfilePage;
