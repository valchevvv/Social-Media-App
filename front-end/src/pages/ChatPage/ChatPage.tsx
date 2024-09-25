import { useContext, useEffect, useState } from 'react';

import profile_picture from '../../assets/profile_picture.png';
import { AuthContext } from '../../contexts/AuthContext';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { useModal } from '../../contexts/ModalContext';
import { useSidebarContext } from '../../contexts/SidebarContext';
import { get } from '../../helper/axiosHelper';
import { useSocketIoHelper } from '../../hooks/useSocket';
import ChatContent, { IMessage } from './ChatContent';
import ChatHeader from './ChatHeader';
import ChatWrapper from './ChatWrapper';
import NewConversationModal from './NewConversationModal';

export interface ISimpleUser {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface IConversation {
  _id: string;
  participants: ISimpleUser[];
  lastMessage: IMessage;
  createdAt: Date;
}

const ChatPage = () => {
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const { startLoading, stopLoading } = useLoadingSpinner();
  const { user } = useContext(AuthContext);
  const { socket } = useSocketIoHelper();
  const { showModal } = useModal();

  useEffect(() => {
    if (!isCollapsed) toggleSidebar();
  }, []);

  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const updateConversation = (conversation: IConversation) => setActiveConversation(conversation);

  useEffect(() => {
    startLoading();
    get('/conversations')
      .then(res => {
        setConversations(res);
        const conversations: IConversation[] = res;
        if (res.length === 0) {
          showModal({
            title: 'New Conversation',
            size: 'medium',
            content: (
              <NewConversationModal
                conversations={conversations}
                setActiveConversation={updateConversation}
              />
            ),
          });
        }
      })
      .finally(() => stopLoading());
  }, []);

  const handleNewMessage = (newMessage: IMessage) => {
    setConversations(conversations => {
      const conversationIndex = conversations.findIndex(
        conversation => conversation._id === newMessage.conversation,
      );
      if (conversationIndex === -1) return conversations;

      const updatedConversation = {
        ...conversations[conversationIndex],
        lastMessage: newMessage,
      };
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = updatedConversation;
      return updatedConversations;
    });

    setMessages(messages => {
      if (messages.some(message => message._id === newMessage._id)) {
        return messages;
      }
      return [...messages, newMessage];
    });
  };

  const handleNewConversation = (newConversation: IConversation) => {
    setConversations(conversations => {
      if (conversations.some(conversation => conversation._id === newConversation._id)) {
        return conversations;
      }
      return [...conversations, newConversation];
    });
    setActiveConversation(newConversation);
  };

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on('new_message_f', handleNewMessage);
    socket.on('new_conversation_f', handleNewConversation);

    return () => {
      socket.off('new_message_f', handleNewMessage);
      socket.off('new_conversation_f', handleNewConversation);
    };
  }, [socket, user?._id]);

  useEffect(() => {
    if (!activeConversation?._id) return;

    get(`/conversations/${activeConversation._id}`).then(res => setMessages(res));
  }, [activeConversation]);

  const getConversationName = (conversation: IConversation) => {
    if (!user) return '';

    const otherParticipants = conversation.participants.filter(
      participant => participant._id !== user._id,
    );
    if (otherParticipants.length > 1)
      return `${otherParticipants[0].name} and ${otherParticipants.length - 1} others`;
    return otherParticipants[0].name;
  };

  const newMessage = (message: string) => {
    if (!activeConversation || !socket || !user) return;
    console.log(message);
    socket.emit('new_message_b', {
      userId: user._id,
      conversationId: activeConversation._id,
      content: message,
    });
  };

  return (
    <>
      {conversations && conversations.length > 0 ? (
        <div className="w-[100%] h-screen bg-gray-700 flex flex-row">
          <div className="hidden laptop:flex flex-row w-[100%]">
            <ChatWrapper
              conversations={conversations}
              activeChat={activeConversation}
              setActiveChat={conversation => setActiveConversation(conversation)}
              getConversationName={getConversationName}
            />
            {activeConversation ? (
              <div className="w-[80%] bg-gray-700 h-screen flex flex-col">
                <ChatHeader
                  name={getConversationName(activeConversation) || ''}
                  profilePicture={
                    activeConversation.participants[1].profilePicture || profile_picture
                  }
                />
                <ChatContent onMessage={newMessage} messages={messages} />
              </div>
            ) : (
              <div className="w-[80%] bg-gray-700 h-screen flex flex-col items-center justify-center text-white font-semibold text-2xl">
                Select a conversation to start chatting
              </div>
            )}
          </div>
          <div className="laptop:hidden w-[100%]">
            {activeConversation ? (
              <div className="w-[100%] bg-gray-700 h-screen flex flex-col">
                <ChatHeader
                  name={getConversationName(activeConversation) || ''}
                  onBackClick={() => setActiveConversation(null)}
                  profilePicture={
                    activeConversation.participants[1].profilePicture || profile_picture
                  }
                />
                <ChatContent onMessage={newMessage} messages={messages} />
              </div>
            ) : (
              <ChatWrapper
                conversations={conversations}
                activeChat={activeConversation}
                setActiveChat={conversation => setActiveConversation(conversation)}
                getConversationName={getConversationName}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-[100%] h-screen bg-gray-700 flex flex-row text-white justify-center items-center font-bold">
          <span>Create a new conversation to start chatting</span>
        </div>
      )}
    </>
  );
};

export default ChatPage;
