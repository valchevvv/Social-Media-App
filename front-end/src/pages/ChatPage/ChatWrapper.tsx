import { IConversation } from './ChatPage'
import profile_picture from '../../assets/profile_picture.png'
import { BsPencilSquare } from "react-icons/bs";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import NewConversationModal from './NewConversationModal';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';


interface IChatWrapperProps {
    conversations: IConversation[],
    activeChat: IConversation | null,
    setActiveChat: (conversation: IConversation) => void
    getConversationName: (conversation: IConversation) => string
}

const ChatWrapper = ({ conversations, activeChat, setActiveChat, getConversationName }: IChatWrapperProps) => {
    const { user } = useContext(AuthContext);
    const { showModal } = useModal();
    const navigate = useNavigate();


    const getLastAction = (conversation: IConversation) => {
        if(conversation.lastMessage) {
            if(conversation.lastMessage.sender._id === user?._id) {
                return `You: ${conversation.lastMessage.content}`
            } else {
                return `${conversation.lastMessage.sender.name}: ${conversation.lastMessage.content}`
            }
        } else {
            return "No messages yet"
        }
    }

    return (
        <div className='w-[100%] laptop:w-[20%] bg-gray-600 h-screen overflow-y-auto'>
            <div className="mobile:hidden w-full h-20 bg-gray-600 cursor-pointer border-b-2 flex flex-row justify-between items-center p-5 text-white">
                <span className='font-semibold text-2xl'>{user?.username || "Messages"}</span>
                <BsPencilSquare size={24} onClick={() => {
                    showModal({
                        title: "New Conversation",
                        size: "small",
                        content: <NewConversationModal conversations={conversations} setActiveConversation={setActiveChat} />,
                    })
                }} />
            </div>
            
            <div className='laptop:hidden h-[7%] w-full bg-gray-700 text-white shadow-2xl flex flex-row items-center h-[100%]'>
                <div className='laptop:hidden h-full aspect-square flex items-center justify-center' onClick={() => navigate("/")} >
                    <IoMdArrowBack size={24} />
                </div>
                <div className='flex flex-row justify-between items-center w-full pr-5'>
                    <span className='font-semibold text-lg'>{user?.username.toLocaleUpperCase() || "Messages"}</span>
                    <BsPencilSquare size={24} onClick={() => {
                        showModal({
                            title: "New Conversation",
                            size: "small",
                            content: <NewConversationModal conversations={conversations} setActiveConversation={setActiveChat} />,
                        })
                    }} />
                </div>
            </div>

            {
                conversations.map((conversation, index) => {
                    return <div key={index} className={`w-full h-20 ${(activeChat?._id === conversation._id ? " bg-gray-700" : "bg-gray-600")} hover:bg-gray-700 cursor-pointer flex flex-row gap-3 items-center p-5 laptop:p-2`} onClick={() => setActiveChat(conversation)}>
                        <img src={conversation.participants[1].profilePicture || profile_picture} alt={"username"} className='h-12 aspect-square rounded-full' />
                        <div className='flex flex-col'>
                            <span className='font-semibold text-white'>{getConversationName(conversation)}</span>
                            <span className='font-semibold text-sm text-gray-300'>{getLastAction(conversation)}</span>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ChatWrapper