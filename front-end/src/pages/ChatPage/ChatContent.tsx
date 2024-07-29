import React from 'react'
import { VscSend } from 'react-icons/vsc';

export interface IMessage {
    profilePicture: string,
    message: string,
    isMine: boolean
}

const ChatContent = ({ messages }: {
    messages: IMessage[]
}) => {
    return (
        <>
            <div className='p-5 overflow-y-auto h-[93%]'>
                {
                    messages.map((message, index) => {
                        return <div key={index} className={`flex flex-row gap-2 ${message.isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-row items-end gap-2 w-fit max-w-[50%] p-2 rounded-lg`}>
                                {
                                    !message.isMine && <img src={message.profilePicture} alt="" className='h-6' />
                                }
                                <span className={`font-semibold text-white p-2 rounded-lg ${(message.isMine ? "bg-gray-500" : "bg-blue-500")}`}>{message.message}</span>
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