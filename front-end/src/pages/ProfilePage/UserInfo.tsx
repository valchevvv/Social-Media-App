import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import profile_picture from '../../assets/profile_picture.png';
import EditProfile from './Edit';
import { useModal } from "../../contexts/ModalContext";
import { useContext, useEffect, useState } from "react";
import { get } from "../../helper/axiosHelper";
import FollowerCard from "./FollowerCard";
import { useSocketIoHelper } from "../../hooks/useSocket";
import { AuthContext } from "../../contexts/AuthContext";

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

export interface IUserSimpleInfo {
  _id: string;
  profilePicture?: string;
  name: string;
  username: string;
}

const UserInfo = (userData: UserInfoProps) => {
  const { showModal } = useModal();

  const { socket } = useSocketIoHelper();
  const { user } = useContext(AuthContext);


  const [followers, setFollowers] = useState<IUserSimpleInfo[]>([]);
  const [following, setFollowing] = useState<IUserSimpleInfo[]>([]);

  const updateFollows = async () => {
    get(`/users/followers/${userData.username}`)
      .then((res) => setFollowers(res))
      .then(() => get(`/users/following/${userData.username}`).then((res) => setFollowing(res)))

    userData.stats.followers = followers.length;
    userData.stats.following = following.length;
  }

  useEffect(() => {
    updateFollows();
  }, []);

  const handleUnfollowCallback = () => {
    updateFollows();
  }

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on('unfollow_f', handleUnfollowCallback);

    return () => {
      socket.off('unfollow_f', handleUnfollowCallback);
    };
  }, [socket, user?._id]);

  const onUnfollow = (id: string, type: string) => {
    if (!socket || !user || !userData.self) return;
    socket.emit('unfollow_b', {
      userId: user._id,
      followId: id,
      type
    });
  }

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
                      isRequired: true
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
              <span className="hover:underline cursor-pointer" onClick={() => {
                if(followers.length === 0) return;
                showModal({
                  title: 'Followers',
                  size: 'small',
                  content: <div className='flex flex-col gap-2'>{
                    followers.map((follower) => <FollowerCard key={follower._id} permission={userData.self} data={follower} follower={true} onUnfollow={() => onUnfollow(follower._id, 'remove')} />)
                  }</div>,
                  isRequired: false
                });
              }}>
                <span className="font-semibold">{userData.stats.followers}</span> followers
              </span>
              <span className="hover:underline cursor-pointer" onClick={() => {
                if(following.length === 0) return;
                showModal({
                  title: 'Following',
                  size: 'small',
                  content: <div className='flex flex-col gap-2 max-h-96 overflow-y-auto p-2'>{
                    following.map((follower) => <FollowerCard key={follower._id} permission={userData.self} data={follower} follower={false} onUnfollow={() => onUnfollow(follower._id, 'unfollow')} />)
                  }</div>,
                  isRequired: false
                });
              }}>
                <span className="font-semibold">{userData.stats.following}</span> following
              </span>
            </div>
            <div>
              <div className="font-semibold">{userData.name}</div>
              <div className="text-sm font-semibold text-gray-500">{userData.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
