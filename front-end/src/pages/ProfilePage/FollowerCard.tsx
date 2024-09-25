import { useState } from 'react';

import profile_picture from '../../assets/profile_picture.png';
import { IUserSimpleInfo } from './UserInfo';

const FollowerCard = ({
  data,
  follower,
  permission,
  onUnfollow,
}: {
  data: IUserSimpleInfo;
  follower: boolean;
  permission: boolean;
  onUnfollow: () => void;
}) => {
  const [isUnfollow, setIsUnfollow] = useState(false);

  return (
    <div className="flex justify-between items-center p-2 shadow bg-gray-50 border rounded-lg ">
      <div className="flex flex-row items-center gap-4">
        <img
          className="w-10 h-10 rounded-full"
          src={data.profilePicture || profile_picture}
          alt={`${data.username}'s profile`}
        />
        <div className="flex flex-col">
          <span className="font-semibold">{data.name}</span>
          <span className="text-sm">{data.username}</span>
        </div>
      </div>
      {!isUnfollow && permission && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-lg text-sm"
          onClick={() => {
            setIsUnfollow(true);
            onUnfollow();
          }}
        >
          {follower ? 'Remove' : 'Unfollow'}
        </button>
      )}
    </div>
  );
};

export default FollowerCard;
