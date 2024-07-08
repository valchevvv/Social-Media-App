// src/components/UserInfo.tsx
import React, { useState } from 'react';
import { FaUserEdit } from "react-icons/fa";

import profile_picture from '../../assets/profile_picture.png';
import { useModal } from '../../contexts/ModalContext';
import EditProfile from './Edit';

interface UserInfoProps {
  username: string;
  name: string;
  email: string;
  stats: { posts: number; followers: number; following: number };
  bio: string;
  profilePicture: string;
}

const UserInfo = (userData: UserInfoProps) => {


  const { showModal } = useModal();

  const [userInfo, setUserInfo] = useState<UserInfoProps>(userData);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center laptop:flex-row laptop:items-center laptop:space-x-6 border-b border-gray-300 pb-4">
        <img
          className="h-24 w-24 laptop:h-32 laptop:w-32 rounded-full"
          src={userInfo.profilePicture || profile_picture}
          alt={`${userInfo.username}'s profile`}
        />
        <div className="flex flex-col items-center laptop:items-start mt-4 laptop:mt-0 laptop:ml-4">
          <div className="flex flex-row items-start gap-2 text-center text-left">
            <span className="text-xl font-semibold">{userInfo.username}</span>
            <button
              onClick={() => {
                showModal({
                  title: 'Edit Profile',
                  content: <EditProfile username={userInfo.name} email={userInfo.email} bio={userInfo.bio} name={userInfo.name} profilePicture={userInfo.profilePicture} />,
                  isRequired: false
                })
              }}
              className="px-4 py-1 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center gap-2"
            >
              <FaUserEdit />
              Edit
            </button>
          </div>
          <div className='flex laptop:flex-col mobile:flex-col-reverse justify-between my-4 gap-4'>
            <div className="flex flex-row justify-between space-x-10">
              <span><span className="font-semibold">{userInfo.stats.posts}</span> posts</span>
              <span><span className="font-semibold">{userInfo.stats.followers}</span> followers</span>
              <span><span className="font-semibold">{userInfo.stats.following}</span> following</span>
            </div>
            <div>
              <div className="text-lg font-semibold">{userInfo.name}</div>
              <div className="text-base text-gray-500">{userInfo.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
