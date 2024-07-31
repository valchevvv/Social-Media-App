import React, { useContext, useEffect, useState } from 'react'
import { IConversation, ISimpleUser } from './ChatPage';
import { get } from '../../helper/axiosHelper';

import profile_picture from '../../assets/profile_picture.png'
import { useModal } from '../../contexts/ModalContext';
import { useSocketIoHelper } from '../../hooks/useSocket';
import { AuthContext } from '../../contexts/AuthContext';
import { VscSend } from 'react-icons/vsc';

interface INewConversationModalProps {
    conversations: IConversation[];
    setActiveConversation: (conversation: IConversation) => void;
}

const NewConversationModal = ({conversations, setActiveConversation}: INewConversationModalProps) => {
    const [contacts, setContacts] = useState<ISimpleUser[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { hideAllModals } = useModal();
    const { user } = useContext(AuthContext);
    const { socket } = useSocketIoHelper();

    useEffect(() => {
        get('/users/contacts').then((res) => {
            setContacts(res);
        });
    }, []);

    const hasConversationWith = (contact: ISimpleUser) => {
        const userId = user?._id;
        const contactId = contact._id;

        if (!userId || !contactId || !conversations) return false;

        return conversations.find(conversation => 
            conversation.participants.some(participant => participant._id === userId) &&
            conversation.participants.some(participant => participant._id === contactId)
        );
    };

    const startNewConversation = (contact: ISimpleUser) => {
        if (!user || !contact || !socket || !conversations) return;
        const existingConversation = hasConversationWith(contact);
        hideAllModals();
        if (existingConversation) {
            setActiveConversation(existingConversation);
            return;
        }
        socket.emit('new_conversation_b', {
            userId: user._id,
            contactId: contact._id
        });
    };
    
    const trimmedSearchTerm = searchTerm.trim();
    const filteredContacts = trimmedSearchTerm === ''
        ? contacts
        : contacts.filter(contact => 
            contact.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
        );

    return (
        <div className='flex flex-col gap-3 max-h-96 overflow-y-auto'>
            <div className='flex flex-row justify-between items-center bg-gray-50 shadow py-3 rounded-lg'>
                <input 
                    type="text" 
                    className='w-full bg-transparent outline-none px-5 border-r-2' 
                    placeholder='Search person...' 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                />
                <button className='px-3' onClick={() => {}}>
                    <VscSend size={24} />
                </button>
            </div>
            {
                filteredContacts.map((contact) => (
                    <div key={contact._id} className='flex flex-row justify-between items-center bg-gray-50 shadow p-2 rounded-lg'>
                        <div className='flex flex-row gap-3 items-center'>
                            <img src={contact.profilePicture || profile_picture} alt="" className='h-12 aspect-square rounded-full' />
                            <span className='font-semibold'>{contact.name}</span>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-lg text-sm" onClick={() => startNewConversation(contact)}>
                            Message
                        </button>
                    </div>
                ))
            }
        </div>
    )
}

export default NewConversationModal;
