import React from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import profile_picture from '../../assets/profile_picture.png'

interface IChatHeaderProps {
    name: string;
    profilePicture: string;
}

const ChatHeader = (data: IChatHeaderProps) => {
    return (
        <div className='h-[7%] bg-gray-700 text-white shadow-2xl flex flex-row items-center justify-between px-5'>
            <div className='h-[100%] flex flex-row items-center gap-2'>
                <img src={data.profilePicture || profile_picture} alt="" className='h-[60%]' />
                <span className='text-lg font-semibold'>{data.name}</span>
            </div>
            <IoInformationCircleOutline size={32} />
        </div>
    )
}

export default ChatHeader