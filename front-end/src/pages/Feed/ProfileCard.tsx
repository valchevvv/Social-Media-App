import React, { useContext, useState } from 'react'
import profilePicture from '../../assets/profile_picture.png'
import { IoPersonAddSharp } from "react-icons/io5";
import { GoPersonFill } from "react-icons/go";
import { useSocketIoHelper } from '../../hooks/useSocket';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export interface ProfileCardProps {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
}

const ProfileCard = (data: ProfileCardProps) => {
  const { socket } = useSocketIoHelper();
  const { user } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  const follow = () => {
    if(!socket || !user || !data || followed) return;
    socket.emit('follow_b', { userId: user._id, followId: data._id });
    setFollowed(true);
  }

  return (
    <div className='border-2 shadow rounded-xl p-3 flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2'>
            <img src={data.profilePicture || profilePicture} className='h-10 rounded-full' alt="" />
            <Link to={`profile/${data.username}`} className='flex flex-col cursor-pointer'>
                <span className='font-semibold'>{data.name}</span>
                <span className='text-gray-500 text-sm font-semibold'>@{data.username}</span>
            </Link>
        </div>
        {
          !followed ? <IoPersonAddSharp onClick={follow} className='cursor-pointer' size={24} />
          :
          <GoPersonFill className='cursor-pointer' size={24} />
        }
    </div>
  )
}

export default ProfileCard