import React, { useEffect, useState } from 'react'
import { useSidebarContext } from '../../contexts/SidebarContext'
import profile_picture from "../../assets/profile_picture.png"
import { VscSend } from 'react-icons/vsc';
import { IoInformationCircleOutline } from "react-icons/io5";
import ChatWrapper, { ISimpleUserInfo } from './ChatWrapper';
import ChatHeader from './ChatHeader';
import ChatContent, { IMessage } from './ChatContent';

const ChatPage = () => {
    const { isCollapsed, toggleSidebar } = useSidebarContext();

    useEffect(() => {
        if(!isCollapsed) toggleSidebar();
    }, [])

    const [activeChat, setActiveChat] = useState<string>("");

    const data: ISimpleUserInfo[] = [
        {
            _id: "1",
            profilePicture: profile_picture,
            name: "Daniel Valchev",
            lastAction: "You: Zdrawei"
        },
        {
            _id: "2",
            profilePicture: profile_picture,
            name: "Ivan Georgiev",
            lastAction: "Ivan: Zdravei"
        }
    ]

    const messages: IMessage[] = [
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
        <ChatWrapper chats={data} activeChat={activeChat} setActiveChat={(index) => setActiveChat(index)} />
        {
            activeChat && 
            <div className='w-[80%] bg-gray-700 h-screen flex flex-col'>
                <ChatHeader name={data.find(x=> x._id == activeChat)!.name} profilePicture={data.find(x=> x._id == activeChat)!.profilePicture} />
                <ChatContent messages={messages} />
            </div>
        }
        
    </div>
  )
}

export default ChatPage