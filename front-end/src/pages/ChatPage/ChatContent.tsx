import React, { useContext } from 'react'
import { VscSend } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/AuthContext';
import profile_picture from '../../assets/profile_picture.png'

export interface IMessage {
    _id: string;
    conversation: string;
    sender: {
        _id: string;
        username: string;
        name: string;
        profilePicture: string;
    };
    content: string;
    date: Date;
}

const ChatContent = ({ messages }: {
    messages: IMessage[]
}) => {
    console.log("messages", messages)

    const { user } = useContext(AuthContext);

    const isMine = (message: IMessage) => {
        return message.sender._id === user?._id;
    }

    return (
        <>
            <div className='p-5 overflow-y-auto h-[93%]'>
                {
                    messages.map((message, index) => {
                        return <div key={index} className={`flex flex-row gap-2 ${isMine(message) ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-row items-end gap-2 w-fit max-w-[50%] p-2 rounded-lg`}>
                                {
                                    !isMine(message) && <img src={message.sender.profilePicture || profile_picture} alt="" className='h-6' />
                                }
                                <span className={`font-semibold text-white p-2 rounded-lg ${(isMine(message) ? "bg-gray-500" : "bg-blue-500")}`}>{message.content}</span>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className="bg-gray-700 border-t-2 border-white border-opacity-10 z-50 shadow-2xl w-full h-[60px] text-white flex flex-row justify-center">
                <input type="text" className='w-full bg-transparent outline-none px-5 border-r-2' placeholder='Enter message...' />
                <button className='px-3'>
                    <VscSend size={24} />
                </button>
            </div>
        </>
    )
}

export default ChatContent