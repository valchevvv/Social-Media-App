import React, { useEffect, useState } from 'react'
import { useSidebarContext } from '../../contexts/SidebarContext'
import profile_picture from "../../assets/profile_picture.png"

const ChatPage = () => {
    const { isCollapsed, toggleSidebar } = useSidebarContext();

    useEffect(() => {
        if(!isCollapsed) toggleSidebar();
    }, [])

    const [activeChat, setActiveChat] = useState<number>(-1);

    const data = [
        {
            profilePicture: profile_picture,
            name: "Daniel Valchev",
            lastAction: "You: Zdrawei"
        },
        {
            profilePicture: profile_picture,
            name: "Ivan Georgiev",
            lastAction: "Ivan: Zdravei"
        }
    ]

    const messages = [
        {
            profilePicture: profile_picture,
            message: "Hello World",
            isMine: true
        },
        {
            profilePicture: profile_picture,
            message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore officia consequatur autem repellat fugit, at nulla molestiae reprehenderit numquam beatae pariatur porro magnam voluptatibus commodi amet culpa dolor illo molestias!",
            isMine: false
        }
    ]

  return (
    <div className='w-[100%] h-screen bg-black flex flex-row'>
        <div className='w-[20%] bg-gray-600 h-screen overflow-y-auto'>
            {
                [...Array(100).keys()].map((_, index) => {
                    const user = data[index % 2 === 0 ? 0 : 1];
                    return <div key={index} className={`w-full h-20 ${(activeChat === index ? " bg-gray-700": "bg-gray-600")} hover:bg-gray-700 cursor-pointer flex flex-row gap-3 items-center p-2`} onClick={() => setActiveChat(index)}>
                        <img src={user.profilePicture} alt={"username"} className='h-12 aspect-square' />
                        <div className='flex flex-col'>
                            <span className='font-semibold text-white'>{user.name}</span>
                            <span className='font-semibold text-sm text-gray-100'>{user.lastAction}</span>
                        </div>
                    </div>
                })
            }
        </div>
        <div className='w-[80%] bg-gray-700 h-screen flex flex-col'>
            <div className='h-[7%] bg-white shadow-2xl'>
            </div>
            <div className='h-[93%] p-5 overflow-y-auto'>
                {
                    [...Array(100).keys()].map((_, index) => {
                        const message = messages[index % 2 === 0 ? 0 : 1];
                        return <div key={index} className={`flex flex-row gap-2 ${message.isMine ? "justify-end": "justify-start"}`}>
                            <div className={`flex flex-row items-end gap-2 w-fit max-w-[50%] p-2 rounded-lg`}>
                                {
                                    !message.isMine && <img src={message.profilePicture} alt="" className='h-6' />
                                }
                                <span className={`font-semibold text-white p-2 rounded-lg ${(message.isMine ? "bg-gray-500" : "bg-blue-500")}`}>{message.message}</span>
                            </div>
                        </div>
                    })
                }
                <div className="bg-gray-800 z-50 shadow sticky bottom-1 p-2 w-full h-[60px] text-white flex flex-row justify-center rounded-2xl backdrop-blur bg-opacity-60">
                    
                    <div className={`flex flex-col gap-1 justify-center items-center text-white w-full bg-opacity-10 rounded-xl`}>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatPage