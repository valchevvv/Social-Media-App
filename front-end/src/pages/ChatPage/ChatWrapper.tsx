import React from 'react'

export interface ISimpleUserInfo {
    _id: string,
    profilePicture: string,
    name: string,
    lastAction: string
}

interface IChatWrapperProps {
    chats: ISimpleUserInfo[],
    activeChat: string,
    setActiveChat: (index: string) => void
}

const ChatWrapper = ({chats, activeChat, setActiveChat}: IChatWrapperProps) => {
    return (
        <div className='w-[20%] bg-gray-600 h-screen overflow-y-auto'>
            {
                chats.map((user, index) => {
                    return <div key={index} className={`w-full h-20 ${(activeChat === user._id ? " bg-gray-700" : "bg-gray-600")} hover:bg-gray-700 cursor-pointer flex flex-row gap-3 items-center p-2`} onClick={() => setActiveChat(user._id)}>
                        <img src={user.profilePicture} alt={"username"} className='h-12 aspect-square' />
                        <div className='flex flex-col'>
                            <span className='font-semibold text-white'>{user.name}</span>
                            <span className='font-semibold text-sm text-gray-100'>{user.lastAction}</span>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ChatWrapper