// src/components/userData.tsx
import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";

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
  self: boolean;
  following: boolean;
  followed: boolean;
  onFollow: () => void;
}

const UserInfo = (userData: UserInfoProps) => {
  const { showModal } = useModal();

  return (
    <div className="p-4">
      <div className="flex flex-col items-center laptop:flex-row laptop:items-center laptop:space-x-6 border-b border-gray-300 pb-4">
        <img
          className="h-24 w-24 laptop:h-32 laptop:w-32 rounded-full"
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
                  })
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
                  <>
                    <SlUserUnfollow />
                    Unfollow
                  </>
                  : 
                  userData.followed ?
                  <>
                    <SlUserFollow />
                    Follow back
                  </>
                  :
                  <>
                    <SlUserFollow />
                    Follow
                  </>
                }
              </button>
            }
          </div>
          <div className='flex laptop:flex-col mobile:flex-col-reverse justify-between mobile:items-center my-4 gap-4'>
            <div className="flex flex-row justify-between space-x-10">
              <span><span className="font-semibold">{userData.stats.posts}</span> posts</span>
              <span><span className="font-semibold">{userData.stats.followers}</span> followers</span>
              <span><span className="font-semibold">{userData.stats.following}</span> following</span>
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
