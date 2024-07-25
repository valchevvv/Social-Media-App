import React from 'react'

interface FollowCardProps {
   _id: string;
    username: string;
    name: string;
    profilePicture?: string;
    follower: boolean;
}

const FollowCard = (data: FollowCardProps) => {
  return (
    <p>
        {JSON.stringify(data, null, 2)}
    </p>
  )
}

export default FollowCard