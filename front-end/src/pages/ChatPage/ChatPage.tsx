import { useContext, useEffect, useState } from 'react'
import { useSidebarContext } from '../../contexts/SidebarContext'
import profile_picture from "../../assets/profile_picture.png"
import ChatWrapper from './ChatWrapper';
import ChatHeader from './ChatHeader';
import ChatContent, { IMessage } from './ChatContent';
import { get } from '../../helper/axiosHelper';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useSocketIoHelper } from '../../hooks/useSocket';


interface ISimpleUser {
    _id: string;
    name: string;
    profilePicture: string;
}

export interface IConversation {
    _id: string;
    participants: ISimpleUser[];
    lastMessage: string;
    createdAt: Date;
}

const ChatPage = () => {
    const { isCollapsed, toggleSidebar } = useSidebarContext();
    const { startLoading, stopLoading } = useLoadingSpinner();
    const { user } = useContext(AuthContext);
    const { socket } = useSocketIoHelper();

    useEffect(() => {
        if (!isCollapsed) toggleSidebar();
    }, []);

    const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [conversations, setConversations] = useState<IConversation[]>([]);

    useEffect(() => {
        startLoading();
        get("/conversations").then((res) => setConversations(res))
        .finally(() => stopLoading());
    }, []);

    const handleNewMessage = (newMessage: IMessage) => {
        setMessages(messages => {
            // Check if the new message already exists in the messages array
            if (messages.some(message => message._id === newMessage._id)) {
                return messages; // If it already exists, return the current messages array
            }
            return [...messages, newMessage];
        });
    };

    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.on('new_message_f', handleNewMessage);

        return () => {
            socket.off('new_message_f', handleNewMessage);
        };
    }, [socket, user?._id]);

    useEffect(() => {
        if (!activeConversation?._id) return;

        get(`/conversations/${activeConversation._id}`).then((res) => setMessages(res));
    }, [activeConversation]);

    const getConversationName = (conversation: IConversation) => {
        if (!user) return;

        const otherParticipants = conversation.participants.filter(participant => participant._id !== user._id);
        if (otherParticipants.length > 1) return `${otherParticipants[0].name} and ${otherParticipants.length - 1} others`;
        return otherParticipants[0].name;
    };

    const newMessage = (message: string) => {
        if (!activeConversation || !socket || !user) return;
        console.log(message);
        socket.emit('new_message_b', {
            userId: user._id,
            conversationId: activeConversation._id,
            content: message
        });
    };

    return (
        <div className='w-[100%] h-screen bg-black flex flex-row'>
            <ChatWrapper conversations={conversations} activeChat={activeConversation} setActiveChat={(conversation) => setActiveConversation(conversation)} getConversationName={getConversationName} />
            {
                activeConversation &&
                <div className='w-[80%] bg-gray-700 h-screen flex flex-col'>
                    <ChatHeader name={getConversationName(activeConversation) || ""} profilePicture={activeConversation.participants[1].profilePicture || profile_picture} />
                    <ChatContent onMessage={newMessage} messages={messages} />
                </div>
            }
        </div>
    )
}

export default ChatPage;
