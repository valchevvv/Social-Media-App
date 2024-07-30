import { IConversation } from './ChatPage'
import profile_picture from '../../assets/profile_picture.png'
import { BsPencilSquare } from "react-icons/bs";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import NewConversationModal from './NewConversationModal';


interface IChatWrapperProps {
    conversations: IConversation[],
    activeChat: IConversation | null,
    setActiveChat: (conversation: IConversation) => void
    getConversationName: (conversation: IConversation) => string
}

const ChatWrapper = ({ conversations, activeChat, setActiveChat, getConversationName }: IChatWrapperProps) => {
    const { user } = useContext(AuthContext);
    const { showModal } = useModal();

    return (
        <div className='w-[20%] bg-gray-600 h-screen overflow-y-auto'>
            <div className="w-full h-20 bg-gray-600 cursor-pointer border-b-2 flex flex-row justify-between items-center p-5 text-white">
                <span className='font-semibold text-2xl'>{user?.username || "Messages"}</span>
                <BsPencilSquare size={24} onClick={() => {
                    showModal({
                        title: "New Conversation",
                        size: "small",
                        content: <NewConversationModal />,
                    })
                }} />
            </div>
            {
                conversations.map((conversation, index) => {
                    return <div key={index} className={`w-full h-20 ${(activeChat?._id === conversation._id ? " bg-gray-700" : "bg-gray-600")} hover:bg-gray-700 cursor-pointer flex flex-row gap-3 items-center p-2`} onClick={() => setActiveChat(conversation)}>
                        <img src={conversation.participants[1].profilePicture || profile_picture} alt={"username"} className='h-12 aspect-square rounded-full' />
                        <div className='flex flex-col'>
                            <span className='font-semibold text-white'>{getConversationName(conversation)}</span>
                            <span className='font-semibold text-sm text-gray-300'>{conversation.lastMessage || "No messages yet"}</span>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ChatWrapper