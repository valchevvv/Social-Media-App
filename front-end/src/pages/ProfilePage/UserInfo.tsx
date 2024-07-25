// src/components/userData.tsx
import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";

import profile_picture from '../../assets/profile_picture.png';
import { useModal } from '../../contexts/ModalContext';
import EditProfile from './Edit';
import { useEffect, useState } from "react";
import { get } from "../../helper/axiosHelper";
import { useLoadingSpinner } from "../../contexts/LoadingSpinnerContext";
import FollowCard from "./FollowCard";

interface UserInfoProps {
  username: string;
  name: string;
  email: string;
  stats: { posts: number; followers: number; following: number };
  bio: string;
  profilePicture: string;
  self: boolean;
  following: boolean;
  followed: boolean;
  onFollow: () => void;
}

interface IUserSimpleInfo {
  _id: ObjectId;
  profilePicture?: string;
  name: string;
  username: string;
}

const UserInfo = (userData: UserInfoProps) => {
  const { showModal } = useModal();
  const { startLoading, stopLoading } = useLoadingSpinner();

  const [followers, setFollowers] = useState<IUserSimpleInfo[]>([]);
  const [following, setFollowing] = useState<IUserSimpleInfo[]>([]);

  useEffect(() => {
    startLoading();
    get(`/users/followers`)
      .then((res) => {
        setFollowers(res);
        get(`/users/following`).then((res) => setFollowing(res))
      })
      .finally(() => stopLoading());
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center laptop:flex-row laptop:items-center laptop:space-x-6 border-b border-gray-300 pb-4">
        <img
          className="h-32 w-32 laptop:h-40 laptop:w-40 rounded-full"
          src={userData.profilePicture || profile_picture}
          alt={`${userData.username}'s profile`}
        />
        <div className="flex flex-col items-center laptop:items-start mt-4 laptop:mt-0 laptop:ml-4">
          <div className="flex laptop:flex-row mobile:flex-col-reverse items-center gap-2 text-left">
            <span className="text-xl font-semibold">{userData.username}</span>
            {
              userData.self ? 
              <button
                onClick={() => {
                  showModal({
                    title: 'Edit Profile',
                    size: 'large',
                    content: <EditProfile username={userData.username} email={userData.email} bio={userData.bio} name={userData.name} profilePicture={userData.profilePicture} />,
                    isRequired: false
                  });
                }}
                className="px-4 py-1 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center gap-2"
              >
                <FaUserEdit />
                Edit
              </button>
              : 
              <button
                onClick={userData.onFollow}
                className="px-4 py-1 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center gap-2"
              >
                {
                  userData.following ? 
                  <><SlUserUnfollow />Unfollow</>
                  : userData.followed ?
                  <><SlUserFollow />Follow back</>
                  : <><SlUserFollow />Follow</>
                }
              </button>
            }
          </div>
          <div className='flex laptop:flex-col mobile:flex-col-reverse justify-between mobile:items-center my-4 gap-4'>
            <div className="flex flex-row justify-between space-x-10">
              <span><span className="font-semibold">{userData.stats.posts}</span> posts</span>
              <span className="cursor-pointer hover:underline" onClick={() => {
                if (followers && followers.length > 0) showModal({
                  title: 'Followers',
                  size: 'medium',
                  content: <>{followers.map((follower, index) => <FollowCard key={index} _id={follower._id} name={follower.name} username={follower.username} profilePicture={follower.profilePicture} follower={true} />)}</>
                });
              }}><span className="font-semibold">{userData.stats.followers}</span> followers</span>
              <span className="cursor-pointer hover:underline" onClick={() => {
                if (following && following.length > 0) showModal({
                  title: 'Following',
                  size: 'medium',
                  content: <>{following.map((following, index) => <FollowCard key={index} _id={following._id} name={following.name} username={following.username} profilePicture={following.profilePicture} follower={false} />)}</>
                });
              }}>
              <span className="font-semibold">{userData.stats.following}</span> following</span>
            </div>
            <div>
              <div className="text-lg font-semibold">{userData.name}</div>
              <div className="text-base text-gray-500">{userData.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
