import { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import MessageComponent from './MessageComponent';
import ChatFooter from './ChatFooter';

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

const ChatContent = ({ messages, onMessage }: {
    messages: IMessage[]
    onMessage: (message: string) => void
}) => {
    const { user } = useContext(AuthContext);

    const isMine = (message: IMessage) => {
        return message.sender._id === user?._id;
    }

    const [message, setMessage] = useState<string>('');

    const sendMessage = () => {
        if (message.trim() === '') return;
        setMessage('');
        onMessage(message);
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className='p-5 overflow-y-auto h-[93%] mobile:mt-[15%] mobile:pb-[20%] tablet:mt-[15%] tablet:pb-[20%] laptop:mt-0 laptop:pb-0'>
                {
                    messages.map((message, index) => {
                        const isLastFromUser = index === messages.length - 1 || messages[index + 1].sender._id !== message.sender._id;
                        console.log(message.sender)
                        return <MessageComponent key={message._id} message={message} isMine={isMine} isLastFromUser={isLastFromUser} />
                    })
                }
                <div ref={messagesEndRef} />
            </div>
            <ChatFooter message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </>
    )
}

export default ChatContent
